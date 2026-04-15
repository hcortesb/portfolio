# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static vanilla HTML/CSS/JS portfolio site — no build tools, no package manager, no dependencies. Runs directly in the browser.

## Local Development

Open `index.html` directly in a browser, or serve with:

```sh
python -m http.server
```

No build step required. Changes to `.html`, `.css`, or `.js` are immediately reflected on reload.

## Architecture

Three files contain the entire site:

- **`index.html`** — Full page markup. Sections: header/nav, hero, work gallery, contact, footer, and a `<dialog>` for the lightbox. Elements that need translation carry a `data-key` attribute (e.g. `data-key="nav.work"`).
- **`style.css`** — All styling. Uses CSS custom properties defined at `:root` for colors, type scale, and easing. Layout is mostly `column-count` for the gallery and flexbox/grid elsewhere.
- **`main.js`** — All interactivity: bilingual i18n, gallery lightbox, contact form mock submit, scroll-based header, smooth scrolling, and keyboard accessibility.

### i18n System

`main.js` exports a `ui` object with `en` and `es` sub-objects. Keys map 1:1 to `data-key` attribute values in the HTML. `applyLang(lang)` iterates the DOM and replaces `textContent` (or `placeholder`) for every keyed element. To add a new translatable string:

1. Add the `data-key` attribute to the element in `index.html`.
2. Add the matching key under both `ui.en` and `ui.es` in `main.js`.

### Contact Form

Currently mocked — a 900ms `setTimeout` simulates a network call. The comment in `main.js` marks exactly where to replace it with a real backend (Formspree, EmailJS, etc.).

### Lightbox

Built on the native `<dialog>` element. State is held in a `currentIndex` variable; `openLightbox(index)` and `navigate(dir)` drive it. Keyboard events (`ArrowLeft`, `ArrowRight`, `Escape`) are handled globally while the dialog is open. Focus returns to the triggering thumbnail on close.

## Design Tokens (CSS custom properties)

| Token | Value |
|---|---|
| `--clr-bg` | `#FFFFFF` |
| `--clr-ink` | `#0A0909` |
| `--clr-muted` | `#8C8780` |
| `--clr-border` | `#DDD9D2` |
| `--clr-accent` | `#8A6A40` |
| `--ease` | `cubic-bezier(0.77, 0, 0.175, 1)` |

Primary typeface: **Cormorant Garamond** (loaded from Google Fonts).

## Images

All project images live in `images/` as `camilo_anchico_*.jpeg`. The lightbox reads `src` and `alt` directly from the `<img>` tags in the gallery, so adding a new image only requires adding an `<img>` inside the gallery list in `index.html`.
