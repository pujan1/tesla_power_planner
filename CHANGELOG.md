# Changelog

All notable changes to the Tesla Full-Stack Ecosystem will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - WebGL 3D Site Visualization & Global State

### Added
- **R3F 3D Visualization Engine**: Engineered a high-performance WebGL 3D view using `React Three Fiber` and `Three.js`, featuring volumetric battery meshes and cinematic `OrbitControls`.
- **Global View Context**: Implemented `SitePlannerContext` to synchronize the 2D/3D view state across the entire dashboard hierarchy.
- **Header Integrated Toggle**: Relocated the 2D/3D switcher into the global `DashboardLayout` header, resolving layout jumbling and centralizing controls.
- **Dynamic 3D Environments**: Built theme-aware WebGL environments that toggle between "Night" (Dark Mode) and "City" (Light Mode) with adaptive lighting and ground materials.

### Changed
- **2D Layout Refinement**: Introduced a 10ft safety gutter and centered the layout workspace for professional spatial organization.
- **Improved Sidebar Feedback**: Synchronized all configuration labels, inputs, and stat cards with the global theme using CSS variables.

### Fixed
- **3D Floating Geometry**: Corrected mesh offsets and ground plane positioning to ensure hardware sits flush on the concrete pad.
- **WebGL Font Errors**: Resolved Three.js font-loading crashes by implementing lightweight HTML overlays and optimized mesh properties.

## [1.1.0] - Authorization & Security Patch

### Added
- **Stateless JWT Sessions**: Engineered natively signed JSON Web Tokens (`jsonwebtoken`) forcing a rigid 1-hour TTL mathematically across backend generations.
- **Express Auth Middleware**: Crafted `authMiddleware.ts` algorithmically executing `401 Unauthorized` responses against missing or decayed Tokens dynamically securing arbitrary API fetching.
- **API Hydration Layer**: Configured `/auth/me` explicitly bridging User reconstructions directly out of JWT execution payloads natively.

### Fixed
- **Persistent UI Refresh Bug**: Rewrote frontend mapping safely injecting an authentication `useEffect` at the React boundary, routing cached `localStorage` tokens against the hydration endpoint to seamlessly resolve page-reload session losses.
- **Render.com Build Failures**: Resolved issue where TypeScript compilation failed on Render due to missing `@types` packages by forcing their installation during the build phase using `--include=dev`.

## [1.0.0] - Initial Enterprise Release

### Added
- **Monorepo Architecture**: Implemented NPM Workspaces linking `frontend`, `backend`, and `@tesla/shared` seamlessly.
- **Strict TypeScript End-to-End**: Elevated the entire Node/Express backend infrastructure to strictly transpiled TypeScript (`target: ES2022`).
- **Unified Typings (`@tesla/shared`)**: Created a standalone library securely distributing interfaces logically to both the React UI and the MongoDB Schema, mathematically preventing data disjoints.
- **Render.com `render.yaml` Configuration**: Designed automated infrastructure-as-code deployment pipelines for Monorepo scaling.
- **MongoDB Atlas Integration**: Injected robust MongoDB connections strictly through `mongoose` natively. Engineered graceful loading so the application skips the database if `MONGODB_URI` drops dynamically without crashing locally.
- **Repository Documentation**: Added `README.md` justifying database rationalization and established strict AI-guardrail architecture logic inside `.agent_rules.md`.

### Changed
- Replaced the frontend styling architecture entirely with Modular CSS (`.module.css`), enforcing a highly restricted vanilla footprint explicitly bypassing Tailwind dependencies.
- Refactored `src/types/user.types.ts` dynamically transitioning all React Hooks correctly toward targeting `@tesla/shared` exclusively.

### Removed
- Eliminated all fake in-memory `new Map()` structures explicitly overriding them with `User.findOne()` cloud bindings securely mapping the persistent Database logic.
