# Self Driving Cars in Virtual World

<video src="assets/osmMiniMap.mp4" controls width="720" poster="assets/osmMiniMap.gif"></video>
## Project Evolution & Development History

This project was developed incrementally using a feature-branch workflow. Each major functionality was implemented, tested, and stabilized in its own branch before integration into the main branch. This approach ensured code stability, facilitated peer review, and provided clear checkpoints in the development timeline.

### Development Branches (Chronological Order)

#### `dynamic-graph-editor`

**Overview:** The foundational branch establishing interactive graph editing capabilities.

**Problem Solved:** Provided a mechanism to create and manipulate road networks as a collection of connected nodes and edges.

**Key Features:**
- Click to create nodes (points) in the canvas
- Click on a node, then click another node to create edges (segments)
- Right-click on nodes to delete them
- Real-time graph visualization

**Foundation:** This branch established the core spatial data structure and interaction model, forming the basis for all subsequent development.

---

#### `feature/dynamic-viewport`

**Overview:** Enhanced user experience by adding zoom and pan capabilities.

**Problem Solved:** As road networks grow larger, users need the ability to zoom in for detail work and zoom out for overview. A fixed-canvas view becomes impractical.

**Key Features:**
- Mouse wheel zoom (in and out)
- Pan/drag to move the viewport
- Viewport maintains coordinate transformation between canvas and world space
- Efficient rendering: only visible elements are drawn

**Architecture:** Introduced the `ViewPort` class to handle coordinate transformations and maintain zoom/offset state independently from the graph data.

---

#### `feature/generating-roads`

**Overview:** Transforms abstract graph segments into realistic, drivable road surfaces.

**Problem Solved:** Graph segments are line primitives; vehicles require surfaces with width and lanes.

**Key Features:**
- Uses geometric **envelopes** (polygon generation) to create road surfaces
- Converts each segment into a polygon with configurable width
- Handles segment intersections and T-junctions
- Generates road borders automatically
- Provides collision surfaces for vehicle physics

**Technical Details:** The `Envelope` class wraps a segment and generates a polygon by offsetting perpendicular to the segment direction. Multiple envelopes form the complete road network.

---

#### `structure/building-n-trees`

**Overview:** Adds procedurally generated static scenery to enrich the virtual world.

**Problem Solved:** A bare road network lacks visual richness and realism. Buildings and vegetation provide context and challenge for autonomous navigation.

**Key Features:**
- **Pseudo-3D rendering:** Objects farther from the viewport center (higher on screen) are rendered in front
- **Buildings:** Rectangular structures placed strategically near roads
- **Trees:** Circular vegetation scattered throughout the world
- **Procedural generation:** World class generates these based on road layout

**Rendering:** Uses viewport offset to compute visual depth, creating the illusion of a top-down 3D view.

---

#### `structure/road-markings`

**Overview:** Introduces interactive marking editors for road infrastructure and traffic control.

**Problem Solved:** Roads need lane markings, parking areas, traffic signals, and other regulatory markings for vehicles to navigate intelligently.

**Key Marking Types:**
- **Parking (`Parking`):** Designated parking areas with visual representation
- **Traffic Lights (`Light`):** Signal points for traffic control logic
- **Zebra Crossings (`Zebra`):** Pedestrian crossing indicators
- **Stop Lines (`Stop`):** Regulatory stop markers
- **Yield Signs (`Yield`):** Yield/give-way markers
- **Start Points (`Start`):** Vehicle spawn locations
- **Target Points (`Target`):** Navigation goals for vehicles

**Editor System:** Each marking type has a dedicated editor (`ParkingEditor`, `LightEditor`, etc.) enabling intuitive creation and modification through the UI.

**Data Model:** Markings are serializable and stored as part of the world state.

---

#### `structure/world-persistence`

**Overview:** Introduces comprehensive world serialization and deserialization.

**Problem Solved:** Previously, only the graph was persisted; markings were lost, and trees regenerated randomly each session. This broke reproducibility and workflow continuity.

**Key Features:**
- **World.save():** Serializes entire world state (graph, markings, buildings, trees) to JSON
- **World.load():** Deserializes JSON back into a complete world instance
- **Browser Storage:** Worlds are saved to `localStorage` for quick access
- **File Export/Import:** Users can export worlds as `.world` files and reload them later

**Architecture:** World class acts as the root serializable object, containing Graph and all Marking instances. Each class implements static `load()` methods for reconstruction.

**Impact:** Enables reproducible experiments, sharing of world layouts, and continuity across browser sessions.

---

#### `feature/self-driving-cars`

**Overview:** Integrates neural-network-driven autonomous vehicles into the persistent world.

**Problem Solved:** The static world infrastructure needed intelligent agents capable of learning to navigate, avoid obstacles, and reach goals.

**Key Components:**
- **Sensor System:** Vehicles emit rays to detect road borders, obstacles, and traffic
- **Neural Network:** A feedforward network processes sensor inputs and outputs steering/acceleration commands
- **Genetic Algorithm:** Networks are evolved through selection and mutation
- **Collision Detection:** Ray casting detects obstacles and road boundaries
- **Learning:** Best-performing cars are cloned and slightly mutated to evolve better behavior

**Integration:** Cars operate within the world, respecting road boundaries and reacting to markings and obstacles. The system trains multiple cars simultaneously, selecting survivors based on fitness metrics (distance traveled, obstacles avoided, etc.).

---

#### `feature/open-street-map`

**Overview:** Enables importing real-world road networks from OpenStreetMap data.

**Problem Solved:** Manually creating large, complex road networks is tedious. Real-world maps provide rich, realistic environments for testing.

**Key Features:**
- **OSM Parser:** Converts OpenStreetMap JSON exports into graph nodes and segments
- **Coordinate Mapping:** Translates latitude/longitude to canvas coordinates
- **Batch Import:** Load entire city districts in one operation
- **Hybrid Workflow:** Imported maps can be further edited with the graph editor

**Use Case:** Users can load a real neighborhood, let self-driving cars learn to navigate it, and replay their performance on the authentic street layout.

---

#### `main`

**Overview:** The stable, production-ready branch containing all integrated features.

**Contents:** All commits from feature branches merged, tested, and validated.

**Usage:** Recommended for running the complete application or as the base for new features.

---

### How to Follow the Project History

To understand how the project evolved and explore each developmental stage:

1. **List all branches:**
	 ```bash
	 git branch -a
	 ```

2. **Checkout a specific branch to explore:**
	 ```bash
	 git checkout dynamic-graph-editor
	 ```

3. **Compare changes between branches:**
	 ```bash
	 git diff main..feature/self-driving-cars
	 ```

4. **View commit history for a branch:**
	 ```bash
	 git log --oneline feature/dynamic-viewport
	 ```

5. **Create a local branch tracking a remote feature:**
	 ```bash
	 git checkout --track origin/feature/open-street-map
	 ```

Each branch is a complete, working snapshot of the project at a specific development stage, making it easy to understand how features build upon each other.

---

## Project Structure & Folder Organization

The repository is organized into logical modules, each with clearly defined responsibilities:

### Root Level

- **`index.html`** – Main entry point for the self-driving car simulation
- **`main.js`** – Application initialization, car generation, training loop, and render loop
- **`car.js`** – Car class: physics, collision detection, sensor integration
- **`sensor.js`** – Ray-casting sensor system for environment perception
- **`controls.js`** – Input handling for manual/AI control modes
- **`network.js`** – Neural network implementation
- **`visualizer.js`** – Visualization of neural network outputs and decisions
- **`utils.js`** – Geometry and math utilities (lerp, intersection, polygon tests, color utilities)
- **`style.css`** – Styling for the main simulation UI

### `virtualWorld/` Directory

Contains the editor and world infrastructure:

#### `virtualWorld/index.html`
- World editor entry point
- Canvas for interactive editing
- Control buttons for different editor modes
- File save/load interface

#### `virtualWorld/js/world.js`
- **World class:** Root container for graph, markings, buildings, and trees
- Manages world serialization (`load()`, `save()`)
- Orchestrates procedural generation of world infrastructure
- Handles collision detection with world objects

#### `virtualWorld/js/viewport.js`
- **ViewPort class:** Handles canvas coordinate transformation
- Manages zoom and pan state
- Converts mouse events to world coordinates
- Ensures efficient rendering of only visible content

#### `virtualWorld/js/editors/`

Contains all interactive editing tools:

- **`graphEditor.js`** – Create and edit road networks (nodes/edges)
- **`markingEditor.js`** – Base class for marking editors
- **`parkingEditor.js`** – Parking area placement and editing
- **`lightEditor.js`** – Traffic light placement
- **`zebraEditor.js`** – Zebra crossing creation
- **`stopEditor.js`** – Stop line marking
- **`yieldEditor.js`** – Yield sign placement
- **`startEditor.js`** – Vehicle spawn point creation
- **`targetEditor.js`** – Navigation goal placement

Each editor inherits from a base class and implements tool-specific interaction logic.

#### `virtualWorld/js/markings/`

Road infrastructure classes:

- **`marking.js`** – Abstract base class for all markings
- **`parking.js`, `light.js`, `zebra.js`, `stop.js`, `yield.js`, `start.js`, `target.js`** – Concrete marking implementations
- Each marking is serializable and positioned with a center point and direction vector

#### `virtualWorld/js/items/`

Static world objects:

- **`building.js`** – Building class with visual representation
- **`tree.js`** – Tree class with pseudo-3D rendering

#### `virtualWorld/js/math/`

Core geometric and utility functions:

- **`graph.js`** – Graph class managing nodes (points) and edges (segments), with topology operations
- **`utils.js`** – Geometric utilities (angle calculation, scaling, point helpers)
- **`osm.js`** – OpenStreetMap data parser and converter

#### `virtualWorld/js/primitives/`

Fundamental geometric primitives:

- **`point.js`** – 2D point with draw methods
- **`segment.js`** – Line segment between two points
- **`polygon.js`** – Closed polygon with filled/stroked rendering
- **`envelope.js`** – Polygon envelope around a segment (generates road surfaces)

#### `virtualWorld/saves/`

- Stores serialized world files (`.world` format)
- Example: `big.world` – A comprehensive pre-built world

### Module Interaction Pipeline

```
User Input (Mouse/Keyboard)
		↓
Editor (GraphEditor, MarkingEditor, etc.)
		↓
World (Graph + Markings + Buildings + Trees)
		↓
ViewPort (Coordinate Transform)
		↓
Rendering (Canvas Draw calls)

For Self-Driving Simulation:
		↓
Car Sensors (Ray casting)
		↓
Neural Network (Decision making)
		↓
Car Physics (Movement, collision)
		↓
World Collision Checks
		↓
Rendering + Training
```

---

## Neural Network–Based Self-Driving Cars: Technical Deep Dive

### Overview

Self-driving cars in this simulation use neural networks to learn autonomous navigation. Rather than hand-coding behaviors, the network learns through evolutionary algorithms to avoid obstacles, follow lanes, and reach goals.

### Neural Network Architecture

#### Input Layer

The network receives sensor data as input:

- **5 Ray-based Sensors:** Each ray casts forward, angled left, straight, angled right, and backward
- **Per-Ray Information:**
	- **Offset:** Distance to nearest obstacle (normalized, 0 = collision, 1 = far)
	- Each ray provides 1 input
- **Total Input Nodes:** 5 (one per sensor ray)

#### Hidden Layers

- **Layer 1:** Configurable number of hidden neurons (e.g., 8-16)
	- Learns intermediate feature representations
	- Example: "obstacle on left," "clear ahead," "crossroad detected"
- **Layer 2 (Optional):** Additional hidden layer for complex reasoning
	- Enables learning of higher-order behaviors
	- Example: "approaching intersection, prepare to yield"

#### Output Layer

- **4 Output Neurons:**
	1. **Forward:** Positive activation increases acceleration
	2. **Left:** Positive activation steers left
	3. **Right:** Positive activation steers right
	4. **Reverse:** Positive activation applies brakes/reverses

#### Activation Functions

- **Hidden Layers:** ReLU or Sigmoid (typically ReLU for faster convergence)
- **Output Layer:** No activation (raw network output), rescaled to control ranges

### Sensor System: Ray Casting

#### How Sensors Work

Each car emits 5 rays from its center in different directions:

```
				 ↑ (backward)
			 / | \
			/  |  \
		 /   |   \
		← — Car — → 
		 \   |   /
			\  |  /
			 \ | /
				 ↓ (forward)
```

#### Ray Detection Algorithm

For each ray, the sensor:

1. **Calculates ray trajectory:** Line segment from car center extending outward
2. **Tests against road borders:** Uses line-segment intersection detection
3. **Tests against traffic:** Checks collision with other cars
4. **Returns nearest hit:** If a ray hits an obstacle, returns the distance
5. **Normalizes distance:** Distance is divided by ray length (0 = collision, 1 = nothing detected)

#### Pseudo-Code

```javascript
getRayReading(ray, roadBorders, traffic) {
	let touches = [];
  
	// Check road borders
	for (let border of roadBorders) {
		const hit = rayIntersectsSegment(ray, border);
		if (hit) touches.push(hit);
	}
  
	// Check other cars
	for (let car of traffic) {
		const hit = rayIntersectsPolygon(ray, car.polygon);
		if (hit) touches.push(hit);
	}
  
	// Return closest obstacle distance (0 = collision, 1 = far)
	if (touches.length === 0) return null;
	const closest = touches.sort((a, b) => a.offset - b.offset)[0];
	return 1 - closest.offset;
}
```

### Environment Perception: What Cars "See"

#### Road Boundaries

- Cars detect the edges (left and right borders) of the road
- Collision with borders damages the car (sensor reading approaches 0)
- Encourages the network to learn lane-keeping behavior

#### Obstacles and Traffic

- Other cars are represented as polygons
- Ray casting detects collisions with other vehicles
- Rewards the network for avoiding crashes (fitness penalty)

#### Lane Markings (Future Enhancement)

- Parking areas can be detected via dedicated logic
- Traffic lights can signal go/no-go states
- Zebra crossings indicate pedestrian zones
- Current implementation: cars learn basic obstacle avoidance; marking-specific logic can be added

#### Building and Static Obstacles

- Buildings and trees are represented as polygons
- Ray casting detects these obstacles
- Network learns to navigate around them

### Decision Making: Network Output to Control

#### Raw Network Outputs

The 4 output neurons produce floating-point values (typically -1 to 1 after tanh activation or unbounded after ReLU).

#### Control Mapping

```javascript
const forward = networkOutputs[0];   // [-1, 1]
const left    = networkOutputs[1];   // [-1, 1]
const right   = networkOutputs[2];   // [-1, 1]
const reverse = networkOutputs[3];   // [-1, 1]

// Steering: right activation cancels left
steering = right - left;             // [-1, 1]

// Acceleration: forward and reverse compete
if (forward > reverse) {
	acceleration = forward;             // [0, 1]
} else {
	acceleration = -reverse;            // [-1, 0] (braking/reversing)
}

car.controls.forward = acceleration > 0;
car.controls.left = steering < 0;
car.controls.right = steering > 0;
```

### Physics and Movement

Once the network decides actions, the car applies physics:

#### Acceleration

```javascript
if (controls.forward) {
	speed += acceleration * 0.2;
}
speed = Math.min(speed, maxSpeed);
```

#### Steering

```javascript
if (controls.left) {
	angle -= 0.04;
}
if (controls.right) {
	angle += 0.04;
}
```

#### Movement and Friction

```javascript
x += Math.cos(angle) * speed;
y += Math.sin(angle) * speed;
speed *= 0.95; // Friction
```

### Collision Detection

#### Approach

After each movement, the car checks for damage:

```javascript
assessDamage(roadBorders, traffic) {
	const carPolygon = this.createPolygon();
  
	// Check road border collisions
	for (let border of roadBorders) {
		if (polygonIntersectsSegment(carPolygon, border)) {
			this.damaged = true;
			return;
		}
	}
  
	// Check traffic collisions
	for (let car of traffic) {
		if (polygonsIntersect(carPolygon, car.createPolygon())) {
			this.damaged = true;
			return;
		}
	}
}
```

#### Fitness Impact

- If a car collides, `this.damaged = true`
- Damaged cars stop simulating (no further movement)
- They remain in the simulation but don't contribute to evolution
- This incentivizes the network to avoid collisions

### Training: Evolutionary Algorithm

#### Population-Based Learning

1. **Initialization:** Create N cars (e.g., 100) with random neural networks
2. **Simulation:** Run all cars simultaneously for a fixed duration
3. **Fitness Evaluation:** Compute a fitness score based on:
	 - **Distance traveled:** Reward for progress
	 - **Collision avoidance:** Penalty for damage
	 - **Survival:** Reward for lasting longer without crashing
4. **Selection:** Identify the best-performing car(s)
5. **Reproduction:** Clone the best car and introduce mutations
6. **Mutation:** Randomly perturb network weights and biases
7. **Next Generation:** Replace worst performers with mutants, repeat

#### Pseudo-Code

```javascript
function evolve() {
	// Find best car
	let bestCar = cars.reduce((best, car) => 
		car.fitness > best.fitness ? car : best
	);
  
	// Clone and mutate
	const newCars = [];
	for (let i = 0; i < N; i++) {
		const child = Car.clone(bestCar);
		child.brain = NeuralNetwork.mutate(child.brain);
		newCars.push(child);
	}
  
	return newCars;
}
```

#### Network Mutation

- **Weight mutation:** Each weight has a small chance (e.g., 10%) to be randomly perturbed
- **Perturbation amount:** Typically a small Gaussian noise
- **Bias mutation:** Similar to weights
- **Result:** Gradual exploration of the network weight space

#### Learning Over Time

- **Early generations:** Random behavior, high collision rate
- **Mid generations:** Some cars learn to avoid obstacles, stay on road
- **Late generations:** Sophisticated navigation, optimal lane-keeping, efficient pathfinding
- **Plateau:** As generations increase, improvement slows (approaching local optima)

### Integration with Markings and Static World

#### Current Capabilities

- **Road following:** Network learns lane-keeping through road border detection
- **Obstacle avoidance:** Learns to avoid cars, buildings, trees via ray casting
- **Long-term navigation:** Over many generations, learns efficient pathfinding strategies

#### Future Enhancements

- **Traffic light awareness:** Dedicate a sensor to light state (red/green); train network to respect signals
- **Parking logic:** Detect parking markings; train to approach and park within zones
- **Zebra crossing behavior:** Detect crossings; slow down and yield
- **Multi-agent coordination:** Allow trained cars to interact (platooning, overtaking)

---

## Overall Design Philosophy

### Modular Architecture

This project is built on the principle of **modular separation of concerns**:

- **Editors** are independent of the world representation
- **World objects** (buildings, trees, markings) follow a common interface
- **Neural networks** are decoupled from cars; networks can be trained offline and plugged in
- **Rendering** is purely a view layer, independent of simulation logic

**Benefit:** Each module can be developed, tested, and evolved independently. A change to the neural network doesn't require touching the graph editor.

### Incremental Development with Feature Branches

Each major feature was developed in isolation:

- **Stability:** Main branch always works; new features are tested on branches
- **Clarity:** Each branch tells a story: "here's what was added and why"
- **Reproducibility:** Checking out a historical branch shows the project at any point in time
- **Collaboration:** Branches enable parallel work without merge conflicts

**Lesson:** Breaking a large project into logical milestones makes it manageable and maintainable.

### Editor-Driven Development

Rather than hand-coding world layouts, an interactive editor was developed first. This:

- **Empowers users:** Non-programmers can design worlds
- **Enables experimentation:** Quick iteration on road layouts, building positions, marking placements
- **Separates data from code:** Worlds are data (JSON); code implements logic

### Simulation Pipeline Design

The system follows a clear flow:

1. **Input** (user or AI agent)
2. **Update** (physics, sensors, decisions)
3. **Collision Detection** (world interaction)
4. **Output** (render, save state)

This pipeline is replicated at multiple levels (car, world, camera), making the system predictable and extensible.

---

## Future Directions

### Enhanced Physics

- **Realistic acceleration/deceleration:** Currently linear; could use more complex models
- **Tire grip and slipping:** Add friction coefficients, surface types
- **Suspension and weight transfer:** For more challenging driving behavior

### Smarter AI

- **Attention mechanisms:** Let networks focus on relevant sensor rays
- **Recurrent networks (LSTM):** Enable short-term memory for temporal reasoning
- **Imitation learning:** Train on human demonstrations rather than pure evolution
- **Reinforcement learning:** Integrate reward-based learning alongside evolution

### Traffic and Interaction

- **Traffic rule enforcement:** Respect traffic lights, stop signs, zebra crossings
- **Multi-agent coordination:** Cars learn to communicate and cooperate
- **Pedestrians:** Add static or dynamic pedestrians for realistic urban environments

### Visualization and Analysis

- **Attention heatmaps:** Visualize which sensors the network is focusing on
- **Decision tree explainability:** Understand why cars make specific choices
- **Performance analytics:** Track fitness metrics over generations

### Tools and Editor Enhancements

- **World templates:** Pre-built scenarios (highway, city, parking lot)
- **Simulation playback:** Record and replay best-performing car runs
- **Performance profiling:** Optimize rendering and physics for large worlds
- **Multiplayer/web sharing:** Share world designs with others, collaborate

---

