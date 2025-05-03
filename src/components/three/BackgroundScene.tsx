import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Generate random points for the background
function generatePoints(count: number) {
  const points = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    points[i3] = (Math.random() - 0.5) * 20;
    points[i3 + 1] = (Math.random() - 0.5) * 20;
    points[i3 + 2] = Math.random() * -10;
    
    // Colors (blue/purple/teal gradient)
    const mixFactor = Math.random();
    if (mixFactor < 0.33) {
      // Blue
      colors[i3] = 0.1;
      colors[i3 + 1] = 0.2;
      colors[i3 + 2] = 0.8;
    } else if (mixFactor < 0.66) {
      // Purple
      colors[i3] = 0.5;
      colors[i3 + 1] = 0.1;
      colors[i3 + 2] = 0.8;
    } else {
      // Teal
      colors[i3] = 0.1;
      colors[i3 + 1] = 0.7;
      colors[i3 + 2] = 0.8;
    }
  }
  
  return { positions: points, colors };
}

function ParticleField() {
  const points = useRef<THREE.Points>(null!);
  const { positions, colors } = generatePoints(1500);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime() * 0.1;
    
    if (points.current) {
      points.current.rotation.x = time * 0.05;
      points.current.rotation.y = time * 0.03;
    }
  });
  
  return (
    <Points ref={points} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.05}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function MovingGrid() {
  const grid = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (grid.current) {
      // Move the grid upward slowly
      grid.current.position.y = (time * 0.05) % 1;
      grid.current.material.opacity = 0.3 + Math.sin(time * 0.5) * 0.1;
    }
  });
  
  return (
    <mesh ref={grid} position={[0, 0, -5]} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[20, 20, 20, 20]} />
      <meshBasicMaterial 
        color="#4f46e5"
        wireframe
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

const BackgroundScene: React.FC = () => {
  return (
    <div className="canvas-container">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <color attach="background" args={['#0f172a']} />
        <fog attach="fog" args={['#0f172a', 5, 20]} />
        <ambientLight intensity={0.5} />
        <ParticleField />
        <MovingGrid />
      </Canvas>
    </div>
  );
};

export default BackgroundScene;