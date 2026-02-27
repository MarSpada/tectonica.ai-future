# TAI Future — Movement Intelligence Prototype

## Overview

Desktop web prototype for Tectonica.AI's **Movement Intelligence** platform — an AI-powered suite of bots for political and social movement organizing. This is a **non-functional mockup** showcasing the future product's look and feel. No backend, no real bot logic — just the UI.

## Layout

- **Sidebar** (left): Tectonica.AI logo, organization name, navigation
- **Main area** (right): Title, stat widgets, bot card grid organized by category

## Screens

### 1. Dashboard (landing)

- **Header**: "What do you want to do today, Ned?"
- **Stat widgets**: Money collected, people mobilised, etc.
- **Bot grid**: Cards grouped under category headings

### Bot Categories & Bots

**Organizer & Group Leader Tools**
- Field / Canvassing Bot
- Relational Organizing Bot
- Events Management Bot
- Relationship / Contacts Management Bot
- Group Placement Bot (CRM-connected)
- Local Strategy and Tactics Bot

**Campaign Content & Production**
- Video Content Bot
- Campaign & Local Microsites
- Distributed Ads (creation + review logic)
- Tech Tools Use Bot
- Content Writing Bot
- Visual Creation Bot

**Distributed Fundraising & Impact Tracking**
- Recruitment Bot
- Distributed Fundraising Bot
- Targeted Advocacy Bot
- Scoreboard (funds raised, impact, engagement)

**Admin & Organizational Infrastructure**
- Networks, Resources, and Orgs
- Data Analysis
- Roles, Permissions & Assignments
- Tracking / Analytics Dashboards & Benchmarking
- Membership Activity Systems
- Decision-Making Environments (ICAs)

### Bot Card Anatomy

Each card contains:
- Icon
- Bot name
- Short description text

## Design System

### Colors

| Token              | Hex       | Usage                    |
|--------------------|-----------|--------------------------|
| `--bg`             | `#081028` | Page background          |
| `--card-bg`        | `#0B1739` | Card backgrounds         |
| `--card-stroke`    | `#343B4F` | Card border              |
| `--sidebar-text`   | `#AEB9E1` | Sidebar inactive text    |
| `--sidebar-active` | `#FD883C` | Sidebar active text      |

### Typography

- **Font family**: Manrope (Google Fonts)
- Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

## Tech Stack

- HTML / CSS / vanilla JS (static prototype, no build step)
- No frameworks, no backend
- Served locally with `npx serve` on port 3000

## Dev Server

```bash
npm start        # serves on port 3000
```

## File Structure

```
/
├── CLAUDE.md
├── package.json
├── index.html          # dashboard / landing
├── styles.css          # all styles
└── main.js             # interactions & navigation
```

## Conventions

- All files in root (flat structure)
- CSS custom properties for all design tokens in `:root`
- BEM-inspired class naming (e.g. `.bot-card`, `.bot-card__icon`, `.bot-card__title`)
- No inline styles or inline event handlers
- Mobile is out of scope — desktop only
