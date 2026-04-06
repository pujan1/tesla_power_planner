import { useRef, useMemo } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Line } from '@react-three/drei';
import { DeviceType } from '@tesla/shared';
import * as THREE from 'three';
import { BatteryMeshProps } from '../types/site-planner.types';

export const BatteryMesh = ({ type, position, args, color, energy }: BatteryMeshProps) => {
  const { t } = useLanguage();
  const meshRef = useRef<THREE.Group>(null);
  const [width, height, length] = args;

  // Panel division points (industrial look)
  const panelDivisions = useMemo(() => {
    const divisions: [THREE.Vector3, THREE.Vector3][] = [];
    const numPanels = Math.floor(width / 5); // A panel every 5ft
    if (numPanels > 1) {
      for (let i = 1; i < numPanels; i++) {
        const x = -width / 2 + (i * width) / numPanels;
        // Panel line on front face
        divisions.push([
          new THREE.Vector3(x, -height / 2, length / 2 + 0.02),
          new THREE.Vector3(x, height / 2, length / 2 + 0.02)
        ]);
        // Panel line on back face
        divisions.push([
          new THREE.Vector3(x, -height / 2, -length / 2 - 0.02),
          new THREE.Vector3(x, height / 2, -length / 2 - 0.02)
        ]);
      }
    }
    return divisions;
  }, [width, height, length]);

  // Subtle breathing animation for a "powered on" feel
  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      meshRef.current.position.y = position[1] + (Math.sin(t * 2) + 1) * 0.01;
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

      {/* High-Fidelity Localized Label (Robust CanvasTexture) */}
      <mesh position={[0, height / 2 + 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width * 0.8, length * 0.8]} />
        <meshBasicMaterial 
          transparent 
          map={useMemo(() => {
            const canvas = document.createElement('canvas');
            // Maintain a fixed density: 32 pixels per foot
            const pxPerFoot = 32;
            const cvWidth = Math.max(width * 0.8 * pxPerFoot, 512); 
            const cvHeight = Math.max(length * 0.8 * pxPerFoot, 256);
            
            canvas.width = cvWidth;
            canvas.height = cvHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              // High-Contrast industrial backing
              ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
              ctx.beginPath();
              ctx.roundRect(0, 0, cvWidth, cvHeight, 20);
              ctx.fill();
              
              const label = t(`device.${type.toLowerCase()}`).toUpperCase();
              const energyLabel = `${energy} MWH`;
              
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = 'white';
              
              // Device Name (Centered)
              const baseFontSize = Math.min(cvHeight * 0.35, 64);
              ctx.font = `bold ${baseFontSize}px "Inter", sans-serif`;
              ctx.fillText(label, cvWidth / 2, cvHeight * 0.38);
              
              // Energy Value
              ctx.font = `500 ${baseFontSize * 0.75}px "Inter", sans-serif`;
              ctx.fillText(energyLabel, cvWidth / 2, cvHeight * 0.68);
            }
            const texture = new THREE.CanvasTexture(canvas);
            texture.needsUpdate = true;
            return texture;
          }, [type, energy, t, width, length])} 
        />
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
