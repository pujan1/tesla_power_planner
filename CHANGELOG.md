# Changelog

All notable changes to the Tesla Full-Stack Ecosystem will be documented in this file.

All format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.0] - 2026-04-06 - Interactive 2D Layout Editor & Safety Controls

### Added
- **Manual Layout Engine**: Engineered a state-driven 2D manipulation system allowing granular, high-precision placement of Megapacks and Transformers.
- **Drag-to-Delete Trash Bin**: Implemented a red-pulsing glassmorphic deletion zone with persistent discovery opacity (40% idle, 100% active).
- **Stationary Device Palette**: Designed a floating, viewport-anchored device selector that remains fixed regardless of canvas zoom or scroll depth.
- **Safety Toast Notifications**: Replaced legacy browser `alert()` calls with high-visibility, localized Error Toasts for intersection and boundary validation.
- **Manual Mode Warning**: Integrated a 7-second localized safety toast (EN/ES/FR) advising users when standard 100ft layout limits are suspended.

### Changed
- **Synchronized View Locking**: Migrated manual edit state to `SitePlannerContext`, enabling a global UI lock that disables the 2D/3D toggle during active editing.
- **Viewport Decoupling**: Refactored `SiteCanvas` with a dedicated `viewportWrapper` to isolate floating UI controls from the scrollable workspace flow.
- **Persistence Suspension**: Automatically gated the auto-save sequence during active manual edit sessions to prevent intermediate data corruption.

### Fixed
- **Canvas Layout Regressions**: Resolved a styling conflict where absolutely positioned controls were shifting the workspace flex-flow out of the viewable area.
- **Test Provider Coverage**: Updated 26 unit and integration tests to wrap and support the new global context provider architecture.

## [1.4.0] - 2026-04-06 - Thin Components, Thick Helpers & Global Documentation


### Added
- **Domain-Driven Helpers**: Extracted pure business logic into dedicated helper modules (`packing.helpers.ts`, `site-planner.helpers.ts`, `scene.helpers.ts`).
- **Canvas Texture Utilities**: Centralized 3D texture generation into `canvas-texture.utils.ts` to eliminate redundancy in `BatteryMesh` and `ParkingMarker`.
- **Reusable Auth Hook**: Unified session hydration, login/logout state, and error handling into a custom `useAuth.ts` hook.
- **Click-Outside Detection**: Implemented a global `useClickOutside.ts` hook for industrial UI interactions.
- **Configuration Registry**: Organized magic strings and numbers into domain-specific constant files (`app.constants.ts`, `site-planner.constants.ts`, `scene.constants.ts`, `canvas.constants.ts`).
- **Comprehensive JSDoc Documentation**: Applied full industrial-grade JSDoc to every function and component across the entire frontend (26+ files).

### Changed
- **Architectural Refactor**: Transitioned from monolithic components to a "Thin Component, Thick Helper" pattern, drastically reducing complexity in `App.tsx`, `SitePlanner.tsx`, and `SiteCanvas3D.tsx`.
- **Test Optimization**: Refactored the test suite to target the new helper modules directly and fixed a pre-existing i18n key mismatch in `App.test.tsx`.

### Fixed
- **App Test Regressions**: Resolved a pre-existing test failure in `App.test.tsx` by correcting the expected welcome text and adding `waitFor` for async session checks.

## [1.3.0] - Industrial Modularity & Component Standardization

### Added
- **Centralized Hardware Schema**: Extracted all industrial constants (`DEVICE_PROPERTIES`, `DEVICE_COLORS`, `DEVICE_HEIGHTS`) into a unified `device.constants.ts` registry.
- **Dedicated Type Registry**: Consolidated all 3D interfaces and site-planner specific types into a standalone `site-planner.types.ts` module.
- **Isolated Logistical Components**: Decoupled `ParkingMarker` from the main scene graph, isolating its high-contrast texture logic into a dedicated component file.

### Changed
- **Global Functional Standard**: Refactored the entire frontend codebase to a modern functional declaration pattern: `export const Component = ({ props }) => { ... }`.
- **Architectural Cleanup**: Removed all usages of `React.FC` and `FC` across the repository to improve Type inference and maintainability.
- **Modern JSX Optimization**: Eliminated over 15 redundant `import React` calls and switched to shorthand `<>...</>` Fragments.

### Removed
- **Technical Debt**: Purged unreferenced Three.js primitives and Drei components that were no longer required after modularization.

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
