# Road Markings System
This branch introduces a complete road markings framework, including:

![Road Markings Demo](assets/roadMarkingsDemo.gif)

- **Traffic Lights** – Intelligent traffic signal management with per-intersection control
- **Lane Guides** – Procedurally generated lane indicators along road networks
- **Stop Signs** – Manual traffic control markers
- **Parking Zones** – Designated parking areas for vehicles
- **Zebra Crossings** – Pedestrian crossing indicators
- **Start Points** – Vehicle spawn locations
- **Target Points** – Navigation destinations
- **Yield Signs** – Right-of-way indicators

### 🌍 World Generation
- Procedurally generated road networks with customizable graph-based topology
- Realistic pseudo-3D buildings and trees positioned around roads
- Envelope-based road rendering with rounded corners

### ✏️ Interactive Editing Tools
- **Graph Editor** – Create and modify road networks interactively
- **Marking Editors** – Add and position road markings in real-time
- **Viewport System** – Pan and zoom navigation for large world exploration

### 🎨 Visual Enhancements
- Perspective-based rendering for pseudo-3D depth perception
- Anti-aliasing and optimized drawing order
- Realistic traffic light state cycling

## Getting Started

### Prerequisites
- Modern web browser with HTML5 Canvas support
- No external dependencies required (vanilla JavaScript)

### Usage
1. Open `index.html` in your web browser
2. Use toolbar buttons to switch between different editing modes:
   - **🌐** – Graph (road) editor
   - **🚦** – Traffic light placement
   - **🛑** – Stop sign placement
   - **⚠️** – Yield sign placement
   - **🚶** – Zebra crossing placement
   - **🚗** – Vehicle start point placement
   - **🅿️** – Parking zone placement
   - **🎯** – Target destination placement

3. Left-click to add elements, right-click to remove
4. Use **📄** to save your world and **🗑️** to reset

## Architecture

### Core Components

**World.js**
- Main simulation engine
- Manages road envelopes, buildings, trees, and markings
- Implements traffic light state machine with per-intersection control
- Coordinates frame-by-frame updates

**Editors**
- Modular editor classes for each marking type
- Real-time placement and modification tools
- State management and user feedback

**Primitives**
- `Point` – 2D coordinate representation
- `Segment` – Line segment with geometric operations
- `Polygon` – Closed polygon with intersection and containment tests
- `Envelope` – Road segment with width and roundness

**Markings**
- `Light` – Traffic signal with state management (red, yellow, green)
- `Parking` – Parking zone polygon
- `Zebra` – Pedestrian crossing
- `Stop`, `Yield`, `Start`, `Target` – Point-based markings

## Traffic Light System

The traffic light system uses intelligent per-intersection grouping:
- Lights at the same intersection are grouped together
- One light cycles through green → yellow while others remain red
- An all-red pause ensures safe intersection transitions
- Configurable durations: green (2s), yellow (1s), all-red (2s)

## Persistence

All world data (graph, roads, markings) is saved to browser localStorage and automatically restored on page reload.

## Development

The project is organized with a clear modular structure:
- `js/` – Main application logic
- `js/editors/` – Interactive editing tools
- `js/markings/` – Road marking implementations
- `js/items/` – World objects (buildings, trees)
- `js/math/` – Geometry utilities and graph structures
- `js/primitives/` – Core geometric primitives
