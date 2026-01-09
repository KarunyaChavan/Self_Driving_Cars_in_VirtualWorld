# World Persistence

This branch focuses on saving and restoring complete world state to enable uninterrupted editing across sessions and sharable `.world` files.

## Scope
- Persists graph, road attributes, envelopes, borders, buildings, trees, lane guides, markings, and viewport state.
- Loads a previously saved world and reconstructs all components without re-generating random elements.

## What Persists
- Graph and geometry: `graph`, `envelopes`, `roadBorders`, `laneGuides`.
- Road config: `roadWidth`, `roadRoundness`, `buildingWidth`, `buildingMinLength`, `spacing`, `treeSize`.
- World objects: `buildings`, `trees` (positions preserved).
- Markings: All types via `Marking.load(...)`.
- Viewport: `zoom` and `offset` for consistent camera state.

## Save and Load
- Save (`index.html` → `save()`):
   - Captures `viewport.zoom` and `viewport.offset` into `world`.
   - Creates a downloadable `.world` JSON using a data URL.
   - Also writes the same JSON to `localStorage` under `world`.
- Load (`index.html` → `load(event)`):
   - Reads a selected `.world` file with `FileReader`.
   - Parses JSON and calls `World.load(worldInfo)` to reconstruct state.
   - Stores the loaded world in `localStorage` and reloads the page to apply viewport.

## World.load()
- Rebuilds the world deterministically from JSON:
   - Loads `graph` first, then attributes (road and building config).
   - Restores `envelopes`, `roadBorders`, `buildings`, `trees`.
   - Restores `laneGuides` and `markings`.
   - Applies `zoom` and `offset` for the viewport.

## Usage
- Open `index.html` in a modern browser.
- Use 💾 to save a `.world` file and 📂 to load one.
- Pan (middle‑click drag) and zoom (mouse wheel) to adjust the view; state is saved.

## File Overview
- `index.html`: UI, `save()`/`load()` persistence.
- `js/world.js`: `World.load()` and generation logic.
- `js/viewport.js`: Zoom/offset handling used by save/load.`.
