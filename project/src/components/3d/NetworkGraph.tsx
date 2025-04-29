import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, useGLTF, useHelper } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// Fallback component when WebGL is not available
const FallbackNetwork = () => {
  return (
    <motion.div 
      className="w-full h-full flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <motion.div 
          className="absolute w-64 h-64 rounded-full bg-primary-500/10 border border-primary-500/20"
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute w-80 h-80 rounded-full bg-accent-500/5 border border-accent-500/10"
          animate={{ 
            scale: [1.1, 1.15, 1.1],
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
        <motion.div 
          className="absolute w-96 h-96 rounded-full bg-highlight-500/5 border border-highlight-500/10"
          animate={{ 
            scale: [1.2, 1.25, 1.2],
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        {/* Nodes */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const radius = 120 + (i % 3) * 30;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          return (
            <motion.div
              key={i}
              className="absolute w-4 h-4 rounded-full bg-surface-heavy flex items-center justify-center"
              style={{ 
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
              }}
              animate={{
                scale: [1, 1.3, 1],
                boxShadow: [
                  '0 0 0px rgba(0, 102, 255, 0.5)',
                  '0 0 10px rgba(0, 102, 255, 0.8)',
                  '0 0 0px rgba(0, 102, 255, 0.5)'
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                repeatType: "reverse"
              }}
            >
              <div className={`w-2 h-2 rounded-full ${i % 3 === 0 ? 'bg-primary-500' : i % 3 === 1 ? 'bg-accent-500' : 'bg-highlight-500'}`} />
            </motion.div>
          );
        })}
        
        {/* Central node */}
        <motion.div
          className="absolute w-10 h-10 rounded-full bg-surface-heavy flex items-center justify-center shadow-glow-primary"
          animate={{
            scale: [1, 1.1, 1],
            boxShadow: [
              '0 0 10px rgba(0, 102, 255, 0.5)',
              '0 0 20px rgba(0, 102, 255, 0.8)',
              '0 0 10px rgba(0, 102, 255, 0.5)'
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <div className="w-6 h-6 rounded-full bg-primary-500" />
        </motion.div>
      </div>
    </motion.div>
  );
};

// Generate node positions in a 3D space
const generateNodes = (count, radius) => {
  const nodes = [];
  
  // Central node
  nodes.push(new THREE.Vector3(0, 0, 0));
  
  // Surrounding nodes in a spherical distribution
  for (let i = 1; i < count; i++) {
    const phi = Math.acos(-1 + (2 * i) / count);
    const theta = Math.sqrt(count * Math.PI) * phi;
    
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    
    nodes.push(new THREE.Vector3(x, y, z));
  }
  
  return nodes;
};

// Generate connections between nodes
const generateConnections = (nodes, maxConnections) => {
  const connections = [];
  
  // Connect the central node (index 0) to some of the other nodes
  for (let i = 1; i < nodes.length; i++) {
    connections.push({
      start: 0,
      end: i,
      color: i % 3 === 0 ? '#0066ff' : i % 3 === 1 ? '#00ff80' : '#6600ff',
      width: 1.5,
    });
  }
  
  // Connect some nodes to each other
  for (let i = 1; i < nodes.length; i++) {
    const connectionsCount = 1 + Math.floor(Math.random() * maxConnections);
    
    for (let j = 0; j < connectionsCount; j++) {
      let targetNode;
      do {
        targetNode = 1 + Math.floor(Math.random() * (nodes.length - 1));
      } while (targetNode === i);
      
      // Avoid duplicate connections
      const connectionExists = connections.some(
        (conn) => (conn.start === i && conn.end === targetNode) || (conn.start === targetNode && conn.end === i)
      );
      
      if (!connectionExists) {
        connections.push({
          start: i,
          end: targetNode,
          color: '#ffffff',
          width: 0.5,
        });
      }
    }
  }
  
  return connections;
};

// A node in the network
const Node = ({ position, color = '#0066ff', size = 0.15, pulseSpeed = 1 }) => {
  const ref = useRef();
  
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      ref.current.scale.setScalar(1 + Math.sin(t * pulseSpeed) * 0.1);
    }
  });
  
  return (
    <mesh position={position} ref={ref}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color}
        emissiveIntensity={0.5}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
};

// A connection between nodes
const Connection = ({ start, end, color = '#ffffff', width = 1 }) => {
  const ref = useRef();
  
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      ref.current.material.opacity = 0.2 + Math.sin(t * 2) * 0.1;
      ref.current.material.dashOffset = t * 0.3;
    }
  });
  
  return (
    <Line
      ref={ref}
      points={[start, end]}
      color={color}
      lineWidth={width}
      dashed
      dashSize={0.2}
      dashScale={5}
      opacity={0.3}
      transparent
    />
  );
};

// The network graph component
const Network = () => {
  const nodeCount = 20;
  const radius = 3;
  const maxConnections = 3;
  
  const nodes = useMemo(() => generateNodes(nodeCount, radius), [nodeCount, radius]);
  const connections = useMemo(() => generateConnections(nodes, maxConnections), [nodes, maxConnections]);
  
  return (
    <group>
      {/* Nodes */}
      {nodes.map((position, i) => (
        <Node 
          key={`node-${i}`} 
          position={position} 
          color={i === 0 ? '#0066ff' : i % 3 === 0 ? '#0066ff' : i % 3 === 1 ? '#00ff80' : '#6600ff'}
          size={i === 0 ? 0.3 : 0.1 + Math.random() * 0.05}
          pulseSpeed={0.5 + Math.random() * 1.5}
        />
      ))}
      
      {/* Connections */}
      {connections.map((conn, i) => (
        <Connection 
          key={`conn-${i}`} 
          start={nodes[conn.start]} 
          end={nodes[conn.end]} 
          color={conn.color}
          width={conn.width}
        />
      ))}
    </group>
  );
};

// The main network graph component
const NetworkGraph = () => {
  // In a real application, you would want to detect WebGL support
  const supportsWebGL = true;
  
  if (!supportsWebGL) {
    return <FallbackNetwork />;
  }

  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Network />
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.5}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
      
      {/* Text overlay */}
      <div className="absolute bottom-5 right-5 glass-card p-3 text-xs max-w-[200px] text-white/70 backdrop-blur-lg">
        <p>Decentralized verification network - nodes represent validation points in the blockchain</p>
      </div>
    </div>
  );
};

export default NetworkGraph;