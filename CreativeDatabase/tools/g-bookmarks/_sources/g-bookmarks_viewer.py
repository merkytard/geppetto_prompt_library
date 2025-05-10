# 📘 g-bookmarks_viewer.py – Generátor HTML prehľadu z .todo.yml poznámok (v novej štruktúre)

import yaml
from pathlib import Path
from datetime import datetime

BOOKMARKS_DIR = Path("_g-bookmarks/_todo")
OUTPUT_FILE = Path("_g-bookmarks/_output/bookmarks.html")


def load_bookmarks():
    bookmarks = []
    for yml in BOOKMARKS_DIR.glob("*.todo.yml"):
        with open(yml, encoding="utf-8") as f:
            data = yaml.safe_load(f)
            data['file'] = yml.name
            bookmarks.append(data)
    return bookmarks


def generate_html(bookmarks):
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    rows = []
    for bm in bookmarks:
        tags = ', '.join(bm.get("signals", []))
        row = f"""
        <tr>
            <td>{bm.get('bookmark_id')}</td>
            <td>{bm.get('title')}</td>
            <td>{bm.get('status')}</td>
            <td>{bm.get('type')}</td>
            <td>{bm.get('target')}</td>
            <td>{tags}</td>
            <td>{bm.get('created')}</td>
        </tr>"""
        rows.append(row)

    html = f"""
    <html>
    <head>
        <title>Geppetto Bookmarks</title>
        <style>
            body {{ font-family: Arial; background: #0e1012; color: #eee; }}
            table {{ width: 100%; border-collapse: collapse; }}
            th, td {{ border: 1px solid #444; padding: 8px; text-align: left; }}
            th {{ background: #1e1f22; }}
            tr:nth-child(even) {{ background: #1c1e21; }}
        </style>
    </head>
    <body>
        <h1>📘 Geppetto TODO Bookmarks</h1>
        <table>
            <tr>
                <th>ID</th><th>Title</th><th>Status</th><th>Type</th><th>Target</th><th>Tags</th><th>Created</th>
            </tr>
            {''.join(rows)}
        </table>
    </body>
    </html>
    """
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"✅ Vygenerované: {OUTPUT_FILE}")


def main():
    bookmarks = load_bookmarks()
    generate_html(bookmarks)


if __name__ == "__main__":
    main()
