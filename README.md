# Dynamic Graph Editor

A browser-based, interactive graph construction and visualization tool built with modern web technologies.  
The **Dynamic Graph Editor** allows users to create, edit, and manipulate graph structures (nodes and edges) directly on a canvas with real-time visual feedback and intuitive mouse-driven controls.

---

## 📌 Overview

![Dynamic Graph Editor Demo](assets/dynamic-graph-editor.gif)

The Dynamic Graph Editor is designed for users who need to **visually construct and experiment with graph structures** without writing code. It serves as a foundational tool for learning, prototyping, and extending graph-based systems.

This editor is particularly useful for:
- Educational demonstrations of graph theory concepts
- Rapid prototyping of graph-based algorithms
- Serving as a base layer for advanced systems such as:
  - Pathfinding
  - Network analysis
  - Virtual world simulations

### Key Problems Solved
- Eliminates the need for code-driven graph creation
- Provides immediate, real-time visual feedback
- Simplifies understanding of spatial relationships in 2D graphs

---

## ✨ Features

### Node (Point) Management
- **Create Nodes:**  
  Add points to the canvas using simple mouse interactions.
- **Delete Nodes:**  
  Remove nodes via right-click, automatically cleaning up connected edges.
- **Drag Nodes:**  
  Move nodes freely while maintaining graph consistency.

### Edge (Segment) Management
- **Create Edges:**  
  Connect two nodes by selecting them sequentially.
- **Dynamic Edge Updates:**  
  Connected edges update automatically when nodes are moved.

### Interaction & Visual Feedback
- **Hover Detection:**  
  Highlights the nearest node to the cursor.
- **Selection Feedback:**  
  Clear visual cues for selected and active nodes.
- **Real-Time Rendering:**  
  All graph updates are reflected instantly on the canvas.

> **Note:**  
> Advanced capabilities such as weighted edges, labels, persistence, or algorithmic analysis are intentionally not included in the current implementation.

---

## 🛠 Tech Stack

### Core Technologies
- **HTML5** – Application structure
- **CSS3** – Styling and layout
- **JavaScript (ES6+)** – Core logic and interactions

### Rendering
- **HTML5 Canvas API** – High-performance 2D rendering

### Frameworks & Libraries
- **None** (Vanilla JavaScript)

### Why Vanilla JavaScript?
- Maximum portability
- Zero external dependencies
- Clear learning value
- Fine-grained control over rendering and interaction logic

---

