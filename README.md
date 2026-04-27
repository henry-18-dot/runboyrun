# Run boy run

A first-playable technical skeleton for a 2D ambient side-scrolling Canvas game.

## Start

```bash
npm install
npm run dev
```

Open the printed local URL in Chrome or Edge.

## Implemented in this scaffold

- Vite + native JS module project layout.
- Full-screen Canvas with resize handling.
- `requestAnimationFrame` game loop with smooth pause timescale.
- Keyboard input model for speed tiers and limited left walk.
- Rider/horse placeholder silhouette animation and state machine.
- Infinite segment generation (`Tile -> Segment -> Biome Chunk` shape).
- Theme/weather/time preset switching with non-repeating theme picks.
- Layered renderer (sky/far/mid/ground/rider/foreground/ui).
- Settings drawer with bilingual toggle and required controls.
- Audio architecture placeholders with non-blocking fallback.
- Loading screen that continues even when optional assets fail.

## Placeholder interfaces

- Landmark system (`LandmarkManager`).
- Deterministic seeded journey implementation (`SeededRandom` stub).
- Sprite atlas playback (`SpriteAnimator`).
- Real audio asset playback and content-filled manifests.
- Focus Journey progression and achievements.
