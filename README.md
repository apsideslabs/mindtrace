# MindTrace

**Understand people. Understand yourself.**

A lightweight, structured learning library for psychology, relationships, and human
behaviour — rebuilt as a static site in **HTML5 + vanilla JavaScript + vanilla CSS**
(no build step, no framework, no backend).

The original project was a React + Vite + Gemini app. This MVP keeps the content and
the "structured learning" idea, and strips it down to something you can open in a
browser and ship on any static host.

## Features

- **Structured learning path** — a guided "Foundation path" of 10 quick reads, plus
  14 modules you can work through in order.
- **Library** — browse all topics, filter by module, and search by title or description.
- **Topic reader** — every topic is broken into clear sections (what it is, how it
  works, warning signs, protection strategies, and more) with a reading-progress bar,
  an in-topic table of contents, and callouts for the key takeaways.
- **Progress tracking** — mark topics complete; per-module and overall progress bars.
- **Bookmarks** — save topics and find them again on the Bookmarks page.
- **Light / dark theme** — toggle in the header, remembered in `localStorage`.

All user state lives in `localStorage` — there is no account, no server, and nothing
leaves the browser.

## Content

- **14 modules** and **254 topics** in `assets/data.js`
- Each topic: `id`, `slug`, `title`, `category`, `description`, `readTime`,
  `relatedTopics`, and `sections[]` (each section has a `title` and content lines).

## Run it

There is no build step. Just open `index.html`, or serve the folder:

```bash
# any static server works, e.g.
python3 -m http.server 8080
# then open http://localhost:8080
```

## Project structure

```
index.html            # shell + app bar + mount point
assets/styles.css     # design system (tokens, layout, components)
assets/app.js         # hash router + views (home, learn, library, reader, bookmarks)
assets/data.js        # content bundle: window.MINDTRACE_DATA
```

Routing is hash-based (`#/learn`, `#/library/manipulation`, `#/topic/gaslighting`), so
it works from the filesystem, on GitHub Pages, and on any static host with no config.

## Deploy

Because it is fully static, GitHub Pages works with no changes:

**Settings → Pages → Build and deployment → Source: Deploy from a branch → `main` / `/ (root)`.**

## Disclaimer

MindTrace is an **educational** resource on psychology and human behaviour. It is not a
diagnostic or clinical tool. For personal, legal, or crisis situations, please consult a
qualified professional.

## Attribution & licence

Content and concept are derived from the original MindTrace project (Google AI Studio,
Apache-2.0). This static rebuild is released under the Apache License 2.0 — see `LICENSE`.
