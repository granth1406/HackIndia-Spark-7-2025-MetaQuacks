import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, PresentationControls, ContactShadows, Environment, Float } from '@react-three/drei';
import { ShieldCheck, CheckCircle, LockKeyhole } from 'lucide-react';
import { motion } from 'framer-motion';

// Fallback component when WebGL is not available
const FallbackCard = () => {
  return (
    <motion.div 
      className="w-full h-full glass-card p-8 flex flex-col"
      initial={{ rotateY: -30, rotateX: 15 }}
      animate={{ rotateY: 0, rotateX: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 100, 
        damping: 15,
        repeat: Infinity,
        repeatType: "mirror",
        repeatDelay: 2,
        duration: 3
      }}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
    >
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center">
          <ShieldCheck className="h-8 w-8 text-primary-500 mr-2" />
          <span className="text-xl font-display font-bold">ProofPass</span>
        </div>
        <div className="text-accent-400">
          <CheckCircle className="h-6 w-6" />
        </div>
      </div>
      
      <div className="flex-1 flex flex-col justify-center">
        <div className="border-b border-white/10 pb-4 mb-4">
          <p className="text-white/60 text-sm mb-1">CREDENTIAL HOLDER</p>
          <p className="font-semibold text-lg">Sarah Johnson</p>
        </div>
        
        <div className="border-b border-white/10 pb-4 mb-4">
          <p className="text-white/60 text-sm mb-1">CREDENTIAL TYPE</p>
          <p className="font-semibold text-lg">Certified Blockchain Developer</p>
        </div>
        
        <div>
          <p className="text-white/60 text-sm mb-1">ISSUED ON</p>
          <p className="font-semibold text-lg">May 15, 2025</p>
        </div>
      </div>
      
      <div className="mt-auto flex justify-between items-center pt-4">
        <div className="flex items-center">
          <LockKeyhole className="h-5 w-5 text-highlight-400 mr-2" />
          <span className="text-white/80 text-sm">Blockchain Verified</span>
        </div>
        <div className="text-sm font-mono text-white/40">
          0x8f72...a91e
        </div>
      </div>
    </motion.div>
  );
};

// The Card model component (simplified for the example)
const Card = ({ ...props }) => {
  const meshRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  
  // Simple animation effect
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.03;
      meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.03;
    }
  });
  
  return (
    <group {...props}>
      {/* This is a simplified credential card made with basic Three.js geometries */}
      <mesh 
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? [1.03, 1.03, 1.03] : [1, 1, 1]}
      >
        {/* Card base */}
        <boxGeometry args={[3.4, 2.1, 0.05]} />
        <meshStandardMaterial 
          color="#111111" 
          metalness={0.8}
          roughness={0.3}
          envMapIntensity={1}
        />
        
        {/* Card overlay/hologram effect */}
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[3.38, 2.08]} />
          <meshPhysicalMaterial 
            color="#2563eb"
            transmission={0.8}
            roughness={0.1}
            metalness={0.9}
            clearcoat={1}
            clearcoatRoughness={0.1}
            opacity={0.2}
            transparent
          />
        </mesh>
      </mesh>
    </group>
  );
};

// The main credential card component
const CredentialCard = () => {
  // In a real application, you would want to detect WebGL support
  const supportsWebGL = true;
  
  if (!supportsWebGL) {
    return <FallbackCard />;
  }

  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <PresentationControls
          global
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 6, Math.PI / 6]}
          azimuth={[-Math.PI / 12, Math.PI / 12]}
          config={{ mass: 2, tension: 500 }}
          snap={{ mass: 4, tension: 300 }}
        >
          <Float rotationIntensity={0.2}>
            <Card position={[0, 0, 0]} />
          </Float>
        </PresentationControls>
        <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={5} blur={2.5} />
        <Environment preset="city" />
      </Canvas>
      
      {/* Text overlay that explains what the card is */}
      <div className="absolute top-5 right-5 glass-card p-3 text-xs max-w-[200px] text-white/70 backdrop-blur-lg">
        <p>Interactive blockchain credential card - move your cursor to interact</p>
      </div>
    </div>
  );
};

export default CredentialCard;