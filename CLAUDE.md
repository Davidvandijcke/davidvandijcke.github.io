# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Academic personal website for David Van Dijcke (Economics PhD, U of Michigan). Built with Jekyll on the Academic Pages template (fork of Minimal Mistakes). Hosted on GitHub Pages at `davidvandijcke.github.io`.

## Development Commands

```bash
# Local dev server (requires ruby-dev, bundler, nodejs)
bundle exec jekyll liveserve    # serves at localhost:4000

# JS minification
npm run build:js                # one-shot minify
npm run watch:js                # watch + rebuild on change

# Generate publication/WP markdown from CSV
cd markdown_generator && python publications.py   # outputs to _publications/ and _wps/
cd markdown_generator && python media.py          # outputs to _media/
```

No Gemfile in repo (intentionally removed for security). If you need one locally, create it with `gem "github-pages"`.

## Architecture

### Content Pipeline

Publications and working papers flow through two paths:

1. **CSV → Markdown generator**: Edit `markdown_generator/publications2.csv` or `wps.csv`, then run `publications.py` to regenerate markdown files in `_publications/` and `_wps/`.
2. **Direct markdown editing**: Edit files directly in `_publications/` or `_wps/`.

Front matter format for publications/WPs:
```yaml
---
title: "Paper Title"
collection: publications  # or wps
permalink: /publication/YYYY-MM-DD-slug/
coauthors: "Author1, Author2"
excerpt: 'Abstract text'
date: YYYY-MM-DD
venue: 'Journal Name'
paperurl: 'https://...'
field: 'Econometrics'  # or 'Policy' — used for grouping on research page
media: '[Outlet](url)'
workingpaper: '[WP Version](url)'
replication: '[Code](url)'
---
```

### Research Page (`_pages/research.md`)

This is the most complex page. It uses Liquid templating to display publications in an explicit hardcoded order (JMP first, then 7 selected papers by title matching). The order is defined via `{% assign t_fdr = "..." %}` variables at the top. Remaining papers display after the selected ones, grouped by field (Econometrics vs. Policy). To reorder or add selected papers, edit the variable assignments and the `targets` concatenation string.

Each entry renders via `_includes/publication-entry.html`, which supports collapsible abstracts, media links, working paper versions, and replication materials.

### Theme System

Active theme: `_sass/custom/light-theme.scss`. The `_sass/custom/` directory contains ~16 alternative theme files from iterative design — only `light-theme.scss` and `publications.scss` are actively used. Others are historical.

### Navigation

Edit `_data/navigation.yml`. Current sections: Research, CV, Code and Data, Media.

### Key Pages

- `_pages/about.md` — Homepage (permalink: `/`)
- `_pages/research.md` — Research page with explicit publication ordering
- `_pages/cv.md` — Links to CV PDF in `/files/`
- `_pages/code.md` — Code and data resources
- `_pages/media.md` — Media appearances

### Research Assistant Apps

- `ai-assistant/` — Simple Gradio assistant with hardcoded knowledge base
- `david-research-assistant/` — Advanced RAG assistant using LangChain + Gemini API (git submodule)

Both deploy to Hugging Face Spaces. See their respective README files.

### Collections

Defined in `_config.yml`: `publications`, `wps`, `media`, `talks`, `teaching`, `portfolio`. Each outputs to `/:collection/:path/`.
