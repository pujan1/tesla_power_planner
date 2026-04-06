import { useMemo } from 'react';
import * as THREE from 'three';
import { Line } from '@react-three/drei';

interface ParkingMarkerProps {
  offset: number;
}

export const ParkingMarker = ({ offset }: ParkingMarkerProps) => {
  const pTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // High-Contrast industrial backing (Dark Circle)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.beginPath();
      ctx.arc(128, 128, 110, 0, Math.PI * 2);
      ctx.fill();
      
      // White stroke
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 12;
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'white';
      ctx.font = 'bold 140px "Inter", sans-serif';
      ctx.fillText('P', 128, 128);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

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

      {/* Parking 'P' Symbol (High-Contrast "Pop") */}
      <mesh position={[offset, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshBasicMaterial 
          transparent 
          map={pTexture} 
        />
      </mesh>
    </>
  );
};
