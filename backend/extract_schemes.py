"""One-off extraction: parse the 555-scheme reference docx into structured JSON."""
import json
import re
import sys

from docx import Document
from docx.document import Document as DocumentType
from docx.oxml.table import CT_Tbl
from docx.oxml.text.paragraph import CT_P
from docx.table import Table
from docx.text.paragraph import Paragraph

SRC = "/Users/prathmeshkolte/Downloads/Government_Schemes_Full_Document.docx"
OUT = "/Users/prathmeshkolte/Documents/govt-scheme-recommender/src/data/schemes_raw.json"


def iter_block_items(parent):
    parent_elm = parent.element.body
    for child in parent_elm.iterchildren():
        if isinstance(child, CT_P):
            yield Paragraph(child, parent)
        elif isinstance(child, CT_Tbl):
            yield Table(child, parent)


def parse_level_state(level_text: str):
    level_text = level_text.strip()
    m = re.match(r"State\s*\(([^)]+)\)", level_text, re.IGNORECASE)
    if m:
        return "state", m.group(1).strip()
    if level_text.lower().startswith("central"):
        return "central", None
    return "central", None


def slugify(name: str) -> str:
    s = re.sub(r"[()/&]", " ", name)
    s = re.sub(r"[^a-zA-Z0-9\s-]", "", s)
    s = re.sub(r"\s+", "-", s.strip()).lower()
    return s


doc = Document(SRC)

current_category = None
current_target_group = None
categories = []
schemes = []
seen_ids: dict[str, int] = {}

for block in iter_block_items(doc):
    if isinstance(block, Paragraph):
        text = block.text.strip()
        if not text:
            continue
        if text.startswith("Target Group:"):
            m = re.match(r"Target Group:\s*(.+?)\s*\|\s*Total Schemes in Category:\s*(\d+)", text)
            if m:
                current_target_group = m.group(1).strip()
            continue
        style = block.style.name if block.style else ""
        if style.startswith("Heading") and "Category Overview" not in text and "Government Scheme Database" not in text:
            current_category = text.strip()
            categories.append({"name": current_category, "targetGroup": None})
    elif isinstance(block, Table):
        rows = block.rows
        if not rows:
            continue
        header_cells = [c.text.strip() for c in rows[0].cells]
        if "Scheme Name" not in header_cells:
            continue  # not a scheme table (e.g. the category-overview summary table)

        if categories and categories[-1]["name"] == current_category:
            categories[-1]["targetGroup"] = current_target_group

        for row in rows[1:]:
            cells = [c.text.strip() for c in row.cells]
            if len(cells) < 5:
                continue
            sno, name, ministry, level_raw, eligibility = cells[:5]
            if not name:
                continue
            level, state = parse_level_state(level_raw)

            base_id = slugify(name)
            n = seen_ids.get(base_id, 0)
            seen_ids[base_id] = n + 1
            sid = base_id if n == 0 else f"{base_id}-{n+1}"

            schemes.append({
                "id": sid,
                "sno": sno,
                "name": name,
                "ministry": ministry,
                "level": level,
                "state": state,
                "category": current_category,
                "eligibilityRaw": eligibility,
            })

print(f"Categories: {len(categories)}", file=sys.stderr)
for c in categories:
    print(f"  - {c['name']} :: {c['targetGroup']}", file=sys.stderr)
print(f"Total schemes: {len(schemes)}", file=sys.stderr)

with open(OUT, "w") as f:
    json.dump({"categories": categories, "schemes": schemes}, f, ensure_ascii=False, indent=2)

print(f"Wrote {OUT}", file=sys.stderr)
