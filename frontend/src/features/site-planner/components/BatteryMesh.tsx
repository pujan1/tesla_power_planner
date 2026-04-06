import React, { useRef } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import { DeviceType } from '@tesla/shared';
import * as THREE from 'three';

interface BatteryMeshProps {
  type: DeviceType;
  position: [number, number, number];
  args: [number, number, number]; // width, height, length
  color: string;
  energy: number;
}

export const BatteryMesh: React.FC<BatteryMeshProps> = ({ type, position, args, color, energy }) => {
  const { t } = useLanguage();
  const meshRef = useRef<THREE.Mesh>(null);

  // Subtle breathing animation for a "powered on" feel
  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      // Only apply the subtle "breathing" offset here.
      // The parent group handles the primary position (position[1] = height/2).
      meshRef.current.position.y = (Math.sin(t * 2) + 1) * 0.02;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <boxGeometry args={args} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.2} 
          metalness={0.9}
          emissive={color}
          emissiveIntensity={0.05}
        />
        
        {/* Technical Status Light */}
        <mesh position={[args[0] / 2 - 0.5, args[1] / 2 - 0.2, args[2] / 2 - 0.5]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial 
            color={type === DeviceType.TRANSFORMER ? "#3e94ff" : "#00ff00"} 
            emissive={type === DeviceType.TRANSFORMER ? "#3e94ff" : "#00ff00"} 
            emissiveIntensity={2} 
          />
        </mesh>

        {/* Top Face Edge Highlight */}
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(...args)]} />
          <lineBasicMaterial color="white" opacity={0.3} transparent />
        </lineSegments>
      </mesh>

      {/* Floating Labels */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Text
          position={[0, args[1] / 2 + 3, 0]}
          fontSize={1.2}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={20}
        >
          {t(`device.${type.toLowerCase()}`)}
          {`\n`}{energy} MWh
        </Text>
      </Float>
    </group>
  );
};
