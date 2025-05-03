import React, { useState, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import CredentialCard from './CredentialCard';

interface Credential {
  id: string;
  title: string;
  issuer: string;
  color?: string;
}

interface CredentialsSceneProps {
  credentials: Credential[];
  onSelectCredential?: (credential: Credential) => void;
}

const Scene: React.FC<CredentialsSceneProps> = ({ credentials, onSelectCredential }) => {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const { size } = useThree();
  
  // Calculate positions in a grid or circle based on number of credentials
  const getPositions = () => {
    const positions: [number, number, number][] = [];
    const count = credentials.length;
    
    if (count <= 5) {
      // Arrange in a circle
      const radius = Math.max(1.5, count * 0.5);
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        positions.push([
          Math.sin(angle) * radius,
          Math.cos(angle) * radius * 0.3, // Flatten the circle vertically
          -1
        ]);
      }
    } else {
      // Arrange in a grid
      const cols = Math.ceil(Math.sqrt(count));
      const rows = Math.ceil(count / cols);
      const spacing = 2.2;
      
      const offsetX = ((cols - 1) * spacing) / 2;
      const offsetY = ((rows - 1) * spacing) / 2;
      
      for (let i = 0; i < count; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;
        positions.push([
          col * spacing - offsetX,
          offsetY - row * spacing,
          -1
        ]);
      }
    }
    
    return positions;
  };
  
  const positions = getPositions();
  
  const handleCardClick = (credential: Credential) => {
    setActiveCardId(credential.id);
    if (onSelectCredential) {
      onSelectCredential(credential);
    }
  };
  
  // Adjust positions for mobile
  const isMobile = size.width < 768;
  const scaleFactor = isMobile ? 0.6 : 1;
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      {credentials.map((credential, index) => {
        const position: [number, number, number] = [
          positions[index][0] * scaleFactor,
          positions[index][1] * scaleFactor,
          positions[index][2]
        ];
        
        // Calculate rotation - make cards slightly face the center
        const rotation: [number, number, number] = [
          0,
          Math.atan2(position[0], position[2]),
          0
        ];
        
        return (
          <CredentialCard
            key={credential.id}
            position={position}
            rotation={rotation}
            title={credential.title}
            issuer={credential.issuer}
            color={credential.color}
            onClick={() => handleCardClick(credential)}
            active={credential.id === activeCardId}
          />
        );
      })}
      
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.5}
        minDistance={3}
        maxDistance={10}
      />
    </>
  );
};

const CredentialsScene: React.FC<CredentialsSceneProps> = ({ credentials, onSelectCredential }) => {
  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <color attach="background" args={['#0f172a']} />
        <fog attach="fog" args={['#0f172a', 5, 15]} />
        <Scene credentials={credentials} onSelectCredential={onSelectCredential} />
      </Canvas>
    </div>
  );
};

export default CredentialsScene;