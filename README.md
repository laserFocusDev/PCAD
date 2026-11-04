# PCAD-RIG
### Parametric CAD Design Assistant for Bench Water-Filter Test Rigs

PCAD-RIG is a prototype engineering tool designed to simplify the configuration, visualization, and validation of mounting hardware for a dual-line bench water-filtration test rig.

The application provides an interactive 3D workspace where users can configure mechanical dimensions, inspect component layouts, manage design assumptions, and review basic engineering constraints before CAD generation.

---

## Overview

The test rig consists of two parallel water lines — a main line and a baseline line — mounted on a shared base board.

PCAD-RIG aims to provide a configurable design environment for the mounting hardware and supporting components required by this setup.

**Key objectives:**
- Parametric configuration of mechanical components.
- Interactive 3D visualization of the rig assembly.
- Centralized management of dimensions and design assumptions.
- Preliminary design validation and clearance checks.
- A foundation for automated CAD generation and manufacturing exports.

## Components

The planned rig configuration includes:

| Component | Quantity |
|---|---:|
| Base board | 1 |
| Cartridge housing clamps | 4 |
| Diaphragm pump mounts | 2 |
| Peristaltic pump mounts | 2 |
| Turbidity flow-cell holders | 2 |
| Pressure sensor brackets | 3 |
| Mixing chamber holder | 1 |
| Electronics enclosure | 1 |
| Float-switch holder | 1 |

## Features

### 1. Parametric Configuration
- Centralized dimension definitions.
- Editable component parameters.
- Configurable design assumptions.
- Preliminary dimensional range validation.

### 2. Interactive 3D Visualization
- Three.js-powered 3D viewport.
- Orbit and zoom controls.
- Component selection.
- Live geometry updates when parameters change.
- Mirror-symmetric dual-line layout.

### 3. Design Validation
- Parameter range checks.
- Preliminary component clearance checks.
- Assumption confirmation workflow.
- Design review before staging a revision.

### 4. Parameter Export
- Export configured parameter sets as JSON.
- Preserve design configuration for subsequent development.

---

## Technology Stack

| Technology | Purpose |
|---|---|
| React | User interface |
| TypeScript | Application logic and type safety |
| Three.js | 3D visualization |
| Vite | Development server and build tooling |
| CSS | Interface styling |

**Planned engineering integration:**

| Technology | Purpose |
|---|---|
| Fusion 360 API | Parametric CAD generation |
| Python | CAD automation and scripting |
| STL | Individual component exports |
| STEP | Complete assembly export |

---

## Getting Started

### Prerequisites

- Node.js
- npm
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/laserFocusDev/PCAD.git
```

Navigate to the project directory:

```bash
cd PCAD
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL provided by Vite, usually:

```text
http://localhost:5173
```

### Production Build

```bash
npm run build
```

---

## Project Structure

```text
PCAD/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
│
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── styles.css
    ├── params.ts
    ├── geometry.ts
    └── Viewport.tsx
```

| File | Responsibility |
|---|---|
| App.tsx | Main application interface |
| params.ts | Parameters, assumptions and validation |
| geometry.ts | Three.js geometry generation |
| Viewport.tsx | Interactive 3D viewport |
| styles.css | Application styling |
| main.tsx | Application entry point |

---

## Engineering Constraints

The intended manufacturing requirements include:

- Material: PETG
- Printing technology: FDM
- Minimum wall thickness: 3 mm
- Press-fit clearance: 0.3 mm
- Minimum load-corner fillet: 2 mm
- Maximum printer build volume: 220 × 220 × 250 mm
- Drainage features for water-exposed pockets
- Splash-resistant electronics enclosure design

All dimensions are intended to be maintained in millimetres.

## Development Roadmap

- [x] Initial React and TypeScript application.
- [x] Interactive Three.js viewport.
- [x] Editable parameter interface.
- [x] Assumption management.
- [x] Preliminary design validation.
- [x] JSON parameter export.
- [ ] Complete mechanical component geometry.
- [ ] Fusion 360 API integration.
- [ ] Named Fusion 360 user parameters.
- [ ] Automated component generation.
- [ ] Assembly interference detection.
- [ ] Individual STL export.
- [ ] Complete assembly STEP export.
- [ ] Print-time and material estimation.

## Current Status

**Prototype — Active Development**

The current implementation establishes the configuration interface and preliminary 3D visualization workflow.

The displayed geometry is simplified placeholder geometry. Detailed mounting features, manufacturing geometry, Fusion 360 integration, and actual CAD exports are not yet implemented.

Design validation currently consists of preliminary software checks and should not be treated as a verified mechanical interference analysis.

## License

To be determined.

---

*PCAD-RIG — Parametric design and visualization for practical mechanical test-rig development.*
