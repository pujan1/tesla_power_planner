import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import { createParkingTexture } from '../utils/canvas-texture.utils';

interface ParkingMarkerProps {
  /** Horizontal offset in feet from the parking group origin. */
  offset: number;
}

/**
 * 3D parking bay marker for the engineer parking area.
 *
 * Renders:
 * - A translucent rectangular bay surface
 * - A solid white border frame
 * - A circular "P" symbol texture on the ground
 *
 * @param props.offset - Horizontal offset in feet for this bay's position.
 * @returns A Three.js fragment containing the parking bay elements.
 */
export const ParkingMarker = ({ offset }: ParkingMarkerProps) => {
  /** Cached parking "P" texture — only created once per component instance. */
  const pTexture = useMemo(() => createParkingTexture(), []);

  return (
    <>
      {/* Rectangular Bay Surface (Spot) */}
      <mesh position={[offset, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 30]} />
        <meshBasicMaterial color="white" opacity={0.05} transparent />
      </mesh>

      {/* Bay Border (Solid Industrial Frame) */}
      <Line
        points={[[-8, 0, -15], [8, 0, -15], [8, 0, 15], [-8, 0, 15], [-8, 0, -15]]}
        color="white"
        lineWidth={3}
        position={[offset, 0, 0]}
        opacity={1.0}
        transparent={false}
      />

      {/* Parking 'P' Symbol */}
      <mesh position={[offset, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshBasicMaterial transparent map={pTexture} />
      </mesh>
    </>
  );
};
