import { useRef, useMemo } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Line } from '@react-three/drei';
import { DeviceType } from '@tesla/shared';
import * as THREE from 'three';
import { BatteryMeshProps } from '../types/site-planner.types';
import { createDeviceLabelTexture } from '../utils/canvas-texture.utils';
import { PANEL_SPACING_FT } from '../constants/canvas.constants';

/**
 * Computes vertical panel division lines for the front and back faces
 * of a battery mesh, creating an industrial segmented appearance.
 *
 * @param width  - Device width in feet.
 * @param height - Device height in feet.
 * @param length - Device depth in feet.
 * @returns Array of `[start, end]` Vector3 pairs for each panel line.
 */
const computePanelDivisions = (
  width: number,
  height: number,
  length: number
): [THREE.Vector3, THREE.Vector3][] => {
  const divisions: [THREE.Vector3, THREE.Vector3][] = [];
  const numPanels = Math.floor(width / PANEL_SPACING_FT);

  if (numPanels > 1) {
    for (let i = 1; i < numPanels; i++) {
      const x = -width / 2 + (i * width) / numPanels;
      // Front face
      divisions.push([
        new THREE.Vector3(x, -height / 2, length / 2 + 0.02),
        new THREE.Vector3(x, height / 2, length / 2 + 0.02),
      ]);
      // Back face
      divisions.push([
        new THREE.Vector3(x, -height / 2, -length / 2 - 0.02),
        new THREE.Vector3(x, height / 2, -length / 2 - 0.02),
      ]);
    }
  }
  return divisions;
};

/**
 * 3D mesh component for a single battery or transformer unit.
 *
 * Renders:
 * - A rounded metallic box with emissive glow
 * - A status indicator light (green for batteries, blue for transformers)
 * - A top-face label texture showing the device name and energy rating
 * - Structural panel division lines on front/back faces
 * - Subtle edge highlighting
 * - A "breathing" hover animation for a powered-on feel
 *
 * @param props.type     - The `DeviceType` enum value.
 * @param props.position - `[x, y, z]` world position.
 * @param props.args     - `[width, height, length]` dimensions in feet.
 * @param props.color    - Hex color string for the mesh material.
 * @param props.energy   - Energy rating in MWh (displayed on label).
 * @returns A Three.js group containing the full battery mesh.
 */
export const BatteryMesh = ({ type, position, args, color, energy }: BatteryMeshProps) => {
  const { t } = useLanguage();
  const meshRef = useRef<THREE.Group>(null);
  const [width, height, length] = args;

  const panelDivisions = useMemo(
    () => computePanelDivisions(width, height, length),
    [width, height, length]
  );

  /** Top-face label texture generated from device name and energy. */
  const labelTexture = useMemo(
    () => createDeviceLabelTexture(
      t(`device.${type.toLowerCase()}`).toUpperCase(),
      `${energy} MWH`,
      width,
      length
    ),
    [type, energy, t, width, length]
  );

  /** Subtle breathing animation for a "powered on" feel. */
  useFrame((state) => {
    if (meshRef.current) {
      const elapsed = state.clock.getElapsedTime();
      meshRef.current.position.y = position[1] + (Math.sin(elapsed * 2) + 1) * 0.01;
    }
  });

  return (
    <group ref={meshRef} position={[position[0], position[1], position[2]]}>
      {/* Softened Industrial Frame */}
      <RoundedBox radius={0.15} args={args} smoothness={4} receiveShadow castShadow>
        <meshStandardMaterial 
          color={color} 
          roughness={0.2} 
          metalness={0.9}
          emissive={color}
          emissiveIntensity={0.05}
        />
      </RoundedBox>
      
      {/* Technical Status Light */}
      <mesh position={[args[0] / 2 - 0.5, args[1] / 2 - 0.2, args[2] / 2 - 0.5]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
          color={type === DeviceType.TRANSFORMER ? "#3e94ff" : "#00ff00"} 
          emissive={type === DeviceType.TRANSFORMER ? "#3e94ff" : "#00ff00"} 
          emissiveIntensity={2} 
        />
      </mesh>

      {/* High-Fidelity Localized Label */}
      <mesh position={[0, height / 2 + 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width * 0.8, length * 0.8]} />
        <meshBasicMaterial transparent map={labelTexture} />
      </mesh>

      {/* Structural Panel Lines */}
      {panelDivisions.map((points, i) => (
        <Line
          key={i}
          points={points}
          color="white"
          lineWidth={1}
          transparent
          opacity={0.3}
        />
      ))}

      {/* Edge Highlighting */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(...args)]} />
        <lineBasicMaterial color="white" opacity={0.1} transparent />
      </lineSegments>
    </group>
  );
};
