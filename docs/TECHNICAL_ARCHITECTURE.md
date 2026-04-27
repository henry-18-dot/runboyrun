# Technical Architecture

## Runtime modules
- `game/`: game loop, time, event bus, orchestration.
- `core/`: input, settings persistence, asset loading, random stubs.
- `world/`: biome selection and segment lifecycle.
- `entities/rider/`: movement state machine + animation controller.
- `render/`: layered Canvas renderer.
- `audio/`: managers for music, ambience, hoofsteps.
- `ui/`: loading, prompts, settings drawer.

## Data
- `assets/data/themes.json`
- `assets/data/audio_manifest.json`
- `assets/data/sprite_manifest.json`
