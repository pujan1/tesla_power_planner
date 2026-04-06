import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Environment, ContactShadows } from '@react-three/drei';
import { SiteDevice, DeviceType } from '@tesla/shared';
import { DEVICE_PROPERTIES } from '../hooks/useSitePlanner';
import { BatteryMesh } from './BatteryMesh';
import { useTheme } from '../../../context/ThemeContext';
import styles from '../styles/SiteCanvas.module.css';

interface SiteCanvas3DProps {
  devices: SiteDevice[];
  dimensions: { width: number; length: number };
}

// Map types to premium colors
const DEVICE_COLORS: Record<string, string> = {
  [DeviceType.MEGAPACK_XL]: '#cc0000',
  [DeviceType.MEGAPACK_2]: '#222222',
  [DeviceType.MEGAPACK]: '#333333',
  [DeviceType.POWERPACK]: '#555555',
  [DeviceType.TRANSFORMER]: '#0070f3',
};

// Map types to 3D heights
const DEVICE_HEIGHTS: Record<string, number> = {
  [DeviceType.MEGAPACK_XL]: 10,
  [DeviceType.MEGAPACK_2]: 10,
  [DeviceType.MEGAPACK]: 10,
  [DeviceType.POWERPACK]: 10,
  [DeviceType.TRANSFORMER]: 6,
};

export const SiteCanvas3D: React.FC<SiteCanvas3DProps> = ({ devices, dimensions }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Dynamic Theme Colors
  const bgColor = isDark ? '#050505' : '#f5f5f5';
  const groundColor = isDark ? '#0a0a0a' : '#eeeeee';
  const gridSectionColor = isDark ? '#333333' : '#cccccc';
  const gridCellColor = isDark ? '#111111' : '#dddddd';
  const envPreset = isDark ? 'night' : 'city';

  return (
    <div className={styles.canvasContainer} style={{ background: bgColor }}>
      <Canvas shadows gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[120, 100, 120]} fov={45} />
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2.1} 
          minDistance={20}
          maxDistance={400}
        />

        <Suspense fallback={null}>
          <ambientLight intensity={isDark ? 0.3 : 0.8} />
          <directionalLight 
            position={[50, 100, 50]} 
            intensity={isDark ? 1.2 : 1.5} 
            castShadow 
            shadow-mapSize={[2048, 2048]}
          />
          {isDark && <pointLight position={[-50, 50, -50]} intensity={1} color="#3e94ff" />}

          {/* Site Boundary Grid */}
          <Grid 
            args={[500, 500]} 
            sectionColor={gridSectionColor} 
            cellColor={gridCellColor} 
            sectionSize={10} 
            cellSize={5} 
            infiniteGrid 
          />

          {/* Construction Ground Plane (Concrete Pad) */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[dimensions.width/2, 0, dimensions.length/2]} receiveShadow>
            <planeGeometry args={[dimensions.width + 20, dimensions.length + 20]} />
            <meshStandardMaterial color={groundColor} roughness={isDark ? 0.9 : 0.4} />
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

          <ContactShadows resolution={1024} scale={200} blur={2.5} opacity={isDark ? 0.4 : 0.2} far={20} color="#000000" />
          <Environment preset={envPreset} />
        </Suspense>
      </Canvas>
    </div>
  );
};
