import React, { useRef, useMemo } from 'react';
import { SiteDevice } from '@tesla/shared';
import { ThreeEvent } from '@react-three/fiber';
import { OrthographicCamera, MapControls, Grid, Text, Line } from '@react-three/drei';
import * as THREE from 'three';

import { THEME_COLORS } from '../constants/scene.constants';
import { DEVICE_PROPERTIES, DEVICE_COLORS, DEVICE_HEIGHTS } from '../constants/device.constants';
import { checkIntersections, snapToGrid } from '../helpers/validation.helpers';
import { BatteryMesh } from './BatteryMesh';

interface SiteCanvas2DProps {
  devices: SiteDevice[];
  dimensions: { width: number; length: number };
  isManualMode?: boolean;
  draggingId: string | null;
  setDraggingId: (id: string | null) => void;
  onUpdatePosition?: (id: string, x: number, y: number) => void;
  theme: 'light' | 'dark';
}

const SCALE = 8;
const GRID_SIZE = 5;

/**
 * 2D WebGL Map Renderer.
 * Manages orthographic camera, physical dimensions mapping, 
 * and handles localized drag interception.
 */
export const SiteCanvas2D = ({
  devices,
  dimensions,
  isManualMode,
  draggingId,
  setDraggingId,
  onUpdatePosition,
  theme,
}: SiteCanvas2DProps) => {
  const invalidIds = useMemo(() => checkIntersections(devices), [devices]);
  const dragOffset = useRef({ x: 0, z: 0 });

  const handlePointerDown = (e: ThreeEvent<PointerEvent>, device: SiteDevice) => {
    if (!isManualMode) return;
    e.stopPropagation();
    
    const target = e.target as any;
    if (target && target.setPointerCapture) {
      target.setPointerCapture(e.pointerId);
    }
    
    setDraggingId(device.id);
    
    dragOffset.current = {
      x: e.point.x - device.x,
      z: e.point.z - device.y
    };
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>, device: SiteDevice) => {
    if (draggingId === device.id && onUpdatePosition) {
      e.stopPropagation();
      
      const rawX = e.point.x - dragOffset.current.x;
      const rawZ = e.point.z - dragOffset.current.z;

      onUpdatePosition(device.id, snapToGrid(rawX, GRID_SIZE), snapToGrid(rawZ, GRID_SIZE));
    }
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (!isManualMode) return;
    
    const target = e.target as any;
    if (target && target.releasePointerCapture) {
      target.releasePointerCapture(e.pointerId);
    }
    
    setDraggingId(null);
  };

  const centerX = dimensions.width / 2;
  const centerZ = dimensions.length / 2;

  const planeWidth = dimensions.width + 400;
  const planeLength = dimensions.length + 400;

  const isDark = theme === 'dark';
  const colors = THEME_COLORS[theme];

  return (
    <>
      <OrthographicCamera
        makeDefault
        position={[centerX, 100, centerZ]}
        zoom={SCALE}
        near={0.1}
        far={1000}
      />
      <MapControls 
        target={[centerX, 0, centerZ]} 
        enabled={draggingId === null}
        enableRotate={false}
        enableDamping={true}
        dampingFactor={0.05}
        minZoom={0.5}
        maxZoom={30}
      />

      <ambientLight intensity={isDark ? 3.0 : 1.5} />
      <directionalLight position={[10, 100, 10]} intensity={isDark ? 0.3 : 1} />

      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[centerX, -0.1, centerZ]}
        onPointerMove={(e) => {
          if (draggingId && onUpdatePosition) {
            const device = devices.find(d => d.id === draggingId);
            if (device) {
              const rawX = e.point.x - dragOffset.current.x;
              const rawZ = e.point.z - dragOffset.current.z;
              onUpdatePosition(device.id, snapToGrid(rawX, GRID_SIZE), snapToGrid(rawZ, GRID_SIZE));
            }
          }
        }}
        onPointerUp={() => setDraggingId(null)}
      >
        <planeGeometry args={[planeWidth, planeLength]} />
        <meshBasicMaterial visible={false} />
      </mesh>
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[centerX, -0.2, centerZ]}>
        <planeGeometry args={[planeWidth, planeLength]} />
        <meshBasicMaterial color={colors.bg} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[centerX, -0.15, (dimensions.length + 100) / 2]}>
        <planeGeometry args={[dimensions.width + 200, dimensions.length + 300]} />
        <meshBasicMaterial color={colors.gravel} />
      </mesh>

      <Grid 
        rotation={[0, 0, 0]} 
        position={[centerX, -0.05, centerZ]} 
        args={[planeWidth, planeLength]} 
        cellSize={10} 
        cellThickness={1} 
        cellColor={isDark ? '#333333' : '#d0d0d0'} 
        sectionSize={100} 
        sectionThickness={1.5} 
        sectionColor={isDark ? '#555555' : '#a0a0a0'} 
        fadeDistance={Math.max(planeWidth, planeLength) * 1.5} 
        fadeStrength={1} 
      />

      <group position={[centerX, 0.1, centerZ]}>
        <Line 
          points={[
            new THREE.Vector3(-dimensions.width / 2, 0, -dimensions.length / 2),
            new THREE.Vector3(dimensions.width / 2, 0, -dimensions.length / 2),
            new THREE.Vector3(dimensions.width / 2, 0, dimensions.length / 2),
            new THREE.Vector3(-dimensions.width / 2, 0, dimensions.length / 2),
            new THREE.Vector3(-dimensions.width / 2, 0, -dimensions.length / 2),
          ]}
          color={isDark ? '#e01e35' : '#cc0000'}
          dashed={true}
          dashSize={8}
          gapSize={4}
          dashScale={1}
          lineWidth={2}
        />
        <Text
          position={[0, 0, dimensions.length / 2 + 10]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={8}
          color={isDark ? '#aaaaaa' : '#555555'}
          anchorX="center"
          anchorY="middle"
        >
          {dimensions.width} FT WIDE
        </Text>
        <Text
          position={[dimensions.width / 2 + 10, 0, 0]}
          rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
          fontSize={8}
          color={isDark ? '#aaaaaa' : '#555555'}
          anchorX="center"
          anchorY="middle"
        >
          {dimensions.length} FT DEEP
        </Text>
      </group>

      <group>
        {devices.map((device: SiteDevice) => {
          const props = DEVICE_PROPERTIES[device.type as keyof typeof DEVICE_PROPERTIES];
          const height = DEVICE_HEIGHTS[device.type as keyof typeof DEVICE_HEIGHTS] || 10;
          const isInvalid = invalidIds.has(device.id);
          const isDragging = draggingId === device.id;
          
          let baseColor = DEVICE_COLORS[device.type as keyof typeof DEVICE_COLORS];
          if (isInvalid) baseColor = "#ff4d4f";
          else if (isDragging) baseColor = "#3e94ff";

          return (
            <group 
              key={device.id}
              position={[0, 0, 0]}
              onPointerDown={(e) => handlePointerDown(e, device)}
              onPointerMove={(e) => handlePointerMove(e, device)}
              onPointerUp={handlePointerUp}
            >
              <BatteryMesh
                type={device.type}
                position={[
                  device.x + props.width / 2,
                  height / 2,
                  device.y + props.length / 2
                ]}
                args={[props.width, height, props.length]}
                color={baseColor}
                energy={props.energy}
                isFlat={true}
              />
            </group>
          );
        })}
      </group>
    </>
  );
};
