import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useTexture, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Credential } from '../../types';

interface ThreeSceneProps {
  credentials: Credential[];
  onSelectCredential?: (credential: Credential) => void;
}

const CredentialCard = ({ 
  credential, 
  index, 
  totalCards, 
  isSelected, 
  onSelect 
}: { 
  credential: Credential; 
  index: number; 
  totalCards: number; 
  isSelected: boolean;
  onSelect: () => void;
}) => {
  const mesh = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  
  // Calculate position in a circle
  const angle = (index / totalCards) * Math.PI * 2;
  const radius = 5;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  
  // Animate hover effect
  useFrame((state) => {
    if (!mesh.current) return;
    
    // Make the card face the camera
    mesh.current.lookAt(camera.position);
    
    // Add floating animation
    mesh.current.position.y = Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.1 + 0.5;
    
    // Selected card animation
    if (isSelected) {
      mesh.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
    } else {
      mesh.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
  });

  // Credential type color mapping
  const colorMap = {
    identity: new THREE.Color('#00f2ea'),
    education: new THREE.Color('#a659ff'),
    employment: new THREE.Color('#ff59f7'),
    certification: new THREE.Color('#4ade80'),
    membership: new THREE.Color('#fbbf24'),
    access: new THREE.Color('#ef4444'),
    achievement: new THREE.Color('#06b6d4'),
    custom: new THREE.Color('#8b5cf6'),
  };
  
  // Use the appropriate color based on credential type
  const cardColor = colorMap[credential.type as keyof typeof colorMap] || new THREE.Color('#ffffff');

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh 
        ref={mesh} 
        position={[x, 0.5, z]} 
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <boxGeometry args={[2, 3, 0.05]} />
        <meshStandardMaterial 
          color={cardColor} 
          metalness={0.8}
          roughness={0.2}
          emissive={cardColor}
          emissiveIntensity={isSelected ? 0.4 : 0.1}
          transparent
          opacity={0.9}
        />
        
        {/* Card content could be added here */}
      </mesh>
    </Float>
  );
};

const Scene = ({ credentials, onSelectCredential }: ThreeSceneProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    if (onSelectCredential) {
      onSelectCredential(credentials[index]);
    }
  };
  
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a659ff" />
      
      <PerspectiveCamera makeDefault position={[0, 1, 10]} fov={60} />
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        minDistance={5}
        maxDistance={15}
      />
      
      <Environment preset="night" />
      
      {/* Grid helper for visual reference */}
      <gridHelper args={[20, 20, '#304050', '#304050']} position={[0, -0.5, 0]} />
      
      {/* Render credential cards */}
      {credentials.map((credential, index) => (
        <CredentialCard 
          key={credential.id}
          credential={credential}
          index={index}
          totalCards={credentials.length}
          isSelected={selectedIndex === index}
          onSelect={() => handleSelect(index)}
        />
      ))}
    </>
  );
};

const ThreeScene: React.FC<ThreeSceneProps> = ({ credentials, onSelectCredential }) => {
  return (
    <div className="scene-container w-full h-[500px] md:h-[600px] rounded-xl overflow-hidden">
      <Canvas>
        <Scene credentials={credentials} onSelectCredential={onSelectCredential} />
      </Canvas>
    </div>
  );
};

export default ThreeScene;