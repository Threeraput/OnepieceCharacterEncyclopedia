# 🏴‍☠️ One Piece — Character Encyclopedia

> **Every character. Every bounty. One extraordinary world.**  
> An interactive One Piece character encyclopedia and bounty archive inspired by [Grand Line Codex](https://grand-line-codex.lovable.app/) and powered by data from the [One Piece API](https://www.onepieceapi.com/api).

---

## ✨ Features

- **⚓ Complete Grand Line Archive**:
  - Explores **694 characters** across the entire One Piece universe.
  - Dedicated **Bounty Archive** featuring all **154 characters** with active or historical bounties.
- **🔍 Real-Time Multi-Language Search**:
  - Instant live search supporting English, Japanese (Kanji / Kana), and Romaji names.
- **🏷️ Interactive Filter Chips & Dropdowns**:
  - Filter by category: *All characters*, *With bounties*, *Alive*, *Deceased*, and *Saved*.
  - Status dropdown: *All statuses*, *Alive*, *Deceased*, *Unknown*.
  - Sort options: *Highest bounty*, *Lowest bounty*, *Name A–Z*, *Name Z–A*, and *Featured*.
- **🔲 Dual Layout Modes**:
  - **Grid View**: 4-column responsive portrait cards with hover zoom and atmospheric lighting.
  - **List View**: Compact horizontal cards displaying stats and portraits side-by-side.
- **📜 Rich Character Detail Modal**:
  - In-depth attributes: Age, Height, Blood Type, and Birthday (with birthday trivia).
  - **Bounty Progression Track**: Visualizes historical bounty leaps (e.g. Luffy's journey from ฿30M to ฿3B).
  - Background Scroll Lock: Prevents background jumping and scrolling when viewing profiles.
  - One-click profile sharing and clipboard link copy.
- **❤️ Saved Crew (Favorites)**:
  - Save characters to a personal collection stored in `localStorage` with a header badge counter.
- **🔗 URL Query Parameter Synchronization**:
  - Real-time synchronization with the browser URL (e.g. `/?q=&status=all&sort=bounty&view=grid&category=bounties&limit=24`).
- **📱 Fluid Responsive & Mobile-First**:
  - Designed for all devices: phones (320px+), tablets, laptops, and ultra-wide displays.
  - Native-feeling horizontal scrolling for filter chips on mobile.
- **⚡ Resilient Data Fetching Strategy**:
  - 4-Tier fallback pipeline: SessionStorage Cache ➔ Vite Proxy (`/api`) ➔ Local Static Dataset (`/data/characters.json`) ➔ Direct API.
  - 100% immune to browser CORS errors and network drops.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vite.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Linter**: [Oxlint](https://oxc.rs/)
- **Styling**: Modern CSS with OKLCH Color Palette, Container Queries, and Google Fonts (*Barlow Condensed* & *DM Sans*).

---

## 📁 Project Structure

```text
OnepieceCharacterEncyclopedia/
├── public/
│   ├── data/
│   │   └── characters.json         # Complete offline One Piece dataset (694 characters)
│   ├── grand-line-banner.jpg       # Hero banner artwork
│   └── favicon.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Catalog.tsx              # Search, filter bar, chips, and character grid/list
│   │   ├── CharacterCard.tsx        # Portrait card with status and Berries bounty
│   │   ├── CharacterDetailModal.tsx # Modal dialog with stats, bounty progression & scroll-lock
│   │   ├── Footer.tsx               # Site footer and attribution
│   │   ├── Header.tsx               # Navigation, brand skull mark, and saved counter
│   │   └── Hero.tsx                 # Hero section with headline and featured character
│   ├── services/
│   │   └── onePieceApi.ts           # Resilient multi-tier data fetching, filtering & sorting
│   ├── types/
│   │   └── character.ts             # TypeScript definitions for characters and filters
│   ├── App.tsx                      # Main app controller with URL synchronization
│   ├── index.css                    # Grand Line Codex OKLCH design system & responsive styling
│   └── main.tsx                     # React entrypoint
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts                   # Vite config with dev proxy for One Piece API
```

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (version 18 or newer) installed.

### 2. Installation
Clone or navigate to the project directory and install the dependencies:

```bash
npm install
```

### 3. Development Server
Start the local development server:

```bash
npm run dev
```

Open your browser at `http://localhost:5173/` (or the port indicated in your terminal).

### 4. Production Build
Compile TypeScript and generate an optimized production bundle:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

### 5. Linting
Run the fast Oxlint linter:

```bash
npm run lint
```

---

## 🌐 API Attribution & Disclaimer

- Character data and assets are provided by the [One Piece API](https://www.onepieceapi.com/api).
- Design language inspired by [Grand Line Codex](https://grand-line-codex.lovable.app/).
- *One Piece* is created by **Eiichiro Oda** and copyrighted by **Shueisha** and **Toei Animation**. This project is an unofficial fan encyclopedia built for educational and demonstration purposes.
