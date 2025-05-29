# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an academic personal website built with Jekyll and hosted on GitHub Pages. It's based on the Academic Pages template (a fork of Minimal Mistakes theme).

## Development Commands

### Jekyll (Main Site)
```bash
# Install Ruby dependencies
bundle install

# Run local development server
bundle exec jekyll liveserve

# Clean build directory
bundle clean
```

### JavaScript Build
```bash
# Build minified JS
npm run build:js
# or
npm run uglify

# Watch JS files for changes during development
npm run watch:js
```

## Architecture

### Collections
The site uses Jekyll collections for academic content:
- `_publications/` - Academic publications
- `_teaching/` - Teaching experience
- `_talks/` - Presentations and talks
- `_portfolio/` - Project portfolio
- `_wps/` - Working papers
- `_media/` - Media appearances

### Key Configuration
- `_config.yml` - Main Jekyll configuration (site metadata, author info, navigation)
- `_data/navigation.yml` - Top navigation menu structure
- `_data/ui-text.yml` - UI text translations

### Custom Applications
- `ai-assistant/` - Gradio-based AI assistant (app_simple.py)
- `david-research-assistant/` - Research assistant with document retrieval (app.py, app_improved.py)

### Content Generation
- `markdown_generator/` - Python scripts to generate markdown files from CSV data for publications, talks, and media

## Important Notes

- When editing navigation, modify `_data/navigation.yml`
- Publication entries use the custom `_includes/publication-entry.html` template
- The site includes custom SCSS in `_sass/custom/` for modern enhancements
- AI assistant apps have their own deployment guides in their respective directories
- Gemfile is intentionally removed for security (see README.md)