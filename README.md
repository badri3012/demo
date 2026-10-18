# Flexispace — The Future of Made-to-Order Furniture
**Interactive 3D Furniture Configurator & Dealer Commerce Platform**

> Concept demonstration provided by **BlazeByte Studio**, Coimbatore, India for **Flexispace Interiors**, Bengaluru, India.

---

## Overview

Flexispace is a manufacturing-aware interactive furniture configuration and dealer commerce platform designed to scale made-to-order furniture manufacturing and retail showrooms across India.

### Key Capabilities

1. **Flagship 3D Studio (Aura Platform Bed)**
   - Real-time Three.js WebGL visualization with PBR materials (Walnut, Oak, Dark Ash, Smoked Eucalyptus).
   - Parametric scaling between Indian Queen (1620 × 2100 mm) and King (1920 × 2100 mm).
   - Architectural vertical slats, cushioned Belgian linen upholstery, and floating horizon shelf headboards.
   - Smooth animated pull-out under-bed storage drawers with interior geometry.
   - Studio lighting presets, multi-angle camera controls, and wireframe CAD inspection mode.

2. **Deterministic Pricing Engine**
   - Real-time pricing calculations based on base dimensions, substrate materials, surface finishes, hardware modules, and logistics.
   - Accurate 18% GST calculation and itemized cost attribution.

3. **DFM (Design for Manufacturability) Feasibility Matrix**
   - Automatic detection of incompatible material combinations (e.g. High-Gloss Acrylic on natural Plywood due to grain telegraphing).
   - One-click auto-resolution to production-grade Action TESA HDHMR®.

4. **Manufacturing Specification & Exploded BOM**
   - 10 line-item cut list detailing millimeter dimensions, 2mm PUR edgebanding, and CNC machine codes (`CNC-NEST-ROUTER-01`, `EDGE-PUR-02`).
   - Flat-pack logistics kitting across 3 honeycomb corrugated cartons (~75 kg total).

5. **Dealer Commercial Economics & Showroom Mode**
   - Customer MRP vs Dealer Landing Cost spread (~30% gross profit margin).
   - Interactive margin tier simulation slider (Silver 20%, Gold 30%, Flagship 40%).
   - Clean fullscreen touch kiosk display mode for in-store showroom screens.

6. **Simulated Factory ERP Lifecycle**
   - 8-stage interactive state machine tracking orders through technical CAD/CAM validation, factory release at Peenya Unit 01, CNC nesting, QC inspection, and dealer dispatch.

---

## Tech Stack

- **Framework:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS v4, Lucide Icons, Canvas Confetti
- **3D Graphics:** Three.js, OrbitControls, WebGL PBR Shaders
- **Testing:** Automated Puppeteer test suite with headless WebGL audit

---

## Getting Started

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run production build
npm run build

# Preview production build
npm run preview
```

---

## Quality Assurance & Verification

- Tested across 360px, 390px, 768px, 1024px, 1440px, and 1920px viewports with zero horizontal overflow.
- 15-view automated visual and functional quality audit verified with zero console errors.

---

*Developed by BlazeByte Studio, Coimbatore, Tamil Nadu, India.*
