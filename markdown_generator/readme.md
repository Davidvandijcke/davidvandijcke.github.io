# Jupyter notebook markdown generator

These .ipynb files are Jupyter notebook files that convert a TSV containing structured data about talks (`talks.tsv`) or presentations (`presentations.tsv`) into individual markdown files that will be properly formatted for the academicpages template. The notebooks contain a lot of documentation about the process. The .py files are pure python that do the same things if they are executed in a terminal, they just don't have pretty documentation.

## Publication generator

`publications2.csv` and `wps.csv` are the canonical publication and working-paper sources. Regenerate their Markdown files from any working directory with:

```bash
python3 markdown_generator/publications.py
```

To verify that the generated files are current without writing anything:

```bash
python3 markdown_generator/publications.py --check
```

The generator validates all rows before writing, refuses duplicate titles or slugs across collections, and aborts if the R3D job-market-paper URL, designation, or MEG award text is missing.


