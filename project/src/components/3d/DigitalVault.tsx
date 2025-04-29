import React from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  useGLTF, 
  Environment, 
  Float, 
  MeshTransmissionMaterial
} from '@react-three/drei';
import { motion } from 'framer-motion';

// Fallback component when WebGL is not available
const FallbackVault = () => {
  return (
    <motion.div 
      className="w-full h-full flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="relative w-64 h-64 md:w-80 md:h-80">
        <motion.div 
          className="absolute inset-0 bg-primary-500/20 rounded-2xl backdrop-blur-xl border border-primary-500/30 shadow-glow-primary"
          animate={{ 
            scale: [1, 1.02, 1],
            borderColor: ['rgba(0, 102, 255, 0.3)', 'rgba(0, 255, 128, 0.3)', 'rgba(102, 0, 255, 0.3)', 'rgba(0, 102, 255, 0.3)']
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "linear" 
          }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
            <div className="w-20 h-20 bg-surface-heavy rounded-full flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-primary-400" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                <path d="M8 11V7l8 5v4l-8-5Z" />
              </svg>
            </div>
            <p className="text-xl font-semibold text-center">Secure Digital Vault</p>
            <p className="text-white/60 text-sm text-center mt-2">
              Your credentials are encrypted and stored securely
            </p>
          </div>
        </motion.div>
        
        {/* Floating document items */}
        {[0, 1, 2].map((i) => (
          <motion.div 
            key={i}
            className="absolute w-12 h-16 bg-white/10 backdrop-blur-sm rounded border border-white/20 flex items-center justify-center"
            initial={{ 
              x: `${-20 + i * 20}%`, 
              y: `${-40 + i * 10}%`,
              rotate: (i - 1) * 5
            }}
            animate={{ 
              y: [`${-40 + i * 10}%`, `${-35 + i * 10}%`, `${-40 + i * 10}%`],
            }}
            transition={{ 
              duration: 3, 
              delay: i * 0.5, 
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-primary-300" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
              <path d="M16 13H8" />
              <path d="M16 17H8" />
              <path d="M10 9H8" />
            </svg>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// The Vault model component
const Vault = () => {
  return (
    <group>
      {/* Outer vault container */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3, 3, 3]} />
        <MeshTransmissionMaterial
          backsideThickness={0.3}
          samples={16}
          thickness={0.5}
          roughness={0}
          transmission={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          chromaticAberration={0.05}
          anisotropy={0.1}
          distortion={0.4}
          distortionScale={0.3}
          temporalDistortion={0.3}
          color="#2563eb"
        />
      </mesh>
      
      {/* Inner vault core */}
      <mesh position={[0, 0, 0]} scale={[0.8, 0.8, 0.8]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial 
          color="#000" 
          emissive="#2563eb"
          emissiveIntensity={0.2}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      
      {/* Floating credential documents */}
      {[0, 1, 2].map((i) => (
        <Float 
          key={i}
          speed={2} 
          rotationIntensity={0.2} 
          floatIntensity={2}
          position={[(i - 1) * 0.7, 0.5, 1]}
        >
          <mesh>
            <boxGeometry args={[0.5, 0.7, 0.05]} />
            <meshStandardMaterial 
              color="#fff" 
              metalness={0.1}
              roughness={0.3}
              transparent
              opacity={0.7}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

// The main digital vault component
const DigitalVault = () => {
  // In a real application, you would want to detect WebGL support
  const supportsWebGL = true;
  
  if (!supportsWebGL) {
    return <FallbackVault />;
  }

  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <Float rotationIntensity={0.2} floatIntensity={2}>
          <Vault />
        </Float>
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
          autoRotate
          autoRotateSpeed={0.5}
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default DigitalVault;