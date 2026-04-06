import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Environment, ContactShadows } from '@react-three/drei';
import { SiteDevice } from '@tesla/shared';
import { BatteryMesh } from './BatteryMesh';
import { ParkingMarker } from './ParkingMarker';
import { useTheme } from '../../../context/ThemeContext';
import { DEVICE_COLORS, DEVICE_HEIGHTS, DEVICE_PROPERTIES } from '../constants/device.constants';
import { SiteCanvas3DProps } from '../types/site-planner.types';
import styles from '../styles/SiteCanvas.module.css';

export const SiteCanvas3D = ({ devices, dimensions }: SiteCanvas3DProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Dynamic Theme Colors (Industrial Contrast Tuning)
  const bgColor = isDark ? '#080808' : '#f0f0f0';
  const gravelColor = isDark ? '#121212' : '#b8b8b8'; 
  const concreteColor = isDark ? '#222222' : '#d0d0d0';
  const roadColor = isDark ? '#050505' : '#333333';
  const gridSectionColor = isDark ? '#444444' : '#888888'; 
  const gridCellColor = isDark ? '#262626' : '#cccccc'; 
  const gridFineColor = isDark ? '#1a1a1a' : '#eeeeee';

  // Calculate a visual center that includes the road infrastructure
  const viewTarget: [number, number, number] = [dimensions.width / 2, 0, (dimensions.length + 65) / 2];
  const envPreset = isDark ? 'night' : 'city';

  return (
    <div className={styles.canvas3DHolder} style={{ background: bgColor }}>
      <Canvas shadows gl={{ antialias: true, logarithmicDepthBuffer: true }}>
        <PerspectiveCamera 
          makeDefault 
          position={[viewTarget[0] + 120, 100, viewTarget[2] + 120]} 
          fov={45} 
        />
        <OrbitControls 
          target={viewTarget}
          enableDamping 
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2.1} 
          minDistance={20}
          maxDistance={1200}
        />

        {/* Global Lighting */}
        <ambientLight intensity={isDark ? 0.3 : 0.8} />
        <directionalLight 
          position={[100, 200, 100]} 
          intensity={isDark ? 1.5 : 2.0} 
          castShadow 
          shadow-mapSize={[4096, 4096]}
        />
        {isDark && <pointLight position={[0, 100, 0]} intensity={2} color="#3e94ff" />}

        {/* Triple-Tier Technical Grid */}
        <Grid 
          args={[4000, 4000]} 
          sectionColor={gridSectionColor} 
          cellColor={gridCellColor} 
          sectionSize={100} 
          cellSize={10} 
          infiniteGrid 
          fadeDistance={2000}
        />
        <Grid 
          args={[dimensions.width + 200, dimensions.length + 300]} 
          sectionColor={gridSectionColor} 
          cellColor={gridFineColor} 
          sectionSize={10} 
          cellSize={2} 
          position={[dimensions.width / 2, 0.005, (dimensions.length + 100) / 2]} 
          infiniteGrid={false}
        />

        {/* Site Foundation: Gravel Base */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[dimensions.width / 2, -0.05, (dimensions.length + 100) / 2]} receiveShadow>
          <planeGeometry args={[dimensions.width + 200, dimensions.length + 300]} />
          <meshStandardMaterial color={gravelColor} roughness={1} />
        </mesh>

        {/* Access Road (Asphalt Strip) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[dimensions.width / 2, 0.1, dimensions.length + 65]} receiveShadow>
          <planeGeometry args={[dimensions.width + 200, 40]} />
          <meshStandardMaterial 
            color={roadColor} 
            roughness={0.7} 
            metalness={0.2} 
            polygonOffset
            polygonOffsetFactor={-1}
          />
        </mesh>

        {/* Road Lane Markings */}
        <group position={[0, 0.12, dimensions.length + 65]}>
          {Array.from({ length: Math.floor((dimensions.width + 200) / 10) }).map((_, i) => (
            <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[i * 10 - 80, 0, 0]}>
              <planeGeometry args={[5, 0.8]} />
              <meshBasicMaterial color="white" opacity={0.8} transparent />
            </mesh>
          ))}
        </group>

        {/* Engineer Parking Bays */}
        <group position={[dimensions.width / 2 - 20, 0.15, dimensions.length + 25]}>
          {[0, 20, 40].map((offset) => (
            <ParkingMarker key={offset} offset={offset} />
          ))}
        </group>

        {/* Concrete Pad Foundation */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[dimensions.width / 2, 0.01, dimensions.length / 2]} receiveShadow>
          <planeGeometry args={[dimensions.width + 10, dimensions.length + 10]} />
          <meshStandardMaterial color={concreteColor} roughness={0.5} metalness={0.1} />
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
          <ContactShadows resolution={1024} scale={200} blur={2.5} opacity={isDark ? 0.4 : 0.2} far={20} color="#000000" />
          <Environment preset={envPreset} />
        </Suspense>
      </Canvas>
    </div>
  );
};
