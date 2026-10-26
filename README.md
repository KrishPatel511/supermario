<div align="center">

# 🍄 Riko & the Emberleaf Meadow

### An original 8-bit platformer — 10 heroes · 4 worlds · 16 stages

Plays instantly in the browser on desktop, tablet and phone.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Phaser](https://img.shields.io/badge/Phaser-4-8A2BE2)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)
![Deploy](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)

</div>

---

## 📖 Table of Contents

1. [About the Game](#-about-the-game)
2. [Features](#-features)
3. [How to Play](#-how-to-play)
4. [Heroes](#-heroes)
5. [Worlds and Enemies](#-worlds-and-enemies)
6. [Screens and Menus](#-screens-and-menus)
7. [Getting Started](#-getting-started)
8. [Project Structure](#-project-structure)
9. [Architecture](#-architecture)
10. [Responsive Design and Mobile Support](#-responsive-design-and-mobile-support)
11. [Settings](#-settings)
12. [Deployment](#-deployment)
13. [Customizing the Game](#-customizing-the-game)
14. [Troubleshooting](#-troubleshooting)
15. [Credits and License Notes](#-credits-and-license-notes)

---

## 🎯 About the Game

*Riko & the Emberleaf Meadow* is a 2D side-scrolling platformer in the spirit of classic 8-bit adventures.
Pick one of ten heroes, run and jump through four themed worlds, stomp enemies, bump blocks for coins and
power-ups, and reach the flagpole at the end of each stage. World 4 ends with a boss fight.

The game is built as a **React app that hosts a Phaser game**: React draws the menus, HUD and touch
controls, while Phaser handles the level, physics and rendering.

## ✨ Features

- **10 playable heroes** with different speed, jump, power and defense stats, and a special move on `X`
- **4 worlds × 4 stages** — Green Plains, Sunscorch Desert, Frostbite Mountain and Lava Castle
- **Boss fight** in stage 4-4
- **5 enemy types**, each with its own behaviour
- **Platforming basics done right** — variable jump height, acceleration and momentum, brick and `?` blocks,
  warp pipes, pits, spikes, a moving platform and a flagpole finish
- **Power-up** that makes the hero bigger and lets them break bricks
- **Pause, restart and retry** at any time
- **Fully responsive** 16:9 game screen with **on-screen touch controls** for phones and tablets
- **Synthesized sound effects** generated in code with the Web Audio API (no audio files needed for most sounds)
- **Settings** for volume, screen shake, reduced motion, high contrast and touch controls, saved between visits
- **Extra screens** — world map, hero select, hero/item/enemy archive, controls guide and a stage inspector

## 🎮 How to Play

**Goal:** reach the flagpole at the end of the stage before the timer (300 seconds) runs out, without losing all 3 lives.

### Controls

| Action  | Keyboard                              | Phone / tablet          |
| ------- | ------------------------------------- | ----------------------- |
| Move    | `←` `→` or `A` `D`                    | on-screen **◀ ▶**       |
| Jump    | `↑` / `W` / `Space` (hold = higher)   | on-screen **JUMP**      |
| Run     | `Shift`                               | —                       |
| Special | `X` (3-second cooldown)               | on-screen **X**         |
| Pause   | `Esc` or `P`                          | **❚❚** button in the HUD |
| Restart | `R`                                   | Pause menu → Restart    |

### Rules

- **Stomp** an enemy by landing on it from above. Touching it from the side hurts you.
- **Spikes, fire and non-stompable enemies** hurt even if you land on them.
- **Bump `?` blocks** from below for coins (+50) or a power-up. A power-up makes you bigger; a big hero
  survives one hit (shrinking instead of losing a life) and can break brick blocks.
- **Falling into a pit** or **running out of time** costs a life and sends you back to the start.
- After a hit you are briefly **invincible** and flash. Heroes with higher defense stay invincible longer.
- **Lives:** you start each stage with 3. Lose all of them and it is game over — retry the stage or go back to the menu.
- **Score:** coins (+10), stomps (enemy points), blocks, special kills (+150), boss (+2000) and a time bonus on finishing.

## 🦸 Heroes

Each hero has four stats (1–10). Speed sets top running speed, Jump sets jump strength,
Defense sets how long you stay invincible after being hit, and Power is shown on the hero card.

| Hero   | Style      | Special (`X`)          | What it does                                             |
| ------ | ---------- | ---------------------- | -------------------------------------------------------- |
| RIKO   | Balanced   | Ember Burst            | Short-range fire blast that defeats nearby enemies       |
| MIKO   | Speedster     | Lightning Dash         | Fast dash while invincible                               |
| VOLT   | Acrobat     | Thunder Leap           | Big upward leap                                          |
| BLADE  | Ninja   | Shadow Slash           | Short-range blast in front of the hero                   |
| AEGIS  | Tank       | Iron Barrier           | Gold shield for 3.5 seconds                              |
| SHIN   | Shinobi    | Kunai Storm            | Short-range blast in front of the hero                   |
| CINDER | Flame Rush       | Inferno Blast          | Short-range blast in front of the hero                   |
| FROST  | Ice Shield    | Glacial Freeze         | Freezes every enemy for 3 seconds                        |
| AERO   | Wind Leap      | Cyclone Lift           | Highest leap of all heroes                               |
| TITAN  | Heavy Brawler      | Earthquake Stomp       | Shakes the screen and defeats every enemy                |

Hero data (stats, descriptions, pixel-art colors) lives in `src/game/data/heroes.ts`.

## 🌍 Worlds and Enemies

| World | Theme                | Difficulty | Enemies                                              |
| ----- | -------------------- | ---------- | ---------------------------------------------------- |
| 1     | Green Plains         | Easy       | Sprout walkers, Bramble shells, Puffwings (later stages) |
| 2     | Sunscorch Desert     | Medium     | Faster Brambles, more Puffwings, Spikers             |
| 3     | Frostbite Mountain   | Hard       | Spikers, Brambles, Puffwings, Emberjaw fire-spitters |
| 4     | Lava Castle          | Expert     | Emberjaws, Spikers, Puffwings, lava floor, boss in 4-4 |

Later stages in a world add more enemies. Each world also changes the ground tiles, sky color and background hills.

### Enemy types

| Enemy       | Behaviour                                                              | Stompable |
| ----------- | ---------------------------------------------------------------------- | --------- |
| **Sprout**  | Walks back and forth, turns around at walls and pipes                  | ✅        |
| **Bramble** | Walks; stomping it makes a shell. Touch or stomp the shell to kick it, stomp a sliding shell to defeat it | ✅ |
| **Puffwing**| Floats in a wave pattern                                               | ✅        |
| **Emberjaw**| Bobs up and down in place                                              | ❌        |
| **Spiker**  | Patrols, then charges when the player gets close                       | ❌        |

## 🖥️ Screens and Menus

| Screen          | Purpose                                                                  |
| --------------- | ------------------------------------------------------------------------ |
| Main menu       | Play, World Map, Hero Roster, Controls, Settings, Stage Inspector        |
| Hero select     | Browse the 10 heroes and their stats, then start                         |
| World map       | Choose any of the 16 stages                                              |
| Loading screen  | Short stage intro between stages                                         |
| In-game HUD     | Score, coins, world, time, lives, special cooldown, menu and pause       |
| Pause / Game over / Stage clear | Overlays with Resume, Restart, Retry, Next Stage and Main Menu |
| Archive         | Hero roster, items and enemy bestiary                                    |
| Controls        | Guide to every key                                                       |
| Settings        | Volume, effects and accessibility options                                |
| Stage inspector | Overview of stage layouts and details                                    |

## 🚀 Getting Started

**Requirements:** [Node.js](https://nodejs.org) 18 or newer and npm.

```bash
# 1. Install dependencies
npm install

# 2. Start the development server  →  http://localhost:5173
npm run dev
```

| Script            | What it does                                                  |
| ----------------- | ------------------------------------------------------------- |
| `npm run dev`     | Start the dev server with hot reload                          |
| `npm run build`   | Type-check with `tsc`, then build the production site to `dist/` |
| `npm run build:dev` | Build in development mode                                   |
| `npm run preview` | Serve the production build locally (http://localhost:4173)    |
| `npm run lint`    | Lint with Oxlint                                              |

## 🗂️ Project Structure

```
mario-game/
├─ index.html                  HTML shell: meta tags, fonts, mounts <div id="root">
├─ package.json                Dependencies and scripts
├─ vite.config.ts              Vite config (React, Tailwind, path support, Phaser chunk)
├─ vercel.json                 Vercel deployment settings
├─ tsconfig*.json              TypeScript configuration
├─ .oxlintrc.json              Lint rules
├─ .gitignore                  Keeps node_modules and dist out of git
│
├─ public/                     Static files, served as-is from the site root
│  ├─ favicon.svg, icons.svg
│  └─ assets/
│     ├─ coin.png, gem.png, flag.png, spike.png, ground.png, …   Items and terrain
│     ├─ heart_full.png, heart_empty.png                          HUD hearts
│     ├─ enemies/                 sprout, bramble, puffwing, emberjaw, spiker
│     ├─ hero/                    Animated hero sheets: idle, walk, jump, fall
│     ├─ heroes/                  Portraits of the 10 heroes
│     ├─ sfx/coin.mp3             Coin sound
│     └─ *LICENSE.txt             Art licenses
│
└─ src/
   ├─ main.tsx                 React entry point; imports the stylesheets
   ├─ App.tsx                  Top-level state: which screen/modal is open,
   │                           selected hero and stage
   ├─ index.css                Global styles, menu, retro buttons, modals
   ├─ game.css                 In-game screen: responsive cabinet, HUD,
   │                           touch controls, mobile breakpoints
   │
   ├─ components/              React user interface
   │  ├─ MainMenu.tsx          Title screen and main buttons
   │  ├─ LoadingScreen.tsx     Stage intro card
   │  ├─ GameCanvas.tsx        Creates and destroys the Phaser game
   │  ├─ HUD.tsx               Score bar, pause, game over, stage clear overlays
   │  ├─ TouchControls.tsx     On-screen buttons for phones and tablets
   │  └─ Modals/
   │     ├─ HeroSelectModal.tsx    Choose a hero
   │     ├─ WorldMapModal.tsx      Choose a stage
   │     ├─ ArchiveModal.tsx       Heroes, items and enemies
   │     ├─ ControlsModal.tsx      Controls guide
   │     ├─ SettingsModal.tsx      Settings
   │     └─ StageInspectorModal.tsx  Stage details
   │
   ├─ game/                    Everything Phaser / gameplay related
   │  ├─ main.ts               Phaser configuration (1280×720, FIT scaling, Arcade physics)
   │  ├─ scenes/
   │  │  └─ PlayScene.ts       The playable level: terrain, blocks, enemies, player,
   │  │                        camera, specials, damage, boss, win/lose logic
   │  ├─ entities/
   │  │  ├─ Enemy.ts           Enemy behaviour for all 5 types
   │  │  ├─ Block.ts           Brick and ? blocks
   │  │  └─ PowerUp.ts         Growth gem
   │  ├─ data/
   │  │  └─ heroes.ts          Hero roster, stats, specials and colors
   │  ├─ input/
   │  │  └─ TouchInput.ts      Shared state between touch buttons and the scene
   │  ├─ audio/
   │  │  ├─ Sfx.ts             In-game sound effects (Web Audio)
   │  │  └─ RetroAudio.ts      Menu click and hover sounds
   │  ├─ EventBus.ts           Messaging between React and Phaser
   │  └─ GameSettings.ts       Settings store, saved in localStorage
   │
   └─ lib/
      └─ utils.ts              Small helper (class-name merging)
```

## 🧩 Architecture

### React and Phaser together

React and Phaser never touch each other's internals. They talk through two small bridges.

```
        ┌────────────── React (UI) ──────────────┐
        │  MainMenu · HUD · Modals · TouchControls │
        └───────┬───────────────────────▲─────────┘
   EventBus      │ set-paused            │ hud-update
   (events)      │ restart-stage         │ game-over
                 ▼                       │ level-complete
        ┌────────────── Phaser (game) ───┴────────┐
        │  PlayScene · Enemy · Block · PowerUp     │
        └───────────────────▲─────────────────────┘
                            │ reads every frame
                     TouchInput (shared object)
                            ▲
                  TouchControls buttons write to it
```

- **`EventBus`** (`game/EventBus.ts`) — a Phaser event emitter used as a message channel.
  - Game → UI: `hud-update` (score, lives, coins, time, cooldown), `game-over`, `level-complete`
  - UI → Game: `set-paused`, `restart-stage`
- **`TouchInput`** (`game/input/TouchInput.ts`) — a plain object with `left`, `right`, `jump`, `special`.
  Touch buttons set the flags; `PlayScene.update()` reads them every frame together with the keyboard.

### Screen flow

```
Main menu ──Play──▶ Hero select ──Start──▶ Loading ──▶ Game
    │                    │                               │
    ├─ World map ────────┘                               ├─ Pause / Game over / Stage clear
    ├─ Hero roster (Archive)                             └─ Next stage ──▶ Loading ──▶ Game
    ├─ Controls
    ├─ Settings
    └─ Stage inspector
```

`App.tsx` holds the state for this flow (`view`: menu or game, `modal`: which overlay is open,
plus the selected hero and stage).

### Game loop (PlayScene)

1. **`preload`** — loads sprites, enemy art, hero sheets and audio.
2. **`create`** — resets state, builds textures (blocks, pipes, ground) in code, lays out terrain,
   blocks, hazards and coins, spawns enemies for the world, places the flagpole, and starts the timer.
3. **`update`** (every frame) — reads keyboard and touch input, applies movement and variable-height jumps,
   triggers specials, updates enemies and power-ups, and detects pit falls.
4. **Events** — contact with enemies, hazards, blocks, coins and the flag call into stomp, damage, bump and
   level-complete logic.

### Design decisions

- **Retro look in code:** blocks, pipes, ground tiles and clouds are drawn procedurally on canvas, so they stay crisp at any size.
- **Sound in code:** effects are synthesized with the Web Audio API, so there are no copyright concerns or extra downloads.
- **Phaser in its own chunk:** the build splits Phaser from the app code so returning visitors get faster loads.

## 📱 Responsive Design and Mobile Support

- The game screen is a **16:9 cabinet** sized with CSS to be as large as the window allows, with Phaser's `FIT` scaling inside it.
- HUD text, buttons and overlays **scale with the screen** (they use a `--u` unit equal to 1% of the game width).
- **Landscape phones:** the title header is hidden so the game uses the full height; touch buttons float over the game.
- **Portrait phones:** the touch buttons dock at the bottom, below the game screen, with a hint to rotate for a bigger view.
- **Touch buttons** use pointer events with capture, so multiple fingers work (hold ▶ while tapping JUMP).
- Menus and modals **stack and scroll** on narrow or short screens; heights use `dvh` so mobile browser bars don't cut content off.
- The page blocks pinch-zoom and pull-to-refresh so gameplay isn't interrupted.

Tested at 1366×768 (desktop), 740×360 (phone landscape) and 390×780 (phone portrait).

## ⚙️ Settings

Open **Settings** from the main menu. Values are saved in the browser (`localStorage`).

| Setting          | Effect                                                           |
| ---------------- | ---------------------------------------------------------------- |
| SFX volume       | Scales all sound effects                                         |
| Screen shake     | Turns the camera shake from Titan's special on or off            |
| Reduced motion   | Disables CSS animations                                          |
| High contrast    | Increases contrast across the interface                          |
| Touch controls   | `AUTO` shows them on touch devices, `ON` always, `OFF` never     |

## ☁️ Deployment

The repository includes a `vercel.json`, so Vercel needs no manual configuration.

1. Push the project to GitHub.
2. On [vercel.com](https://vercel.com) choose **Add New → Project** and import the repository.
3. Vercel detects **Vite** automatically. Click **Deploy**.

Or deploy from the terminal:

```bash
npx vercel --prod
```

Every push to `main` redeploys the site automatically. The build output is a static site in `dist/` and works on any
static host (Netlify, GitHub Pages, Cloudflare Pages) as well.

## 🛠️ Customizing the Game

| I want to…                         | Edit                                                       |
| ---------------------------------- | ---------------------------------------------------------- |
| Change hero stats or descriptions  | `src/game/data/heroes.ts`                                  |
| Change a hero's special move       | `useSpecialAbility()` in `src/game/scenes/PlayScene.ts`    |
| Move platforms, blocks, pipes      | The `create()` method in `PlayScene.ts`                    |
| Change which enemies appear        | `buildStageEnemies()` in `PlayScene.ts`                    |
| Change enemy behaviour             | `src/game/entities/Enemy.ts`                               |
| Change jump height or run speed    | Constants at the top of `update()` in `PlayScene.ts`       |
| Change lives or time limit         | `lives` and `timeRemaining` in `PlayScene.ts`              |
| Change HUD or touch button look    | `src/game.css`                                             |
| Change menu and modal look         | `src/index.css`                                            |
| Add or edit sound effects          | `src/game/audio/Sfx.ts`                                    |

## 🩹 Troubleshooting

| Problem                                   | Fix                                                                 |
| ----------------------------------------- | ------------------------------------------------------------------- |
| No sound                                  | Browsers wait for a click or tap before playing audio. Interact with the page first and check the SFX volume. |
| Touch buttons don't show on my laptop     | Settings → Touch Controls → `ON`                                    |
| Touch buttons show on my touch laptop     | Settings → Touch Controls → `OFF`                                   |
| Pixel font looks different                | Fonts load from Google Fonts; they fall back to a system font when blocked or offline. |
| `npm run build` fails on types            | Run `npx tsc -b` to see the exact error.                            |
| Port 5173 is busy                         | Vite picks the next free port and prints it in the terminal.        |

## 🙏 Credits and License Notes

- **Terrain and item art:** Kenney, *Platformer Art: Pixel* — CC0 (public domain). See `public/assets/KENNEY_LICENSE.txt`
  and `public/assets/KENNEY_PIXELART_LICENSE.txt`.
- **Hero animation sheets:** see `public/assets/hero/LICENSE.txt`.
- **Libraries:** [React](https://react.dev), [Phaser](https://phaser.io), [Vite](https://vite.dev),
  [Tailwind CSS](https://tailwindcss.com), [Radix UI](https://www.radix-ui.com).

### Disclaimer

This is an independent fan-style project made for learning and fun. It is not affiliated with or endorsed by Nintendo.
The hero names, world names and enemy designs are original.
