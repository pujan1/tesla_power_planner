import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Environment, ContactShadows } from '@react-three/drei';
import { SiteDevice } from '@tesla/shared';
import { BatteryMesh } from './BatteryMesh';
import { ParkingMarker } from './ParkingMarker';
import { useTheme } from '../../../context/ThemeContext';
import { DEVICE_COLORS, DEVICE_HEIGHTS, DEVICE_PROPERTIES } from '../constants/device.constants';
import { SiteCanvas3DProps } from '../types/site-planner.types';
import {
  THEME_COLORS,
  CAMERA_DEFAULTS,
  LIGHTING_DEFAULTS,
  PARKING_OFFSETS,
  ROAD_CONSTANTS,
  SHADOW_MAP_SIZE,
  CONTACT_SHADOW_DEFAULTS,
} from '../constants/scene.constants';
import { computeViewTarget } from '../helpers/scene.helpers';
import styles from '../styles/SiteCanvas.module.css';

/**
 * Full 3D visualization of the energy site layout.
 *
 * Renders a Three.js scene containing:
 * - A gravel base, concrete pad, and asphalt access road
 * - Road lane markings and engineer parking bays
 * - 3D battery/transformer meshes with labels (via `BatteryMesh`)
 * - Orbit controls, environment lighting, and contact shadows
 *
 * Theme-aware: adapts colors and lighting for light/dark modes.
 *
 * @param props.devices    - Array of placed `SiteDevice` objects with positions.
 * @param props.dimensions - Bounding dimensions `{ width, length }` in feet.
 * @returns A full-screen 3D canvas element.
 */
export const SiteCanvas3D = ({ devices, dimensions }: SiteCanvas3DProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const colors = THEME_COLORS[theme];
  const lighting = isDark ? LIGHTING_DEFAULTS.dark : LIGHTING_DEFAULTS.light;
  const viewTarget = computeViewTarget(dimensions);
  const envPreset = isDark ? 'night' : 'city';

  return (
    <div 
      className={styles.canvas3DHolder} 
      style={{ background: colors.bg }}
      role="img"
      aria-label="3D Energy Site Layout Visualization"
      aria-description={`Technical visualization of the site layout. Dimensions: ${dimensions.width}ft by ${dimensions.length}ft. Contains ${devices.length} hardware units including Megapacks and Transformers.`}
    >
      <Canvas shadows gl={{ antialias: true, logarithmicDepthBuffer: true }}>
        <PerspectiveCamera 
          makeDefault 
          position={[viewTarget[0] + 120, 100, viewTarget[2] + 120]} 
          fov={CAMERA_DEFAULTS.fov} 
        />
        <OrbitControls 
          target={viewTarget}
          enableDamping 
          dampingFactor={CAMERA_DEFAULTS.dampingFactor}
          maxPolarAngle={CAMERA_DEFAULTS.maxPolarAngle} 
          minDistance={CAMERA_DEFAULTS.minDistance}
          maxDistance={CAMERA_DEFAULTS.maxDistance}
        />

        {/* Global Lighting */}
        <ambientLight intensity={lighting.ambient} />
        <directionalLight 
          position={[100, 200, 100]} 
          intensity={lighting.directional} 
          castShadow 
          shadow-mapSize={SHADOW_MAP_SIZE}
        />
        {isDark && (
          <pointLight
            position={[0, 100, 0]}
            intensity={LIGHTING_DEFAULTS.dark.pointIntensity}
            color={LIGHTING_DEFAULTS.dark.pointColor}
          />
        )}

        {/* Triple-Tier Technical Grid */}
        <Grid 
          args={[4000, 4000]} 
          sectionColor={colors.gridSection} 
          cellColor={colors.gridCell} 
          sectionSize={100} 
          cellSize={10} 
          infiniteGrid 
          fadeDistance={2000}
        />
        <Grid 
          args={[dimensions.width + 200, dimensions.length + 300]} 
          sectionColor={colors.gridSection} 
          cellColor={colors.gridFine} 
          sectionSize={10} 
          cellSize={2} 
          position={[dimensions.width / 2, 0.005, (dimensions.length + 100) / 2]} 
          infiniteGrid={false}
        />

        {/* Site Foundation: Gravel Base */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[dimensions.width / 2, -0.05, (dimensions.length + 100) / 2]} receiveShadow>
          <planeGeometry args={[dimensions.width + 200, dimensions.length + 300]} />
          <meshStandardMaterial color={colors.gravel} roughness={1} />
        </mesh>

        {/* Access Road (Asphalt Strip) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[dimensions.width / 2, 0.1, dimensions.length + 65]} receiveShadow>
          <planeGeometry args={[dimensions.width + 200, ROAD_CONSTANTS.width]} />
          <meshStandardMaterial 
            color={colors.road} 
            roughness={0.7} 
            metalness={0.2} 
            polygonOffset
            polygonOffsetFactor={-1}
          />
        </mesh>

        {/* Road Lane Markings */}
        <group position={[0, 0.12, dimensions.length + 65]}>
          {Array.from({ length: Math.floor((dimensions.width + 200) / ROAD_CONSTANTS.laneMarkingSpacing) }).map((_, i) => (
            <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[i * ROAD_CONSTANTS.laneMarkingSpacing - 80, 0, 0]}>
              <planeGeometry args={[ROAD_CONSTANTS.laneMarkingWidth, ROAD_CONSTANTS.laneMarkingHeight]} />
              <meshBasicMaterial color="white" opacity={0.8} transparent />
            </mesh>
          ))}
        </group>

        {/* Engineer Parking Bays */}
        <group position={[dimensions.width / 2 - 20, 0.15, dimensions.length + 25]}>
          {PARKING_OFFSETS.map((offset) => (
            <ParkingMarker key={offset} offset={offset} />
          ))}
        </group>

        {/* Concrete Pad Foundation */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[dimensions.width / 2, 0.01, dimensions.length / 2]} receiveShadow>
          <planeGeometry args={[dimensions.width + 10, dimensions.length + 10]} />
          <meshStandardMaterial color={colors.concrete} roughness={0.5} metalness={0.1} />
        </mesh>

        {/* Render Devices */}
        <group position={[0, 0, 0]}>
          {devices.map((device: SiteDevice) => {
            const props = DEVICE_PROPERTIES[device.type as keyof typeof DEVICE_PROPERTIES];
            const height = DEVICE_HEIGHTS[device.type as keyof typeof DEVICE_HEIGHTS] || 10;
            
            return (
              <BatteryMesh
                key={device.id}
                type={device.type}
                position={[
                  device.x + props.width / 2, 
                  height / 2, 
                  device.y + props.length / 2
                ]}
                args={[props.width, height, props.length]}
                color={DEVICE_COLORS[device.type as keyof typeof DEVICE_COLORS]}
                energy={props.energy}
              />
            );
          })}
        </group>

        <Suspense fallback={null}>
          <ContactShadows
            resolution={CONTACT_SHADOW_DEFAULTS.resolution}
            scale={CONTACT_SHADOW_DEFAULTS.scale}
            blur={CONTACT_SHADOW_DEFAULTS.blur}
            opacity={isDark ? 0.4 : 0.2}
            far={CONTACT_SHADOW_DEFAULTS.far}
            color={CONTACT_SHADOW_DEFAULTS.color}
          />
          <Environment preset={envPreset} />
        </Suspense>
      </Canvas>
    </div>
  );
};
