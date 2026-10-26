<div align="center">

# 🍄 Riko & the Emberleaf Meadow

**An original 8-bit platformer — 10 heroes, 4 worlds, 16 stages.**
Plays in any browser, on desktop and on your phone.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Phaser](https://img.shields.io/badge/Phaser-4-8A2BE2)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Deploy](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)

</div>

---

## ✨ Features

- **10 playable heroes**, each with unique stats and a signature special move (dash, shield, ground-pound, freeze and more)
- **4 themed worlds** — Green Plains, Sunscorch Desert, Frostbite Mountain and Lava Castle — with a boss fight in stage 4-4
- **5 enemy types** with their own behaviour: walkers, kickable shells, flyers, fire-spitters and charging spikers
- **Classic platforming feel** — variable jump height, momentum, brick blocks, `?` blocks, pipes, pits and a flagpole finish
- **Fully responsive** — a 16:9 screen that scales to any window, with on-screen touch controls on phones and tablets
- **Pause, restart and retry** at any time
- **Synthesized sound effects** — no audio files, generated with the Web Audio API
- Adjustable settings: volume, screen shake, reduced motion, high contrast, touch controls

## 🎮 Controls

| Action  | Keyboard                          | Phone / tablet        |
| ------- | --------------------------------- | --------------------- |
| Move    | `←` `→` or `A` `D`                | on-screen ◀ ▶         |
| Jump    | `↑` / `W` / `Space` (hold = higher) | on-screen **JUMP**  |
| Run     | `Shift`                           | —                     |
| Special | `X`                               | on-screen **X**       |
| Pause   | `Esc` / `P`                       | ❚❚ button             |
| Restart | `R`                               | Pause menu → Restart  |

> 📱 Touch controls appear automatically on touch devices (Settings → Touch Controls: AUTO / ON / OFF).
> Rotate your phone to landscape for the biggest play area.

## 🚀 Getting Started

**Requirements:** Node.js 18+

```bash
npm install
npm run dev        # start the dev server at http://localhost:5173
```

| Script            | What it does                              |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Start the development server              |
| `npm run build`   | Type-check and build to `dist/`           |
| `npm run preview` | Serve the production build locally        |
| `npm run lint`    | Lint the project with Oxlint              |

## ☁️ Deploy to Vercel

The project ships with a `vercel.json`, so no configuration is needed.

1. Push this repository to GitHub.
2. In Vercel, choose **Add New → Project** and import the repo.
3. Click **Deploy** — Vercel detects Vite automatically.

Or from the terminal: `npx vercel --prod`

## 🗂️ Project Structure

```
src/
├─ main.tsx, App.tsx            App entry and screen/modal routing
├─ index.css, game.css          Menu styles · in-game HUD, touch and responsive styles
├─ components/
│  ├─ MainMenu, HUD, LoadingScreen, GameCanvas, TouchControls
│  └─ Modals/                   World map, hero select, settings, controls, archive, inspector
└─ game/
   ├─ main.ts                   Phaser config (16:9, FIT scaling)
   ├─ scenes/PlayScene.ts       The playable level
   ├─ entities/                 Enemy, Block, PowerUp
   ├─ data/heroes.ts            Hero roster and stats
   ├─ input/TouchInput.ts       Bridge between touch buttons and the scene
   ├─ audio/                    Synthesized sound effects
   ├─ EventBus.ts               React ⇄ Phaser messaging
   └─ GameSettings.ts           Persisted settings (localStorage)
public/assets/                  Sprites, enemies, heroes, sounds and licenses
```

## 🧰 Tech Stack

- **[React](https://react.dev)** for menus, HUD and modals
- **[Phaser](https://phaser.io)** for gameplay, physics and rendering
- **[TypeScript](https://www.typescriptlang.org)** and **[Vite](https://vite.dev)** for tooling
- **[Tailwind CSS](https://tailwindcss.com)** plus custom CSS for the retro look

## 🙏 Credits

- Terrain and item art: Kenney, *Platformer Art: Pixel* (CC0). License files are in `public/assets/`.
- Hero sprite sheets: see `public/assets/hero/LICENSE.txt`.

## 📄 Disclaimer

This is an independent fan-style project made for learning and fun. It is not affiliated with or endorsed by Nintendo.
