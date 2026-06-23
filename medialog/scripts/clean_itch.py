"""
clean_itch.py
-------------
Cleans up a mangled itch.txt (where quotes were stripped from JS entries)
into a simple one-title-per-line file that itch_review.py can read.

Usage:
    python clean_itch.py itch.txt
    (overwrites itch.txt with the cleaned version)
"""

import re
import sys

path = sys.argv[1] if len(sys.argv) > 1 else "itch.txt"

with open(path, encoding="utf-8") as f:
    lines = f.readlines()

titles = []
for line in lines:
    line = line.strip()
    if not line:
        continue

    # Format with quotes intact: title:"Game Name",platform:"itch.io"
    m = re.search(r'title:"([^"]+)",platform:"itch\.io"', line)
    if m:
        titles.append(m.group(1))
        continue

    # Format with quotes stripped: title12 Labors,platformitch.io
    # Grab everything between "title" and ",platform"
    m = re.search(r'title(.+?),platform', line)
    if m:
        title = m.group(1).strip()
        # Strip any leading/trailing quote chars that might remain
        title = title.strip('"\'')
        if title:
            titles.append(title)
        continue

    # If it doesn't match either pattern, skip it (it's noise)

titles = sorted(set(titles))
print(f"Found {len(titles)} titles")

with open(path, "w", encoding="utf-8") as f:
    for t in titles:
        f.write(t + "\n")

print(f"Cleaned titles written to {path}")
print("First 10:")
for t in titles[:10]:
    print(f"  {t}")