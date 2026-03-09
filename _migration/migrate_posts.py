"""
Migrate WordPress posts to Jekyll markdown via REST API.
Fetches all posts, categories, and tags from stephenkinsella.net
and writes Jekyll-compatible markdown files to _posts/
"""
import json
import os
import re
import sys
import time
from datetime import datetime
from pathlib import Path
from html import unescape

import requests
from bs4 import BeautifulSoup

BASE_URL = "https://www.stephenkinsella.net/wp-json/wp/v2"
SITE_DIR = Path(__file__).resolve().parent.parent
POSTS_DIR = SITE_DIR / "_posts"
IMAGE_LOG = SITE_DIR / "_migration" / "image_urls.txt"

# Category ID → simplified Jekyll category name
# Built from the WordPress category hierarchy
CATEGORY_MAP = {
    # Top-level
    1: "General",
    707: "Diary",
    680: "INET",
    504: "Ireland 2050",
    708: "Lectures",
    472: "Media",
    2: "New School",
    709: "Publications",
    681: "QuickWin",
    503: "Media",       # Rants → Media
    24: "Research",
    705: "Talks",
    11: "Teaching",
    12: "UL",
    # Children of General (1)
    473: "General",     # Bizcamp
    34: "General",      # Blogroll
    143: "Media",       # in the news
    # Children of Rants (503) → Media
    674: "Media",       # Guardian
    683: "Media",       # Independent
    682: "Media",       # IrishEconomy
    38: "General",      # Notes To Self
    679: "Media",       # peopleseconomy
    691: "Media",       # Sunday Business Post
    # Children of Teaching (11)
    8: "Teaching",      # Courses
    9: "Teaching",      # EC3601
    36: "Teaching",     # EC4004
    502: "Teaching",    # EC4004_2009
    669: "Teaching",    # EC4004_2010
    482: "Teaching",    # EC4006
    35: "Teaching",     # EC4024
    623: "Teaching",    # EC4024_2010
    677: "Teaching",    # EC4024_2011
    670: "Teaching",    # EC4027_2010
    14: "Teaching",     # EC4333
    500: "Teaching",    # EC4333_2009
    30: "Teaching",     # EC6012
    622: "Teaching",    # EC6012_2010
    678: "Teaching",    # EC6012_2011
    4: "Teaching",      # Lecture Notes
    32: "Teaching",     # MG4014
    37: "Teaching",     # podcasts
    # Children of Research (24)
    557: "Research",    # Papers
    672: "Research",    # UIEC
    # Children of UL (12)
    33: "UL",           # UL Seminars
}


HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/json",
}


def fetch_json(url, params=None):
    """Fetch JSON from WordPress REST API, handling PHP warnings."""
    resp = requests.get(url, params=params, timeout=60, headers=HEADERS)
    resp.raise_for_status()
    text = resp.text
    # WordPress sometimes prepends PHP warnings before JSON
    # Find the first [ or { that starts JSON
    first_bracket = text.find("[")
    first_brace = text.find("{")
    candidates = [i for i in [first_bracket, first_brace] if i >= 0]
    if candidates:
        json_start = min(candidates)
        text = text[json_start:]
    return json.loads(text), resp.headers


def fetch_all_tags():
    """Fetch all tags from the API and return id→name mapping."""
    tags = {}
    page = 1
    while True:
        try:
            data, headers = fetch_json(f"{BASE_URL}/tags", {"per_page": 10, "page": page})
        except requests.exceptions.HTTPError as e:
            if page == 1:
                print(f"  Warning: Could not fetch tags ({e}). Proceeding without tags.")
                return tags
            break
        if not data:
            break
        for tag in data:
            name = unescape(tag["name"]).strip()
            if name.lower() != "add new tag":
                tags[tag["id"]] = name
        if len(data) < 10:
            break
        page += 1
        time.sleep(0.5)
    return tags


def html_to_markdown(html_content):
    """Convert WordPress HTML content to clean markdown."""
    if not html_content:
        return "", set()

    soup = BeautifulSoup(html_content, "html.parser")

    # Track image URLs for later download
    image_urls = set()

    # Convert common HTML elements to markdown
    # Handle images
    for img in soup.find_all("img"):
        src = img.get("src", "")
        alt = img.get("alt", "")
        if src:
            image_urls.add(src)
            # Rewrite WordPress image URLs to local paths
            local_src = rewrite_image_url(src)
            img.replace_with(f"\n\n![{alt}]({local_src})\n\n")

    # Handle links
    for a in soup.find_all("a"):
        href = a.get("href", "")
        text = a.get_text(strip=True)
        if href and text:
            a.replace_with(f"[{text}]({href})")
        elif href:
            a.replace_with(href)

    # Handle headings
    for level in range(1, 7):
        for h in soup.find_all(f"h{level}"):
            text = h.get_text(strip=True)
            h.replace_with(f"\n\n{'#' * level} {text}\n\n")

    # Handle blockquotes
    for bq in soup.find_all("blockquote"):
        lines = bq.get_text().strip().split("\n")
        quoted = "\n".join(f"> {line}" for line in lines)
        bq.replace_with(f"\n\n{quoted}\n\n")

    # Handle lists
    for ul in soup.find_all("ul"):
        items = []
        for li in ul.find_all("li", recursive=False):
            items.append(f"- {li.get_text(strip=True)}")
        ul.replace_with("\n" + "\n".join(items) + "\n")

    for ol in soup.find_all("ol"):
        items = []
        for i, li in enumerate(ol.find_all("li", recursive=False), 1):
            items.append(f"{i}. {li.get_text(strip=True)}")
        ol.replace_with("\n" + "\n".join(items) + "\n")

    # Handle emphasis
    for tag in soup.find_all(["strong", "b"]):
        text = tag.get_text()
        tag.replace_with(f"**{text}**")

    for tag in soup.find_all(["em", "i"]):
        text = tag.get_text()
        tag.replace_with(f"*{text}*")

    # Handle code blocks
    for pre in soup.find_all("pre"):
        code = pre.get_text()
        pre.replace_with(f"\n\n```\n{code}\n```\n\n")

    for code in soup.find_all("code"):
        text = code.get_text()
        code.replace_with(f"`{text}`")

    # Handle iframes (YouTube embeds, etc.)
    for iframe in soup.find_all("iframe"):
        src = iframe.get("src", "")
        if "youtube" in src or "youtu.be" in src:
            iframe.replace_with(f"\n\n[Watch on YouTube]({src})\n\n")
        else:
            iframe.replace_with(f"\n\n[Embedded content]({src})\n\n")

    # Handle <br> tags
    for br in soup.find_all("br"):
        br.replace_with("\n")

    # Handle <hr> tags
    for hr in soup.find_all("hr"):
        hr.replace_with("\n\n---\n\n")

    # Handle <p> tags
    for p in soup.find_all("p"):
        text = p.get_text()
        p.replace_with(f"\n\n{text}\n\n")

    # Get remaining text
    text = soup.get_text()

    # Clean up excessive whitespace
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = text.strip()

    return text, image_urls


def rewrite_image_url(url):
    """Rewrite WordPress image URL to local Jekyll path."""
    # Match wp-content/uploads/YYYY/MM/filename
    match = re.search(r"wp-content/uploads/(\d{4}/\d{2}/[^\"'\s\)]+)", url)
    if match:
        return f"/assets/images/{match.group(1)}"
    # For external images, leave as-is
    return url


def sanitize_slug(slug):
    """Ensure slug is valid for a Jekyll filename."""
    # Remove any characters that aren't alphanumeric, hyphens, or dots
    slug = re.sub(r"[^a-z0-9\-.]", "-", slug.lower())
    # Remove leading/trailing hyphens
    slug = slug.strip("-")
    # Collapse multiple hyphens
    slug = re.sub(r"-{2,}", "-", slug)
    return slug or "untitled"


def escape_yaml_string(s):
    """Escape a string for YAML front matter."""
    if not s:
        return '""'
    # If it contains special characters, quote it
    if any(c in s for c in ":#{}[]&*?|>!%@`\"'\n"):
        # Use double quotes, escaping internal double quotes
        escaped = s.replace("\\", "\\\\").replace('"', '\\"')
        return f'"{escaped}"'
    return f'"{s}"'


def post_to_markdown(post, tag_map):
    """Convert a WordPress API post object to a Jekyll markdown file."""
    title = unescape(post["title"]["rendered"]).strip()
    date_str = post["date"]  # e.g., "2019-12-10T09:49:31"
    slug = sanitize_slug(post["slug"])
    content_html = post["content"]["rendered"]

    # Parse date
    dt = datetime.fromisoformat(date_str)
    date_formatted = dt.strftime("%Y-%m-%d %H:%M:%S %z").strip() or dt.strftime("%Y-%m-%d %H:%M:%S +0000")

    # Map category IDs to names
    cat_ids = post.get("categories", [])
    categories = list(set(CATEGORY_MAP.get(cid, "General") for cid in cat_ids))
    if not categories:
        categories = ["General"]

    # Map tag IDs to names
    tag_ids = post.get("tags", [])
    tags = [tag_map[tid] for tid in tag_ids if tid in tag_map]

    # Convert content
    content_md, image_urls = html_to_markdown(content_html)

    # Build front matter
    front_matter = {
        "title": title,
        "date": date_formatted,
        "categories": categories,
    }
    if tags:
        front_matter["tags"] = tags

    # Build YAML manually for clean output
    yaml_lines = ["---"]
    yaml_lines.append(f"title: {escape_yaml_string(title)}")
    yaml_lines.append(f"date: {date_formatted}")
    yaml_lines.append("categories:")
    for cat in categories:
        yaml_lines.append(f"  - {cat}")
    if tags:
        yaml_lines.append("tags:")
        for tag in tags:
            yaml_lines.append(f"  - {escape_yaml_string(tag)}")
    yaml_lines.append("---")

    # Build filename
    date_prefix = dt.strftime("%Y-%m-%d")
    filename = f"{date_prefix}-{slug}.md"

    full_content = "\n".join(yaml_lines) + "\n\n" + content_md + "\n"

    return filename, full_content, image_urls


def main():
    POSTS_DIR.mkdir(parents=True, exist_ok=True)

    print("Fetching tags...")
    tag_map = fetch_all_tags()
    print(f"  Found {len(tag_map)} tags")

    print("Fetching posts...")
    all_image_urls = set()
    total_posts = 0
    failed_posts = 0
    page = 1

    while True:
        print(f"  Fetching page {page}...")
        try:
            data, headers = fetch_json(
                f"{BASE_URL}/posts",
                {"per_page": 100, "page": page, "status": "publish", "orderby": "date", "order": "asc"}
            )
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 400:
                # Past the last page
                break
            raise

        if not data:
            break

        for post in data:
            try:
                filename, content, image_urls = post_to_markdown(post, tag_map)
                filepath = POSTS_DIR / filename

                # Handle duplicate filenames
                if filepath.exists():
                    base = filepath.stem
                    filepath = POSTS_DIR / f"{base}-{post['id']}.md"

                filepath.write_text(content, encoding="utf-8")
                all_image_urls.update(image_urls)
                total_posts += 1
            except Exception as e:
                post_title = post.get("title", {}).get("rendered", "unknown")
                print(f"    Warning: Failed to convert post '{post_title}' (ID {post.get('id')}): {e}")
                failed_posts += 1

        print(f"  Page {page}: {len(data)} posts (total so far: {total_posts})")

        # Stop when we get fewer than per_page results (last page)
        if len(data) < 100:
            break
        page += 1
        time.sleep(0.5)  # rate limiting

    # Save image URLs for the download script
    IMAGE_LOG.write_text("\n".join(sorted(all_image_urls)), encoding="utf-8")

    print(f"\nDone! Migrated {total_posts} posts to {POSTS_DIR}")
    if failed_posts:
        print(f"Failed: {failed_posts} posts")
    print(f"Found {len(all_image_urls)} unique image URLs (saved to {IMAGE_LOG})")


if __name__ == "__main__":
    main()
