# North Track Studios

A cutting-edge technology studio website built with Next.js 16, Tailwind CSS 4, and TypeScript.

## Design

- **Palette**: Black base with gold (#C8A84E) accent lines and highlights
- **Motif**: Compass — precision, navigation, direction
- **Aesthetic**: Minimal, technical, high-end — grid overlays, monospace labels, gold gradient text

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Fonts**: Geist Sans + Geist Mono

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

```
src/
├── app/
│   ├── globals.css      # Design tokens, animations, utilities
│   ├── layout.tsx        # Root layout with metadata
│   └── page.tsx          # Home page assembly
└── components/
    ├── CompassLogo.tsx   # SVG compass mark (sm + lg variants)
    ├── Navigation.tsx    # Fixed nav with mobile menu
    ├── Hero.tsx          # Full-screen hero with grid overlay
    ├── Services.tsx      # 4-card services grid
    ├── About.tsx         # Mission, stats, principles
    ├── Contact.tsx       # Contact form + details
    └── Footer.tsx        # Minimal footer with coordinates
```

## Deployment

Optimized for Vercel. Push to deploy.
