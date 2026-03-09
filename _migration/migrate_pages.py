"""
Migrate WordPress pages to Jekyll markdown via REST API.
Handles WPBakery shortcode stripping and HTML-to-markdown conversion.
Specifically targets: About (2), Research (7810), Publications (7668),
Teaching (7803), Contact (7805).
"""
import json
import re
import sys
import time
from html import unescape
from pathlib import Path

import requests
from bs4 import BeautifulSoup

BASE_URL = "https://www.stephenkinsella.net/wp-json/wp/v2"
SITE_DIR = Path(__file__).resolve().parent.parent
PAGES_DIR = SITE_DIR / "_pages"
PUBLICATIONS_DIR = SITE_DIR / "_publications"
RESEARCH_DIR = SITE_DIR / "_research"
TEACHING_DIR = SITE_DIR / "_teaching"

# Key page IDs from WordPress
PAGE_IDS = {
    "about": 2,
    "research": 7810,
    "publications": 7668,
    "teaching": 7803,
    "contact": 7805,
}

# WPBakery shortcode pattern
SHORTCODE_PATTERN = re.compile(r"\[/?vc_[^\]]*\]")
# Also handle other common shortcodes
OTHER_SHORTCODES = re.compile(r"\[/?(et_pb_|fusion_|mk_|rev_slider|contact-form)[^\]]*\]")


def strip_shortcodes(html_content):
    """Remove all WPBakery and other shortcodes, keeping inner content."""
    text = SHORTCODE_PATTERN.sub("", html_content)
    text = OTHER_SHORTCODES.sub("", text)
    return text


def html_to_markdown(html_content):
    """Convert HTML to clean markdown."""
    if not html_content:
        return ""

    # Strip shortcodes first
    html_content = strip_shortcodes(html_content)

    soup = BeautifulSoup(html_content, "html.parser")

    # Convert images
    for img in soup.find_all("img"):
        src = img.get("src", "")
        alt = img.get("alt", "")
        if src:
            # Rewrite WordPress URLs
            match = re.search(r"wp-content/uploads/(\d{4}/\d{2}/[^\"'\s\)]+)", src)
            if match:
                src = f"/assets/images/{match.group(1)}"
            img.replace_with(f"\n\n![{alt}]({src})\n\n")

    # Convert links
    for a in soup.find_all("a"):
        href = a.get("href", "")
        text = a.get_text(strip=True)
        if href and text:
            a.replace_with(f"[{text}]({href})")

    # Convert headings
    for level in range(1, 7):
        for h in soup.find_all(f"h{level}"):
            text = h.get_text(strip=True)
            h.replace_with(f"\n\n{'#' * level} {text}\n\n")

    # Convert blockquotes
    for bq in soup.find_all("blockquote"):
        lines = bq.get_text().strip().split("\n")
        quoted = "\n".join(f"> {line}" for line in lines)
        bq.replace_with(f"\n\n{quoted}\n\n")

    # Convert lists
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

    # Convert emphasis
    for tag in soup.find_all(["strong", "b"]):
        text = tag.get_text()
        tag.replace_with(f"**{text}**")

    for tag in soup.find_all(["em", "i"]):
        text = tag.get_text()
        tag.replace_with(f"*{text}*")

    # Handle <br> and <hr>
    for br in soup.find_all("br"):
        br.replace_with("\n")
    for hr in soup.find_all("hr"):
        hr.replace_with("\n\n---\n\n")

    # Handle <p> tags
    for p in soup.find_all("p"):
        text = p.get_text()
        p.replace_with(f"\n\n{text}\n\n")

    text = soup.get_text()
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/json",
}


def fetch_page(page_id):
    """Fetch a single WordPress page by ID."""
    resp = requests.get(f"{BASE_URL}/pages/{page_id}", timeout=60, headers=HEADERS)
    resp.raise_for_status()
    text = resp.text
    # Strip PHP warnings before JSON
    first_brace = text.find("{")
    if first_brace > 0:
        text = text[first_brace:]
    return json.loads(text)


def migrate_about(page_data):
    """Convert About/Biography page to Jekyll markdown."""
    content = html_to_markdown(page_data["content"]["rendered"])
    md = f"""---
title: "About"
permalink: /about/
---

{content}
"""
    (PAGES_DIR / "about.md").write_text(md, encoding="utf-8")
    print("  Wrote about.md")


def migrate_research(page_data):
    """Convert Research page to Jekyll markdown and extract research projects."""
    content_html = strip_shortcodes(page_data["content"]["rendered"])
    soup = BeautifulSoup(content_html, "html.parser")

    # Extract main research description
    main_content = html_to_markdown(page_data["content"]["rendered"])

    md = f"""---
title: "Research"
permalink: /research/
redirect_from:
  - /research-2/
---

{main_content}
"""
    (PAGES_DIR / "research.md").write_text(md, encoding="utf-8")
    print("  Wrote research.md")


def migrate_publications(page_data):
    """Extract publications from the Publications page into collection files."""
    content_html = strip_shortcodes(page_data["content"]["rendered"])
    soup = BeautifulSoup(content_html, "html.parser")

    # Find all ordered lists (publication entries)
    publications = []

    for ol in soup.find_all("ol"):
        for li in ol.find_all("li"):
            text = li.get_text(strip=True)
            if text:
                # Try to extract year from the text
                year_match = re.search(r"\((\d{4})\)", text)
                year = int(year_match.group(1)) if year_match else 0

                # Try to extract title (usually in quotes or after year)
                title_match = re.search(r"['\"](.+?)['\"]", text)
                title = title_match.group(1) if title_match else text[:80]

                # Get any links
                links = li.find_all("a")
                url = links[0].get("href", "") if links else ""

                publications.append({
                    "text": text,
                    "year": year,
                    "title": title,
                    "url": url,
                })

    PUBLICATIONS_DIR.mkdir(parents=True, exist_ok=True)

    # Also write the full publications page with all content
    all_pubs_md = """---
title: "Publications"
permalink: /publications/
redirect_from:
  - /publications-2/
---

"""
    # Group by type if possible, but for now just list all
    for i, pub in enumerate(publications, 1):
        slug = re.sub(r"[^a-z0-9]+", "-", pub["title"].lower()).strip("-")[:60]
        if not slug:
            slug = f"publication-{i}"

        pub_md = f"""---
title: {json.dumps(pub['title'])}
year: {pub['year']}
citation: {json.dumps(pub['text'])}
url: "{pub['url']}"
---

{pub['text']}
"""
        filename = f"{pub['year']}-{slug}.md" if pub['year'] else f"0000-{slug}.md"
        (PUBLICATIONS_DIR / filename).write_text(pub_md, encoding="utf-8")

    # Write the main publications page listing
    content = html_to_markdown(page_data["content"]["rendered"])
    all_pubs_md += content + "\n"
    (PAGES_DIR / "publications.md").write_text(all_pubs_md, encoding="utf-8")

    print(f"  Wrote publications.md and {len(publications)} publication collection files")


def migrate_teaching(page_data):
    """Convert Teaching page to Jekyll markdown."""
    content = html_to_markdown(page_data["content"]["rendered"])
    md = f"""---
title: "Teaching"
permalink: /teaching/
redirect_from:
  - /teaching-2/
  - /teaching-3/
---

{content}
"""
    (PAGES_DIR / "teaching.md").write_text(md, encoding="utf-8")
    print("  Wrote teaching.md")


def migrate_contact(page_data):
    """Convert Contact page to Jekyll markdown with static contact info."""
    content = html_to_markdown(page_data["content"]["rendered"])

    # Add static contact info regardless of WP content
    md = f"""---
title: "Contact"
permalink: /contact/
redirect_from:
  - /contact-2/
---

**Stephen Kinsella**
Full Professor of Economics
University of Limerick

- **Email:** [stephen.kinsella@ul.ie](mailto:stephen.kinsella@ul.ie)
- **Office:** KB-342, Kemmy Business School, University of Limerick
- **Phone:** +353-61-233611

{content}
"""
    (PAGES_DIR / "contact.md").write_text(md, encoding="utf-8")
    print("  Wrote contact.md")


def main():
    PAGES_DIR.mkdir(parents=True, exist_ok=True)
    PUBLICATIONS_DIR.mkdir(parents=True, exist_ok=True)

    handlers = {
        "about": migrate_about,
        "research": migrate_research,
        "publications": migrate_publications,
        "teaching": migrate_teaching,
        "contact": migrate_contact,
    }

    for name, page_id in PAGE_IDS.items():
        print(f"Fetching {name} page (ID: {page_id})...")
        try:
            page_data = fetch_page(page_id)
            handlers[name](page_data)
        except Exception as e:
            print(f"  Error migrating {name}: {e}")
        time.sleep(0.5)

    print("\nPage migration complete!")


if __name__ == "__main__":
    main()
