"""
Download WordPress images referenced in migrated posts.
Reads image URLs from image_urls.txt and downloads to assets/images/
"""
import os
import re
import sys
import time
from pathlib import Path

import requests

SITE_DIR = Path(__file__).resolve().parent.parent
IMAGE_LOG = SITE_DIR / "_migration" / "image_urls.txt"
IMAGES_DIR = SITE_DIR / "assets" / "images"

# Skip WordPress-generated thumbnail sizes to save space
THUMBNAIL_PATTERN = re.compile(r"-\d+x\d+\.(jpg|jpeg|png|gif|webp)$", re.IGNORECASE)


def is_thumbnail(url):
    """Check if URL is a WordPress auto-generated thumbnail."""
    return bool(THUMBNAIL_PATTERN.search(url))


def download_image(url, dest_path):
    """Download a single image."""
    try:
        resp = requests.get(url, timeout=30, stream=True)
        resp.raise_for_status()
        dest_path.parent.mkdir(parents=True, exist_ok=True)
        with open(dest_path, "wb") as f:
            for chunk in resp.iter_content(chunk_size=8192):
                f.write(chunk)
        return True
    except Exception as e:
        return str(e)


def main():
    if not IMAGE_LOG.exists():
        print(f"No image URL log found at {IMAGE_LOG}")
        print("Run migrate_posts.py first to generate the image URL list.")
        sys.exit(1)

    urls = [u.strip() for u in IMAGE_LOG.read_text().splitlines() if u.strip()]
    print(f"Found {len(urls)} image URLs")

    # Filter to only WordPress hosted images
    wp_urls = [u for u in urls if "stephenkinsella.net/wp-content/uploads/" in u]
    external_urls = [u for u in urls if "stephenkinsella.net/wp-content/uploads/" not in u]
    print(f"  WordPress images: {len(wp_urls)}")
    print(f"  External images (skipping): {len(external_urls)}")

    # Optionally skip thumbnails
    skip_thumbnails = "--skip-thumbnails" in sys.argv
    if skip_thumbnails:
        original_count = len(wp_urls)
        wp_urls = [u for u in wp_urls if not is_thumbnail(u)]
        print(f"  Skipping {original_count - len(wp_urls)} thumbnails")

    downloaded = 0
    skipped = 0
    failed = []

    for i, url in enumerate(wp_urls, 1):
        # Extract relative path: wp-content/uploads/YYYY/MM/filename
        match = re.search(r"wp-content/uploads/(\d{4}/\d{2}/[^\"'\s\?]+)", url)
        if not match:
            print(f"  [{i}/{len(wp_urls)}] Skipping (no match): {url}")
            skipped += 1
            continue

        relative_path = match.group(1)
        dest = IMAGES_DIR / relative_path

        if dest.exists():
            skipped += 1
            continue

        result = download_image(url, dest)
        if result is True:
            downloaded += 1
            if downloaded % 50 == 0:
                print(f"  [{i}/{len(wp_urls)}] Downloaded {downloaded} images so far...")
        else:
            failed.append((url, result))

        time.sleep(0.2)  # rate limiting

    print(f"\nDone!")
    print(f"  Downloaded: {downloaded}")
    print(f"  Skipped (already exists): {skipped}")
    print(f"  Failed: {len(failed)}")

    if failed:
        fail_log = SITE_DIR / "_migration" / "failed_images.txt"
        with open(fail_log, "w") as f:
            for url, error in failed:
                f.write(f"{url}\t{error}\n")
        print(f"  Failed URLs saved to {fail_log}")


if __name__ == "__main__":
    main()
