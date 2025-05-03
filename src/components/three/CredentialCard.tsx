import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface CredentialCardProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  title: string;
  issuer: string;
  color?: string;
  onClick?: () => void;
  active?: boolean;
}

const CredentialCard: React.FC<CredentialCardProps> = ({
  position,
  rotation = [0, 0, 0],
  title,
  issuer,
  color = '#6366f1',
  onClick,
  active = false,
}) => {
  const mesh = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  
  // Hover and click handlers
  const onHover = () => setHovered(true);
  const onHoverEnd = () => setHovered(false);
  
  useFrame((state) => {
    if (mesh.current) {
      // Add floating animation
      const time = state.clock.getElapsedTime();
      mesh.current.position.y = position[1] + Math.sin(time * 0.5) * 0.05;
      
      // Rotate slightly on hover
      if (hovered || active) {
        mesh.current.rotation.y += (0.3 - mesh.current.rotation.y) * 0.1;
        mesh.current.position.z += (position[2] + 0.3 - mesh.current.position.z) * 0.1;
      } else {
        mesh.current.rotation.y += (rotation[1] - mesh.current.rotation.y) * 0.1;
        mesh.current.position.z += (position[2] - mesh.current.position.z) * 0.1;
      }
    }
  });
  
  // Convert hex color to THREE.Color
  const cardColor = new THREE.Color(color);
  const glowColor = new THREE.Color(color);
  glowColor.offsetHSL(0, 0, 0.2); // Make glow slightly brighter
  
  return (
    <group
      ref={mesh}
      position={position}
      rotation={rotation as unknown as THREE.Euler}
      onClick={onClick}
      onPointerOver={onHover}
      onPointerOut={onHoverEnd}
    >
      {/* Glow effect */}
      <pointLight
        position={[0, 0, 0.5]}
        color={glowColor}
        intensity={hovered || active ? 2 : 1}
        distance={1}
      />
      
      {/* Card body */}
      <RoundedBox
        args={[2, 1.25, 0.05]}
        radius={0.1}
        smoothness={4}
      >
        <meshStandardMaterial
          color={cardColor}
          roughness={0.3}
          metalness={0.7}
          emissive={cardColor}
          emissiveIntensity={hovered || active ? 0.5 : 0.2}
          transparent
          opacity={0.9}
        />
      </RoundedBox>
      
      {/* Card content */}
      <Text
        position={[0, 0.3, 0.03]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
        maxWidth={1.8}
      >
        {title}
      </Text>
      
      <Text
        position={[0, 0, 0.03]}
        fontSize={0.08}
        color="white"
        opacity={0.7}
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Regular.woff"
        maxWidth={1.8}
      >
        {issuer}
      </Text>
      
      {/* Holographic pattern */}
      <mesh position={[0, 0, 0.03]} rotation={[0, 0, Math.PI / 6]}>
        <planeGeometry args={[2, 1.25]} />
        <meshBasicMaterial
          transparent
          opacity={0.2}
          wireframe
          color={glowColor}
        />
      </mesh>
    </group>
  );
};

export default CredentialCard;