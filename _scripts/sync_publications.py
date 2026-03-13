#!/usr/bin/env python3
"""Fetch publications from ORCID API and update _pages/publications.md"""

import json
import re
import urllib.request
from collections import defaultdict

ORCID_ID = "0000-0002-7943-4797"
API_URL = f"https://pub.orcid.org/v3.0/{ORCID_ID}/works"

# Filter out preprints, datasets, working papers
SKIP_SOURCES = {"arxiv", "zenodo", "figshare", "ssrn", "repec"}
SKIP_TYPES = {"preprint", "dataset", "working-paper"}


def fetch_works():
    req = urllib.request.Request(API_URL, headers={"Accept": "application/json"})
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode())
    return data


def extract_publications(data):
    pubs = []
    seen_titles = set()

    for group in data.get("group", []):
        summary = group["work-summary"][0]

        # Get title
        title_obj = summary.get("title", {})
        if not title_obj or not title_obj.get("title"):
            continue
        title = title_obj["title"].get("value", "").strip()
        if not title:
            continue

        # Normalize title for deduplication (collapse dashes, whitespace, punctuation)
        title_normalized = re.sub(r'[\u2010-\u2015\u2212-]', '-', title.lower())
        title_normalized = re.sub(r'[^a-z0-9 ]', '', title_normalized).strip()
        title_normalized = re.sub(r'\s+', ' ', title_normalized)
        if title_normalized in seen_titles:
            continue
        seen_titles.add(title_normalized)

        # Get year
        pub_date = summary.get("publication-date", {})
        year = None
        if pub_date and pub_date.get("year"):
            year = pub_date["year"].get("value")
        if not year:
            continue

        # Get type
        work_type = summary.get("type", "").lower()

        # Get journal
        journal = ""
        journal_obj = summary.get("journal-title")
        if journal_obj:
            journal = journal_obj.get("value", "")

        # Get DOI from external IDs
        doi = None
        ext_ids = summary.get("external-ids", {})
        if ext_ids:
            for eid in ext_ids.get("external-id", []):
                if eid.get("external-id-type") == "doi":
                    doi = eid.get("external-id-value")
                    break

        # Get source
        source = ""
        source_obj = summary.get("source", {})
        if source_obj:
            source_name = source_obj.get("source-name", {})
            if source_name:
                source = source_name.get("value", "").lower()

        # Skip preprints, datasets, etc.
        if work_type in SKIP_TYPES:
            continue
        if any(s in source for s in SKIP_SOURCES):
            continue
        journal_lower = journal.lower()
        if any(s in journal_lower for s in SKIP_SOURCES):
            continue
        if any(s in title_normalized for s in ["preprint", "dataset"]):
            continue

        pubs.append({
            "title": title,
            "year": year,
            "journal": journal,
            "doi": doi,
            "type": work_type,
        })

    return pubs


def generate_markdown(pubs):
    # Group by year, sort descending
    by_year = defaultdict(list)
    for pub in pubs:
        by_year[pub["year"]].append(pub)

    lines = [
        "---",
        'title: "Publications"',
        "permalink: /publications/",
        "redirect_from:",
        "  - /publications-2/",
        "---",
        "",
        "Full publication list from my [ORCID profile](https://orcid.org/0000-0002-7943-4797). See also: [Google Scholar](https://scholar.google.com/citations?user=Duqr7rIAAAAJ), [RePeC](http://ideas.repec.org/e/pki169.html).",
        "",
    ]

    for year in sorted(by_year.keys(), reverse=True):
        lines.append(f"## {year}")
        lines.append("")
        for pub in sorted(by_year[year], key=lambda p: p["title"]):
            entry = f"- {pub['title']}."
            if pub["journal"]:
                entry += f" *{pub['journal']}*."
            if pub["doi"]:
                entry += f" [DOI](https://doi.org/{pub['doi']})"
            lines.append(entry)
            lines.append("")

    return "\n".join(lines)


def main():
    print("Fetching publications from ORCID...")
    data = fetch_works()
    pubs = extract_publications(data)
    print(f"Found {len(pubs)} publications")

    md = generate_markdown(pubs)

    output_path = "_pages/publications.md"
    with open(output_path, "w") as f:
        f.write(md)
    print(f"Updated {output_path}")


if __name__ == "__main__":
    main()
