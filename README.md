# Self Driving Cars in Virtual World

<video src="assets/osmMiniMap.mp4" controls width="720" poster="assets/osmMiniMap.gif"></video>

A browser-based self-driving car sandbox that couples a road-network editor with a lightweight neural-network driving stack. Built entirely with vanilla JavaScript and HTML5 canvas—no external libraries.

## What’s Included
- **Road editor** (`virtualWorld/index.html`): Graph-based road layout with markings (start, stop, yield, zebra, parking, lights, targets) plus buildings and trees generated from road envelopes.
- **OSM import** (`virtualWorld/js/math/osm.js`): Paste OpenStreetMap JSON to turn nodes/ways into road graphs; scaled using lat/lon extents and cosine-adjusted longitude.
- **Driving sim** (`index.html`, `main.js`): Spawns 1 manual or 100 AI cars by default; follows the best-performing car with a viewport and renders a minimap of the graph.
- **Neural net + GA** (`network.js`, `car.js`): 5→6→4 feedforward network (step activation). Fitness is cumulative speed; mutation lerps weights/biases 10% toward random values in [-1,1]. Save/load best brain via localStorage.
- **Sensors** (`sensor.js`): 5 raycasts over a 90° spread, 150px length; nearest intersection returns normalized offset, null when clear.
- **Visualization** (`visualizer.js`, `miniMap.js`): Live network diagram with animated edge weights; circular minimap showing the road graph and camera origin.

## How to Run
1. **Edit a world**: Open `virtualWorld/index.html`. Draw roads in graph mode, add markings, or paste OSM JSON (🗺️) then click ✔️ to import. Save to `.world` and/or localStorage.
2. **Simulate**: Open `index.html`. It loads the current world (from the included `virtualWorld/saves/big.world` if populated, or from localStorage when saved). Cars spawn at the first `Start` marking, facing its direction vector.
3. **Train / inspect**: Let the AI drive. Click 💾 to persist the best brain; 🗑️ clears it. Toggle `manualMode` in `main.js` to drive with arrow keys.

## Key Files
- `main.js`: Simulation loop, camera follow, best-car selection, minimap update, brain persistence.
- `virtualWorld/js/world.js`: Road envelopes, lane guides, procedural buildings/trees, traffic light state machine, rendering pipeline.
- `virtualWorld/js/math/osm.js`: OSM JSON → `Graph` (points, segments) with one-way detection (`oneway` tag or single lane).
- `virtualWorld/js/math/graph.js`: Point/segment graph with duplicate avoidance and topology helpers.
- `network.js`, `sensor.js`, `car.js`: Neural network, ray sensors, car physics/collision.
- `miniMap.js`: Scaled graph render with camera indicator.

## Controls
- **Editor** (`virtualWorld/index.html`): Mode buttons for graph/markings; 🗺️ open OSM panel; 💾 save; 🗑️ clear.
- **Simulator** (`index.html`): 💾 save best brain; 🗑️ discard. Arrow keys only when `manualMode = true`.

## Data & Persistence
- Worlds: Saved to `.world` download and localStorage (`world`).
- AI brain: Saved to localStorage (`bestBrain`); mutated on reload for population diversity.

## Limitations (honest)
- Single hidden layer with step activation; no continuous steering/throttle outputs.
- Fitness favors speed, not route optimality; no multi-objective scoring.
- No collision-avoidance between AI agents (traffic array empty by default).
- OSM import expects raw JSON from the OSM API; no validation for incomplete tags.
