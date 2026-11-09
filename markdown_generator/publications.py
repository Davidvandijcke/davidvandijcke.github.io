#!/usr/bin/env python3
"""Generate academicpages publication Markdown from the canonical CSV files."""

from __future__ import annotations

import argparse
import csv
import os
import stat
import sys
import tempfile
from datetime import datetime
from pathlib import Path
from typing import Iterable


SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent

PUBLICATIONS_CSV = SCRIPT_DIR / "publications2.csv"
WORKING_PAPERS_CSV = SCRIPT_DIR / "wps.csv"

JOB_MARKET_TITLE = "Regression Discontinuity Design with Distribution-Valued Outcomes"
JOB_MARKET_SLUG = "r3d"
JOB_MARKET_MARKERS = (
    "Job Market Paper",
    "Best Student Paper Award at the 2025 Midwest Econometrics Group (MEG) Conference",
)

HTML_ESCAPE_TABLE = {
    "&": "&amp;",
    '"': "&quot;",
    "'": "&apos;",
}


def html_escape(text: str) -> str:
    """Escape text for the legacy HTML-in-YAML format used by the site."""
    return "".join(HTML_ESCAPE_TABLE.get(character, character) for character in text)


def normalize(value: str | None) -> str:
    """Normalize line endings while preserving all other source text."""
    return (value or "").replace("\r\n", "\n").replace("\r", "\n")


def read_rows(path: Path) -> list[dict[str, str]]:
    """Read a UTF-8 CSV, tolerating the BOM present in the historical files."""
    with path.open("r", encoding="utf-8-sig", newline="") as source:
        reader = csv.DictReader(source)
        if not reader.fieldnames:
            raise ValueError(f"{path.name} has no header")
        rows = [
            {key: normalize(value) for key, value in row.items() if key is not None}
            for row in reader
        ]
    return rows


def parse_date(raw_date: str, source_name: str) -> str:
    for date_format in ("%m/%d/%y", "%m/%d/%Y", "%Y-%m-%d"):
        try:
            return datetime.strptime(raw_date.strip(), date_format).date().isoformat()
        except ValueError:
            continue
    raise ValueError(f"{source_name}: unsupported pub_date {raw_date!r}")


def validate_required_fields(row: dict[str, str], source_name: str) -> None:
    for field in ("pub_date", "title", "venue", "excerpt", "url_slug"):
        if not row.get(field, "").strip():
            raise ValueError(f"{source_name}: required field {field!r} is empty")


def yaml_double_quoted(text: str) -> str:
    return text.replace("\\", "\\\\").replace('"', '\\"')


def render_markdown(
    row: dict[str, str], collection: str, source_name: str
) -> tuple[str, str]:
    validate_required_fields(row, source_name)

    publication_date = parse_date(row["pub_date"], source_name)
    slug = row["url_slug"].strip()
    if slug in {".", ".."} or "\n" in slug:
        raise ValueError(f"{source_name}: unsafe url_slug {slug!r}")

    filename = f"{publication_date}-{slug}.md".replace("/", "-")
    permalink_prefix = "publication" if collection == "publications" else "wp"

    title = row["title"]
    excerpt = row["excerpt"]
    venue = row["venue"]
    coauthors = row.get("coauthors", "")
    paper_url = row.get("paper_url", "")
    citation = row.get("citation", "") or "nan"

    lines = [
        "---",
        f'title: "{yaml_double_quoted(title)}"',
        f"collection: {collection}",
        f"permalink: /{permalink_prefix}/{publication_date}-{slug}",
    ]

    if len(coauthors) > 3:
        lines.append(f"coauthors: {html_escape(coauthors)}")

    lines.extend(
        [
            f"excerpt: '{html_escape(excerpt)}'",
            f"date: {publication_date}",
            f"venue: '{html_escape(venue)}'",
        ]
    )

    if len(paper_url) > 5:
        lines.append(f"paperurl: '{paper_url}'")

    lines.append(f"citation: '{html_escape(citation)}'")

    for field in ("media", "workingpaper", "replication", "field"):
        value = row.get(field, "")
        if value:
            lines.append(f"{field}: '{html_escape(value)}'")

    lines.append("---")

    if len(paper_url) > 5:
        lines.extend(["", f"<a href='{paper_url}'>Download paper here</a>"])

    lines.extend(["", html_escape(excerpt)])
    return filename, "\n".join(lines) + "\n"


def validate_sources(
    publications: list[dict[str, str]], working_papers: list[dict[str, str]]
) -> None:
    """Fail before writing if source data could damage or duplicate a paper."""
    seen_titles: dict[str, str] = {}
    seen_slugs: dict[str, str] = {}

    for source_name, rows in (
        (PUBLICATIONS_CSV.name, publications),
        (WORKING_PAPERS_CSV.name, working_papers),
    ):
        for row_number, row in enumerate(rows, start=2):
            label = f"{source_name}:{row_number}"
            validate_required_fields(row, label)

            normalized_title = row["title"].strip().casefold()
            normalized_slug = row["url_slug"].strip().casefold()
            for value, seen, field in (
                (normalized_title, seen_titles, "title"),
                (normalized_slug, seen_slugs, "url_slug"),
            ):
                if value in seen:
                    raise ValueError(
                        f"{label}: duplicate {field}; first defined at {seen[value]}"
                    )
                seen[value] = label

    job_market_rows = [
        row for row in working_papers if row["title"].strip() == JOB_MARKET_TITLE
    ]
    if len(job_market_rows) != 1:
        raise ValueError(
            f"{WORKING_PAPERS_CSV.name} must contain exactly one {JOB_MARKET_TITLE!r} row"
        )

    job_market_row = job_market_rows[0]
    if job_market_row["url_slug"].strip() != JOB_MARKET_SLUG:
        raise ValueError("Refusing to regenerate: the job-market-paper slug is not 'r3d'")
    if not job_market_row.get("paper_url", "").endswith("/r3d_latest.pdf"):
        raise ValueError("Refusing to regenerate: the R3D paper URL changed unexpectedly")

    missing_markers = [
        marker for marker in JOB_MARKET_MARKERS if marker not in job_market_row["venue"]
    ]
    if missing_markers:
        raise ValueError(
            "Refusing to regenerate: the R3D venue is missing " + ", ".join(missing_markers)
        )


def build_outputs(
    publications: list[dict[str, str]], working_papers: list[dict[str, str]]
) -> dict[Path, str]:
    outputs: dict[Path, str] = {}
    for collection, rows, source_name in (
        ("publications", publications, PUBLICATIONS_CSV.name),
        ("wps", working_papers, WORKING_PAPERS_CSV.name),
    ):
        output_dir = REPO_ROOT / f"_{collection}"
        for row_number, row in enumerate(rows, start=2):
            filename, markdown = render_markdown(
                row, collection, f"{source_name}:{row_number}"
            )
            output_path = output_dir / filename
            if output_path in outputs:
                raise ValueError(f"Duplicate output path: {output_path}")
            outputs[output_path] = markdown

    job_market_path = REPO_ROOT / "_wps" / "2025-04-05-r3d.md"
    job_market_markdown = outputs.get(job_market_path, "")
    if any(marker not in job_market_markdown for marker in JOB_MARKET_MARKERS):
        raise ValueError("Refusing to regenerate: rendered R3D metadata lost protected text")

    for output_path, markdown in outputs.items():
        opposite_collection = (
            "_wps" if output_path.parent.name == "_publications" else "_publications"
        )
        counterpart = REPO_ROOT / opposite_collection / output_path.name
        title_line = markdown.splitlines()[1]
        if counterpart.exists() and title_line in counterpart.read_text(encoding="utf-8"):
            raise ValueError(
                f"Stale cross-collection copy exists at {counterpart.relative_to(REPO_ROOT)}; "
                "remove it before regenerating"
            )

    return outputs


def atomic_write(path: Path, content: str) -> bool:
    """Write only changed files, replacing each destination atomically."""
    if path.exists() and path.read_text(encoding="utf-8") == content:
        return False

    path.parent.mkdir(parents=True, exist_ok=True)
    file_descriptor, temporary_name = tempfile.mkstemp(
        dir=path.parent, prefix=f".{path.name}.", text=True
    )
    temporary_path = Path(temporary_name)
    try:
        with os.fdopen(file_descriptor, "w", encoding="utf-8", newline="\n") as output:
            output.write(content)
            output.flush()
            os.fsync(output.fileno())
        mode = stat.S_IMODE(path.stat().st_mode) if path.exists() else 0o644
        temporary_path.chmod(mode)
        os.replace(temporary_path, path)
    finally:
        if temporary_path.exists():
            temporary_path.unlink()
    return True


def check_outputs(outputs: dict[Path, str]) -> list[Path]:
    return [
        path
        for path, expected in outputs.items()
        if not path.exists() or path.read_text(encoding="utf-8") != expected
    ]


def relative_paths(paths: Iterable[Path]) -> str:
    return "\n".join(f"  - {path.relative_to(REPO_ROOT)}" for path in paths)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--check",
        action="store_true",
        help="verify generated files without writing them",
    )
    args = parser.parse_args()

    try:
        publications = read_rows(PUBLICATIONS_CSV)
        working_papers = read_rows(WORKING_PAPERS_CSV)
        validate_sources(publications, working_papers)
        outputs = build_outputs(publications, working_papers)
    except (OSError, ValueError, csv.Error) as error:
        print(f"error: {error}", file=sys.stderr)
        return 1

    if args.check:
        mismatches = check_outputs(outputs)
        if mismatches:
            print("Generated publication files are out of date:\n" + relative_paths(mismatches))
            return 1
        print(f"All {len(outputs)} generated publication files are current.")
        return 0

    changed = [path for path, content in outputs.items() if atomic_write(path, content)]
    if changed:
        print("Updated generated publication files:\n" + relative_paths(changed))
    else:
        print(f"All {len(outputs)} generated publication files were already current.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
