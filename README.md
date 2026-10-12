<div align="center">

<img src="assets/wordmark.svg" alt="MindTrace — a reading library for psychology, relationships and human behaviour" width="320">

**Understand people. Understand yourself.**

A reading library for psychology, relationships and human behaviour — **262 structured entries** across **14 modules**, with a sourced facts library and an interactive concept map. Fully static: no account, no server, no tracking.

[![Live](https://img.shields.io/badge/live-apsideslabs.github.io%2Fmindtrace-b23a2a?style=flat-square&logo=github&logoColor=white)](https://apsideslabs.github.io/mindtrace/)
[![License](https://img.shields.io/badge/license-Apache--2.0-14120f?style=flat-square)](LICENSE)
[![Static](https://img.shields.io/badge/static-no%20backend-4e7a3a?style=flat-square)](#tech-stack)

[![React](https://img.shields.io/badge/React-19-149eca?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646cff?style=flat-square&logo=vite&logoColor=white)](https://vite.dev)

[Live site](https://apsideslabs.github.io/mindtrace/) · [Report a bug](https://github.com/apsideslabs/mindtrace/issues) · [Request a feature](https://github.com/apsideslabs/mindtrace/issues)

</div>

---

## Quick start

```bash
git clone https://github.com/apsideslabs/mindtrace.git
cd mindtrace
npm install
npm run dev
```

Or just read it — the library is live at **<https://apsideslabs.github.io/mindtrace/>**.

## Contents

- [What it is](#what-it-is)
- [What you can learn](#what-you-can-learn)
- [Features](#features)
- [How it works](#how-it-works)
- [Facts and quotes](#facts-and-quotes)
- [Tech stack](#tech-stack)
- [Scripts](#scripts)
- [Deployment](#deployment)
- [Project structure](#project-structure)
- [Responsible use](#responsible-use)
- [License](#license)

## What it is

MindTrace is a reading library for psychology, relationships and human behaviour. It runs entirely in the browser — no account, no server and no tracking — and every note, bookmark and preference stays on the device.

Across the 262 entries sit **2,742 individual sections** of writing, an average of 10.5 per entry, which is roughly **18 hours of reading** at the library's own stated read times. Each entry is self-contained and written in plain language, with the substance marked so it can be found at a glance.

| | |
| :--- | :--- |
| **Entries** | 262 across 14 modules |
| **Sections** | 2,742 (avg 10.5 per entry) |
| **Facts** | 31 sourced findings in 8 collections |
| **Quotes** | 32 from 24 authors, in 6 themes |
| **Reading time** | about 18 hours |
| **Hosting** | GitHub Pages — static, no backend |

## What you can learn

Every entry runs to roughly ten sections — typically *What It Is*, *Why It Works*, *How It Actually Appears*, *Real Phrases*, *Warning Signs*, *Protection Strategy*, *Common Mistakes* and a closing *Key Insight* — so you can read straight through or jump to what you need.

| Module | Entries | What it covers |
| :--- | ---: | :--- |
| **Persuasion** | 33 | The mechanisms of influence — reciprocity, scarcity, social proof, framing, pre-suasion. |
| **Negotiation** | 30 | Strategy and leverage — BATNA, ZOPA, first offers, concessions, tactical empathy, hardball tactics. |
| **Manipulation** | 20 | Coercive tactics and their warning signs — gaslighting, love bombing, DARVO, intermittent reinforcement. |
| **Relationships** | 20 | Attachment, communication, boundaries, and what separates healthy connection from harmful. |
| **Body Language** | 20 | Non-verbal cues, micro-expressions, posture, baseline behaviour and cultural differences. |
| **Human Behaviour** | 18 | Everyday effects that shape how people act — the halo effect, loss aversion, the bystander effect. |
| **Behavioural Economics** | 16 | Money and value perception — prospect theory, mental accounting, the pain of paying. |
| **Cognitive Biases** | 16 | Systematic errors in judgement — anchoring, hindsight, survivorship, the planning fallacy. |
| **Criminology** | 16 | Predatory behaviour — grooming, coercive control, the cycle of abuse, victim selection. |
| **Personality** | 16 | Traits and typologies — the Big Five, the dark triad, attachment styles, grit, locus of control. |
| **Power & Status** | 15 | Hierarchies and status — dominance versus prestige, gatekeeping, the Matthew effect. |
| **Decision Making** | 14 | How people choose — choice overload, decision fatigue, the decoy and default effects. |
| **Social Psychology** | 14 | Groups and influence — conformity, obedience, groupthink, deindividuation. |
| **Deception & Truth** | 14 | Interviewing and cues — the cluster principle, the Othello error, cognitive load. |

## Features

- **Library** — Browse every entry by module; filter by unread, read or saved, and search within a module.
- **Reader** — A long-form entry with a contents sidebar, reading-progress bar, related reading and previous / next navigation.
- **Key-line emphasis** — The key line of every section is underlined and the important points in warning and protection sections are highlighted. Switchable.
- **Notes & highlights** — Select any passage to add a note; it is re-marked inline in your chosen colour and saved. Export everything to a single Markdown file.
- **Map** — An interactive graph of how entries connect — category map, concept web and relationship graph — exportable as a PNG.
- **Facts** — 31 sourced findings, each with an evidence rating and a cited reference.
- **Quotes** — 32 attributable quotes grouped into six themes.
- **Search** — A global overlay that searches entries and facts as you type.
- **Reading settings** — Theme, accent colour, text size, page width, highlight colour, emphasis and focus mode.
- **Profile** — Entries read, saved items, reading time and library progress, with a one-click clear of local data.

## How it works

Everything is static. The content layer is a folder of JSON entries and typed data files; the app reads them at build time and keeps all reader state in the browser.

```mermaid
flowchart LR
    subgraph Content["Static content"]
        E["262 entries<br/>14 modules"]
        F["31 facts<br/>8 collections"]
        Q["32 quotes<br/>6 themes"]
    end

    subgraph App["React application"]
        IDX["content-index<br/>registry · lookup · search"]
        V["Views<br/>Home · Library · Reader<br/>Map · Facts · Quotes · Notes · Profile"]
        S["settings.ts · store.ts"]
    end

    LS["Browser local storage<br/>notes · bookmarks · preferences"]

    E --> IDX
    F --> IDX
    IDX --> V
    Q --> V
    S --> V
    V --> LS
```

<details>
<summary><strong>Module map</strong> — the fourteen modules at a glance</summary>

```mermaid
mindmap
  root((MindTrace))
    Persuasion
    Negotiation
    Manipulation
    Relationships
    Body Language
    Human Behaviour
    Behavioural Economics
    Cognitive Biases
    Criminology
    Personality
    Power and Status
    Decision Making
    Social Psychology
    Deception and Truth
```

</details>

## Facts and quotes

Alongside the entries sits a facts library: short, sourced findings that each carry an evidence rating and a cited reference. The 31 findings are grouped into eight collections under four categories.

| Category | Collection | Findings |
| :--- | :--- | ---: |
| Psychology Facts | Brain & Cognition | 3 |
| Psychology Facts | Cognitive Biases | 5 |
| Psychology Facts | Decision Making | 5 |
| Psychology Facts | Emotion | 1 |
| Psychology Facts | Memory | 1 |
| Relationships, Love & Sex | Attachment & Attraction | 7 |
| Social & Human Behaviour | Social Influence | 4 |
| Crime & Dark Psychology | Deception & Manipulation | 5 |

Evidence ratings run from 3 to 5 on the product's own scale: 13 findings are rated 5, 17 are rated 4 and one is rated 3. Every finding cites at least one source.

The library closes with **32 quotes from 24 authors**, grouped into six themes: Psychology (8), Philosophy (9), Human Nature (6), Leadership (3), Success & Work (3) and Motivation & Discipline (3) — from Carl Jung, Daniel Kahneman and Viktor Frankl to Marcus Aurelius, Seneca and Sun Tzu.

## Tech stack

| Layer | Choice |
| :--- | :--- |
| Framework | React 19 |
| Language | TypeScript 5.8 |
| Build | Vite 6 |
| Styling | Tailwind CSS 4 |
| Animation | Motion |
| Concept map | React Flow + Dagre |
| Image export | html-to-image |
| Icons | lucide-react |
| Type | Fraunces (display) · Inter (body) |

There is no backend, no API key and no tracking. Reading history, bookmarks, notes and display preferences are stored in the browser's local storage; nothing leaves the device.

## Scripts

| Command | Does |
| :--- | :--- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Type-check with `tsc` |

**Requires** Node.js 20 or newer.

## Deployment

Pushing to `main` builds the site and publishes it to GitHub Pages via the workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

```mermaid
flowchart LR
    A["push to main"] --> B["npm ci"] --> C["npm run build"] --> D["upload dist/"] --> E["deploy to GitHub Pages"]
```

## Project structure

```text
mindtrace/
├── .github/workflows/deploy.yml   # build + deploy to GitHub Pages
├── assets/                        # README wordmark
├── public/                        # favicon, robots.txt, sitemap.xml
├── src/
│   ├── components/                # Home · Library · Reader · Map · Notes · Profile
│   ├── content/
│   │   ├── content-index.ts        # category registry, lookup and search
│   │   ├── quotes.ts               # 32 quotes across 6 themes
│   │   ├── facts/                  # 4 categories · 8 collections · 31 findings
│   │   └── <module>/               # 14 modules · 262 entry .json files
│   ├── facts/                      # fact browsing and reader views
│   ├── settings.ts                 # theme, accent, text size, page width, focus
│   ├── store.ts                    # local-storage reader state
│   └── App.tsx
├── index.html
└── package.json
```

## Responsible use

MindTrace is an educational resource. It teaches patterns and probabilities, not certainty. It is **not** medical, legal or diagnostic advice, and it is not a substitute for a qualified professional. Always read it alongside your own judgement.

## License

Released under the [Apache-2.0 License](LICENSE).

<div align="center">
<sub>Built by <a href="https://github.com/apsideslabs">Apsides Labs</a></sub>
</div>
