# TAI Future — Movement Intelligence Prototype

## Overview

Desktop web prototype for Tectonica.AI's **Movement Intelligence** platform — an AI-powered suite of bots for political and social movement organizing. This is a **non-functional mockup** showcasing the future product's look and feel. No backend, no real bot logic — just the UI.

**User**: Ned Howey (Organizer)
**Organization**: People's Movement
**Deployed**: Railway from `github.com/MarSpada/tectonica.ai-future` (auto-deploys on push to main)

## Tech Stack

- Vanilla HTML/CSS/JS (no frameworks, no build step)
- **Google Sans** font (self-hosted variable font, TTF files in project root)
- GSAP for animations (CDN)
- SortableJS for drag-and-drop featured carousel (CDN)
- Dev server: `npx serve . -l 3000` (configured in `.claude/launch.json`)

## File Structure

```
/
├── CLAUDE.md
├── package.json
├── index.html          # full page structure (~900 lines)
├── styles.css          # all styles (~2700+ lines)
├── main.js             # interactions & navigation (~710 lines)
└── images/logo-color.png  # Tectonica.AI color logo
```

## Current Theme: Light Pastel ("Google Labs" style)

### Design Tokens (CSS custom properties)

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#d4c0fd` | Page background (light lavender) |
| `--card-bg` | `#ffffff` | Card backgrounds |
| `--card-stroke` | `rgba(0,0,0,.08)` | Card border |
| `--sidebar-bg` | `#d4c0fd` | Matches page bg, seamless |
| `--sidebar-active` | `#6B3FA0` | Dark purple accent |
| `--text-primary` | `#1a1a2e` | Primary text |
| `--text-secondary` | `#4a4a6a` | Secondary text |
| `--text-muted` | `#8a8aaa` | Muted text |
| `--accent-purple` | `#7C3AED` | Purple accent |
| `--sidebar-width` | `180px` | Left sidebar width |
| `--radius` | `8px` | Default border radius |
| `--radius-sm` | `6px` | Small radius |
| `--radius-lg` | `12px` | Large radius |

### Category Pastel Colors (bot cards)

| Category | CSS var | Card bg | Circle |
|---|---|---|---|
| Advisors | `--cat-organizer` | `#FFB5A7` (coral) | `#E89485` |
| Create Things | `--cat-content` | `#A8D8EA` (sky blue) | `#7FC4DB` |
| Use Organizing Tools | `--cat-fundraising` | `#B5EAD7` (mint) | `#8DD4BC` |
| Understand + Analyze | `--cat-admin` | `#FFDAC1` (yellow/peach) | `#F0B88A` |

### Typography

- **Font family**: Google Sans (variable, self-hosted)
- Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold), 800 (extra bold)

## Layout (3 columns)

- **Top bar**: `#B3BBEE` bg, logo-color.png, org name "People's Movement", "Group Name" pill
- **Left sidebar** (180px): Action Center, Group Coach Bot, Group Media nav items + Leaders & Organizers chat button at bottom
- **Main content**: `overflow-x: hidden`, "What do you want to do today, Ned?" header, bot grid
- **Right sidebar** ("Group Dashboard"): 12-column CSS grid with stat/action widgets

## Right Sidebar — 12-Column Grid Layout

The Group Dashboard sidebar uses `grid-template-columns: repeat(12, 1fr)` with explicit placement:

| Widget | Columns | Rows | Background | Description |
|---|---|---|---|---|
| **New Sign-Ups** | 1–9 | 1–2 | `#fef3c7` (warm yellow) | John Doe & Mary Doe alerts with "contact within 48 hrs" hint |
| **Recruit More People** | 10–12 | 1–2 | `var(--accent-purple)` | Standalone purple CTA widget with person+ icon |
| **Group Conversation** | 1–6 | 3–7 | `#f5f3ff` | 3 chat messages + "Open Conversation" button → overlay |
| **Group Actions** | 7–12 | 3–7 | `#f0e6ff` | 5 action items with times (9 AM–5 PM) |
| **Fundraising** | 1–4 | 8–14 | `#fff3e0` | $1,500 of $1,900 goal + progress bar + budget line ($150) + Request Reimbursement |
| **Recruitment Goal** | 5–8 | 8–11 | `#e0f2fe` | 15 Members of 25, 40 Supporters of 100 + progress bar |
| **Submit for Approval** | 9–12 | 8–9 | `#fdf2f8` | Description + Send for Approval button |
| **Connected Systems** | 9–12 | 10–14 | `#f8fafc` | Action Network, VAN, Mobilize (stacked vertically) |
| **Hours Volunteered** | 5–8 | 12–14 | `#ecfdf5` | 126 hours this month + green progress bar |
| **Group Directory** | 1–8 | 15–20 | `#fff` | 6 people list (Ned, Sara, Marcus, Jasmine, David, Lucia) |

## Bot Categories & Cards

### Bot Card Design
- 6-column grid (`repeat(6, 1fr)`) with 14px gap
- `aspect-ratio: 3 / 4` (tall portrait cards)
- Solid pastel bg per category, `border-radius: 20px`
- Circle placeholders (56px colored circles, `width: 75%`)
- Hover: `translateY(-4px)` lift + deeper shadow

### "Your Bots" (Featured Section)
- Horizontal scrollable carousel with SortableJS drag-and-drop
- Cards ~15% larger: 5 per row
- Cards inherit source-category colors via `data-category` attribute
- Default featured: Graphics Creation, Canvassing Planner, Group Leadership Coach, Events Planning + Management, Creating People Power

### Bot Categories (current)

**Advisors** (green/mint — `--cat-organizer` mapped to coral in featured, `--cat-admin` for this category display)
- Getting Started
- Local Strategy Planning
- Recruitment Planning
- Action Planning
- Events Planning + Management
- Relationship/Contact Mng
- Group Leadership Coach
- Group Fundraising
- Canvassing Planner

**Create Things** (purple/blue — `--cat-content`)
- Graphics Creation
- Written Content
- Distributed Email
- Set-Up/Manage Group Webpage
- Video Creation

**Use Organizing Tools** (orange — `--cat-fundraising`)
- Ad Placement
- Social Media
- Tech Tools How-To
- Targeted Advocacy

**Understand + Analyze** (blue — `--cat-admin`)
- Creating People Power
- Recruitment Progress
- Email Performance
- Networks/Resources/Orgs
- Group Decision Making

## Key UI Components

### Group Conversation Overlay
- Triggered by "Open Conversation" button in chat-preview widget
- Full overlay inside right sidebar with message thread + input
- Toggle via `#group-msg-btn` / `#group-msg-close`

### Bot Chat View
- Triggered by clicking any bot card
- Toggled via `body.chat-mode` class
- Full chat interface with AI bot responses

### Leaders & Organizers Chat Panel
- Triggered by sidebar chat button (`#floating-chat-btn`)
- Slide-in panel from left side

### SortableJS Featured Carousel
- Drag to reorder featured bots
- `onAdd` detects source category → sets `data-category` for coloring
- Star button on bot cards adds/removes from featured

## Conventions

- All files in root (flat structure)
- CSS custom properties for all design tokens in `:root`
- BEM-inspired class naming (`.rs-widget`, `.rs-widget__title`, `.rs-widget--money`, `.bot-card`, `.bot-card__circle`)
- No inline styles or inline event handlers (except avatar background colors)
- Mobile is out of scope — desktop only
- GSAP animations for entrance effects
- All widget classes use `rs-widget--{name}` modifier pattern

## Pending / Next Steps

- **Figma export**: The Figma MCP server has been installed (`claude mcp add --scope user --transport http figma https://mcp.figma.com/mcp`). Next conversation should authenticate via `/mcp` → figma → Authenticate, then export the current design to Figma.
- Additional structure/name/functionality changes deferred from CEO meeting
