import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface Point {
  position: THREE.Vector3;
  size: number;
  color: string;
  speed: number;
}

// Default component when WebGL is not available
const FallbackParticles = () => {
  return (
    <div className="fixed inset-0 bg-dark-900 z-0">
      <div className="absolute inset-0 bg-grid opacity-10"></div>
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/5"
          style={{
            width: `${Math.random() * 5 + 2}px`,
            height: `${Math.random() * 5 + 2}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};

const ParticleCloud = () => {
  const count = 300;
  const pointsRef = useRef<THREE.Points>(null);
  const points = useRef<Point[]>([]);
  
  // Initialize points once
  if (points.current.length === 0) {
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 30;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 10;
      
      // Choose color based on position
      let color;
      if (i % 3 === 0) {
        color = '#0066ff'; // primary blue
      } else if (i % 3 === 1) {
        color = '#00ff80'; // accent green
      } else {
        color = '#6600ff'; // highlight purple
      }
      
      points.current.push({
        position: new THREE.Vector3(x, y, z),
        size: Math.random() * 0.1 + 0.05,
        color,
        speed: Math.random() * 0.02 + 0.01,
      });
    }
  }
  
  // Animation
  useFrame(({ clock }) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      const sizes = pointsRef.current.geometry.attributes.size.array as Float32Array;
      
      let i = 0;
      for (let j = 0; j < count; j++) {
        const point = points.current[j];
        const time = clock.getElapsedTime();
        
        // Gentle floating motion
        const x = point.position.x + Math.sin(time * point.speed) * 0.05;
        const y = point.position.y + Math.cos(time * point.speed * 0.5) * 0.05;
        const z = point.position.z + Math.sin(time * point.speed * 0.3) * 0.05;
        
        positions[i] = x;
        positions[i + 1] = y;
        positions[i + 2] = z;
        
        // Subtle size pulsing
        sizes[j] = point.size * (1 + Math.sin(time * point.speed * 2) * 0.2);
        
        i += 3;
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.geometry.attributes.size.needsUpdate = true;
    }
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          itemSize={3}
          array={new Float32Array(count * 3)}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          itemSize={1}
          array={new Float32Array(count)}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        vertexColors
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const ParticleBackground = () => {
  // In a real application, we would detect WebGL support
  const supportsWebGL = true;
  
  if (!supportsWebGL) {
    return <FallbackParticles />;
  }
  
  return (
    <div className="fixed inset-0 z-0 bg-dark-900">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ParticleCloud />
      </Canvas>
    </div>
  );
};

export default ParticleBackground;