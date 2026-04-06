/**
 * @module scene.constants
 * Constants for the 3D scene rendering (SiteCanvas3D).
 */

/** Theme-specific color palettes for the 3D scene. */
export const THEME_COLORS = {
  dark: {
    bg: '#080808',
    gravel: '#121212',
    concrete: '#222222',
    road: '#050505',
  },
  light: {
    bg: '#f0f0f0',
    gravel: '#b8b8b8',
    concrete: '#d0d0d0',
    road: '#333333',
  },
} as const;

/** Default camera configuration for OrbitControls + PerspectiveCamera. */
export const CAMERA_DEFAULTS = {
  fov: 45,
  minDistance: 20,
  maxDistance: 1200,
  dampingFactor: 0.05,
  maxPolarAngle: Math.PI / 2.1,
} as const;

/** Lighting intensity values per theme. */
export const LIGHTING_DEFAULTS = {
  dark: {
    ambient: 0.3,
    directional: 1.5,
    pointColor: '#3e94ff',
    pointIntensity: 2,
  },
  light: {
    ambient: 0.8,
    directional: 2.0,
  },
} as const;

/** Offsets (in feet) for the engineer parking bays. */
export const PARKING_OFFSETS = [0, 20, 40] as const;

/** Road geometry constants. */
export const ROAD_CONSTANTS = {
  width: 40,
  laneMarkingSpacing: 10,
  laneMarkingWidth: 5,
  laneMarkingHeight: 0.8,
} as const;

/** Shadow map resolution for the directional light. */
export const SHADOW_MAP_SIZE: [number, number] = [4096, 4096];

/** ContactShadows configuration. */
export const CONTACT_SHADOW_DEFAULTS = {
  resolution: 1024,
  scale: 200,
  blur: 2.5,
  far: 20,
  color: '#000000',
} as const;
