# MindTrace

**Understand people. Understand yourself.**

A gamified, structured learning library for psychology, relationships and human
behaviour — built as a static site in **HTML5 + vanilla JavaScript + vanilla CSS**
(no build step, no framework, no backend).

## Features

- **Structured learning path** — a guided "Foundation path" of 10 quick reads, plus
  14 modules you can work through in order.
- **Library** — browse all topics, filter by module, and search by title or description.
- **Topic reader** — every topic is broken into clear sections (what it is, how it
  works, warning signs, protection strategies, and more) with a reading-progress bar,
  an in-topic table of contents, and callouts for the key takeaways.
- **Quiz** — pick a module and answer 5 questions. Each shows a real description and
  asks which topic it belongs to. Right answers earn XP; a perfect score earns a bonus.
- **Progress page** — level, XP, streak, daily quest, achievements, and per-module progress.

### Gamification

- **XP & levels** — completing a topic earns 12 XP; quiz answers earn 6 XP each (+18 for
  a perfect round); unlocking an achievement adds 30 XP. Levels run from *Novice* to
  *Grandmaster*, with a progress ring in the header.
- **Daily streak** — read or quiz on consecutive days to build a streak.
- **Daily quest** — complete 3 topics a day to clear the quest.
- **Achievements** — 12 unlockable badges (first topic, 10/50/100 topics, a full module,
  streaks, quiz milestones and more).

### Themes

Two themes, switched from the header and remembered in `localStorage`:

1. **Paper** (default) — soft white / warm paper background with blue and red accents.
2. **Slate** — dark grey with blue and red accents.

## Content

- **14 modules** and **254 topics** in `assets/data.js`
- Each topic: `id`, `slug`, `title`, `category`, `description`, `readTime`,
  `relatedTopics`, and `sections[]` (each section has a `title` and content lines).

## Run it

There is no build step. Just open `index.html`, or serve the folder:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## Project structure

```
index.html            # shell: header (nav, level, theme switch, menu) + mount point
assets/styles.css     # design system: tokens, both themes, components
assets/app.js         # hash router + views + gamification + quiz
assets/data.js        # content bundle: window.MINDTRACE_DATA
```

Routing is hash-based (`#/learn`, `#/library/manipulation`, `#/topic/gaslighting`,
`#/quiz`, `#/progress`), so it works from the filesystem, on GitHub Pages, and on any
static host with no config. All user state lives in `localStorage` — there is no
account, no server, and nothing leaves the browser.

## Deploy

Fully static, so GitHub Pages works with no changes:

**Settings → Pages → Build and deployment → Source: Deploy from a branch → `main` / `/ (root)`.**

## Disclaimer

MindTrace is an **educational** resource on psychology and human behaviour. It is not a
diagnostic or clinical tool. For personal, legal, or crisis situations, please consult a
qualified professional.

## Attribution & licence

Content and concept are derived from the original MindTrace project (Google AI Studio,
Apache-2.0). This static rebuild is released under the Apache License 2.0 — see `LICENSE`.
