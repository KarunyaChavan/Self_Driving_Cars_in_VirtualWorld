# Self-Driving Cars in Virtual World

![Self-Driving Car Demo](assets/selfDrivingFreeRoam.gif)

A JavaScript-based simulation combining a graph-based virtual world editor with self-driving car AI trained through genetic algorithms and neural networks.

## Features

### Virtual World System
- **Graph-based Road Network**: Spatial graph structure using nodes and segments to represent roads and intersections
- **Procedural Generation**: Automatic generation of road borders, building envelopes, and lane guides from graph topology
- **Interactive Editors**: Multiple editor modes for placing traffic markings (stop signs, yield signs, crosswalks, parking spots, traffic lights, targets)
- **Environmental Objects**: Trees and buildings generated with configurable spacing and dimensions
- **Viewport System**: Pan and zoom controls with dynamic rendering based on viewport position

### Neural Network Architecture
- **Input Layer**: 5 ray-casting sensors measuring distances to nearest obstacles (90° spread, 150px range)
- **Hidden Layer**: 6 neurons with randomized weights initialized between [-1, 1]
- **Output Layer**: 4 binary outputs (forward, left, right, reverse)
- **Activation**: Step function with bias threshold (output = 1 if weighted sum > bias, else 0)
- **Feedforward**: Sequential layer propagation with weighted connections

### Training System
- **Population-based Learning**: Parallel simulation of 1000 cars per generation
- **Fitness Function**: Cumulative speed over time (`fitness += speed` per frame)
- **Selection**: Best performer identified by maximum fitness value
- **Mutation**: Linear interpolation (lerp) of weights and biases with 10% mutation rate toward random values [-1, 1]
- **Persistence**: JSON serialization of neural network weights/biases to localStorage

### Sensor System
- **Ray Casting**: 5 rays distributed evenly across forward-facing 90° arc
- **Intersection Detection**: Line-segment intersection algorithm detecting road borders and traffic polygons
- **Distance Measurement**: Returns offset (0 to 1) representing normalized distance to collision point
- **Visualization**: Yellow rays to detection point, black rays for remaining distance

## Technical Architecture

### Core Components

**Graph System** (`virtualWorld/js/math/graph.js`)
- Point and segment primitives with equality checking
- Duplicate prevention for points and segments
- Segment-to-point relationship queries for topology analysis

**World Generation** (`virtualWorld/js/world.js`)
- Envelope generation around road segments with configurable width and roundness
- Building placement in polygon gaps between envelopes
- Tree distribution using spatial hashing to avoid overlap
- Lane guide generation for multi-lane roads

**Neural Network** (`network.js`)
- Custom implementation with no external ML libraries
- Multi-layer perceptron with variable architecture
- Static methods for feedforward propagation and genetic mutation
- Weights stored as 2D arrays, biases as 1D arrays

**Sensor Physics** (`sensor.js`)
- Trigonometric ray calculation relative to car angle
- Collision detection against line segments (road borders) and polygons (traffic cars)
- Returns closest intersection point per ray using minimum offset

**Training Loop** (`main.js`)
- Synchronous update of all cars and traffic per frame
- Best car selection based on real-time fitness comparison
- Camera follows best-performing car
- Network visualization with animated connection weights

### Data Flow

```
Sensor Readings (5 values) → Input Layer (5 neurons)
    ↓ [weights, biases]
Hidden Layer (6 neurons)
    ↓ [weights, biases]
Output Layer (4 neurons) → Car Controls [↑, ←, →, ↓]
```

### Collision Detection

Cars use polygon-based collision checking:
- Car corners calculated from center position, dimensions, and angle
- Polygon-to-segment intersection for road borders
- Polygon-to-polygon intersection for traffic
- Damage state prevents further movement and fitness accumulation

## Setup & Usage

### World Creation
1. Open `virtualWorld/index.html`
2. Use graph editor to place road nodes and connect them
3. Switch to marking editors to add traffic elements
4. World automatically generates roads, buildings, and trees
5. Save world to localStorage

### Training
1. Open `index.html` to load saved world
2. 1000 cars spawn at first Start marking (or default position)
3. Cars train in parallel, camera follows best performer
4. Click 💾 to save best brain when performance plateaus
5. Reload page to continue training from saved brain with mutations

### Manual Testing
Set `manualMode = true` in `main.js` to control a single car with arrow keys and validate world design.