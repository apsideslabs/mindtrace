# MindTrace

**Understand people. Understand yourself.**

MindTrace is a reading library for psychology, relationships and human behaviour — 237 structured topics across 14 modules, plus a research-backed Facts collection and an interactive concept map.

Live: **https://apsideslabs.github.io/mindtrace/**

## What's inside

- **Library** — 237 topics across 14 modules (manipulation, relationships, body language, persuasion, negotiation, human behaviour, cognitive biases, decision making, social psychology, personality, deception & truth, power & status, behavioural economics, criminology).
- **Facts** — sourced, evidence-rated findings organised into collections, grouped under Psychology, Relationships, Social & Human Behaviour, and Crime & Dark Psychology.
- **Map** — an interactive graph of how concepts connect (category map, concept web, relationship graph), exportable as an image.
- **Quotes** — a curated, attributable set of quotes by theme.
- **Reading tools** — bookmarks, progress tracking and full-library search. All state is stored locally in the browser.

MindTrace is an educational resource. It teaches patterns and probabilities, not certainty — see the in-app disclaimer. It is not medical, legal or diagnostic advice.

## Tech

React 19 · TypeScript · Vite 6 · Tailwind CSS v4 · Motion · React Flow. Fully static — no server or API keys required.

## Development

```bash
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
npm run preview  # preview the production build
npm run lint     # type-check
```

## Deployment

Pushing to `main` builds the site and deploys it to GitHub Pages via the workflow in `.github/workflows/deploy.yml`.

## License

Apache-2.0 — see [LICENSE](LICENSE).
