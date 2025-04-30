/**
 * Three.js 3D Effects for ProofPass
 * Implements 3D particle effects and advanced animations
 */

// Initialize Three.js scene when DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    initCredentialCard3D();
    initNetworkGraph();
    initDigitalVaultAnimation();
    initTimelineAnimation(); // Added timeline animation for How It Works section
});

/**
 * 3D Credential Card with Three.js
 */
function initCredentialCard3D() {
    // Get container element
    const container = document.querySelector('.credential-card');
    if (!container) return;

    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true 
    });

    // Configure renderer
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Create credential card geometry
    const cardGeometry = new THREE.BoxGeometry(3, 4, 0.1);
    
    // Create holographic material with custom shaders
    const cardMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            resolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
            color1: { value: new THREE.Color(0x4f46e5) }, // Primary color
            color2: { value: new THREE.Color(0x10b981) }  // Secondary color
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vPosition;
            
            void main() {
                vUv = uv;
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec2 resolution;
            uniform vec3 color1;
            uniform vec3 color2;
            
            varying vec2 vUv;
            varying vec3 vPosition;
            
            void main() {
                // Create holographic gradient effect
                float gradientX = sin(vUv.x * 5.0 + time * 0.5) * 0.5 + 0.5;
                float gradientY = sin(vUv.y * 5.0 - time * 0.5) * 0.5 + 0.5;
                float gradient = (gradientX + gradientY) * 0.5;
                
                // Create ripple effect
                float ripple = sin(distance(vUv, vec2(0.5, 0.5)) * 10.0 - time * 2.0) * 0.1 + 0.9;
                
                // Combine effects
                vec3 finalColor = mix(color1, color2, gradient) * ripple;
                
                // Add shininess
                float shine = pow(sin(vUv.x * 3.14159 + time * 0.5), 10.0) * 0.5;
                finalColor += vec3(shine);
                
                // Edge highlighting
                float edge = 1.0 - smoothstep(0.0, 0.05, abs(vUv.x - 0.5) - 0.45);
                edge *= 1.0 - smoothstep(0.0, 0.05, abs(vUv.y - 0.5) - 0.45);
                finalColor += vec3(edge * 0.5);
                
                // Set transparency
                float alpha = 0.9 + edge * 0.1;
                
                gl_FragColor = vec4(finalColor, alpha);
            }
        `,
        transparent: true,
        side: THREE.DoubleSide
    });
    
    // Create card mesh
    const card = new THREE.Mesh(cardGeometry, cardMaterial);
    scene.add(card);
    
    // Add decorative security pattern texture to card
    const patternGeometry = new THREE.PlaneGeometry(2.9, 3.9, 1, 1);
    const patternTexture = new THREE.TextureLoader().load('../public/security-pattern.png', (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(5, 5);
    });
    
    const patternMaterial = new THREE.MeshBasicMaterial({
        map: patternTexture,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
    });
    
    const pattern = new THREE.Mesh(patternGeometry, patternMaterial);
    pattern.position.z = 0.06;
    card.add(pattern);
    
    // Add security chip
    const chipGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.02);
    const chipMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xb0b0b0,
        metalness: 0.8,
        roughness: 0.3
    });
    
    const chip = new THREE.Mesh(chipGeometry, chipMaterial);
    chip.position.set(0, 0.8, 0.06);
    card.add(chip);
    
    // Add logo
    const logoGeometry = new THREE.CircleGeometry(0.3, 32);
    const logoMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x4f46e5,
        transparent: true,
        opacity: 0.9
    });
    
    const logo = new THREE.Mesh(logoGeometry, logoMaterial);
    logo.position.set(0, -1, 0.06);
    card.add(logo);
    
    // Add particles around the card
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 100;
    const particlePositions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        particlePositions[i3] = (Math.random() - 0.5) * 6;
        particlePositions[i3 + 1] = (Math.random() - 0.5) * 6;
        particlePositions[i3 + 2] = (Math.random() - 0.5) * 6;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        color: 0x6366f1,
        size: 0.05,
        transparent: true,
        opacity: 0.7
    });
    
    const particles = new THREE.Points(particlesGeometry, particleMaterial);
    scene.add(particles);
    
    // Position camera
    camera.position.z = 5;
    
    // Interactive mouse movement
    let mouseX = 0;
    let mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX) / 100;
        mouseY = (event.clientY - windowHalfY) / 100;
    });
    
    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
        cardMaterial.uniforms.resolution.value.set(container.clientWidth, container.clientHeight);
    });
    
    // Animation loop
    const clock = new THREE.Clock();
    
    function animate() {
        requestAnimationFrame(animate);
        
        const time = clock.getElapsedTime();
        cardMaterial.uniforms.time.value = time;
        
        // Rotate card based on mouse position with dampening
        card.rotation.y = THREE.MathUtils.lerp(card.rotation.y, mouseX * 0.3, 0.1);
        card.rotation.x = THREE.MathUtils.lerp(card.rotation.x, -mouseY * 0.3, 0.1);
        
        // Animate particles
        const positions = particles.geometry.attributes.position.array;
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3 + 1] += Math.sin(time + i) * 0.01;
            positions[i3] += Math.cos(time + i * 1.1) * 0.01;
        }
        
        particles.geometry.attributes.position.needsUpdate = true;
        particles.rotation.y = time * 0.05;
        
        renderer.render(scene, camera);
    }
    
    animate();
}

/**
 * Network Graph visualization for CTA section
 */
function initNetworkGraph() {
    const container = document.querySelector('.network-graph');
    if (!container) return;
    
    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Create nodes and connections
    const nodeCount = 20;
    const nodes = [];
    const connections = [];
    const nodeGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    
    // Create materials
    const nodeMaterial1 = new THREE.MeshBasicMaterial({ color: 0x4f46e5 });
    const nodeMaterial2 = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.2
    });
    
    // Create node group
    const nodeGroup = new THREE.Group();
    
    // Helper function to create random positions in a sphere shape
    function randomSpherePoint(radius) {
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        
        return {
            x: radius * Math.sin(phi) * Math.cos(theta),
            y: radius * Math.sin(phi) * Math.sin(theta),
            z: radius * Math.cos(phi)
        };
    }
    
    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
        const position = randomSpherePoint(3);
        
        // Alternate between materials
        const material = i % 2 === 0 ? nodeMaterial1 : nodeMaterial2;
        const node = new THREE.Mesh(nodeGeometry, material);
        
        node.position.set(position.x, position.y, position.z);
        nodes.push(node);
        nodeGroup.add(node);
    }
    
    // Create connections between nearby nodes
    for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
            const node1 = nodes[i];
            const node2 = nodes[j];
            
            const distance = node1.position.distanceTo(node2.position);
            
            if (distance < 2.5) {
                const points = [node1.position, node2.position];
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, lineMaterial);
                
                connections.push(line);
                nodeGroup.add(line);
            }
        }
    }
    
    scene.add(nodeGroup);
    
    // Add subtle ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    // Position camera
    camera.position.z = 6;
    
    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate entire node group
        nodeGroup.rotation.y += 0.002;
        nodeGroup.rotation.x += 0.001;
        
        renderer.render(scene, camera);
    }
    
    animate();
}

/**
 * Create animated digital vault for the Secure Digital Vault section
 */
function initDigitalVaultAnimation() {
    const container = document.querySelector('.digital-vault-preview');
    if (!container) return;
    
    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Create vault structure
    const vaultGroup = new THREE.Group();
    scene.add(vaultGroup);
    
    // Vault body
    const vaultGeometry = new THREE.BoxGeometry(3, 2, 2);
    const vaultMaterial = new THREE.MeshPhongMaterial({
        color: 0x1e293b,
        specular: 0x111111,
        shininess: 30,
        transparent: true,
        opacity: 0.9
    });
    
    const vault = new THREE.Mesh(vaultGeometry, vaultMaterial);
    vaultGroup.add(vault);
    
    // Vault door
    const doorGeometry = new THREE.BoxGeometry(0.1, 1.8, 1.8);
    const doorMaterial = new THREE.MeshPhongMaterial({
        color: 0x334155,
        specular: 0x333333,
        shininess: 50,
        transparent: true,
        opacity: 0.9
    });
    
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.x = -1.45;
    vaultGroup.add(door);
    
    // Door handle
    const handleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 16);
    const handleMaterial = new THREE.MeshPhongMaterial({
        color: 0xb0b0b0,
        specular: 0xffffff,
        shininess: 100
    });
    
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.set(-1.6, 0, 0);
    handle.rotation.z = Math.PI / 2;
    vaultGroup.add(handle);
    
    // Security panel with digital display
    const panelGeometry = new THREE.BoxGeometry(0.1, 0.4, 0.6);
    const panelMaterial = new THREE.MeshPhongMaterial({
        color: 0x222222,
        specular: 0x111111,
        shininess: 50
    });
    
    const panel = new THREE.Mesh(panelGeometry, panelMaterial);
    panel.position.set(-1.56, 0.6, 0);
    vaultGroup.add(panel);
    
    // Digital readout (changing numbers)
    const displayCanvas = document.createElement('canvas');
    displayCanvas.width = 64;
    displayCanvas.height = 32;
    const displayCtx = displayCanvas.getContext('2d');
    
    displayCtx.fillStyle = '#10b981';
    displayCtx.fillRect(0, 0, 64, 32);
    
    const displayTexture = new THREE.CanvasTexture(displayCanvas);
    
    const displayGeometry = new THREE.PlaneGeometry(0.5, 0.25);
    const displayMaterial = new THREE.MeshBasicMaterial({
        map: displayTexture,
        transparent: true
    });
    
    const display = new THREE.Mesh(displayGeometry, displayMaterial);
    display.position.set(-1.51, 0.6, 0);
    vaultGroup.add(display);
    
    // Locks/bolts on the side of the door
    const createLock = (posY) => {
        const lockGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8);
        const lockMaterial = new THREE.MeshPhongMaterial({
            color: 0x888888,
            specular: 0xffffff,
            shininess: 30
        });
        
        const lock = new THREE.Mesh(lockGeometry, lockMaterial);
        lock.rotation.z = Math.PI / 2;
        lock.position.set(-1.2, posY, 0.7);
        
        return lock;
    };
    
    const locks = [];
    for (let i = 0; i < 3; i++) {
        const lock = createLock(0.5 - i * 0.5);
        locks.push(lock);
        vaultGroup.add(lock);
    }
    
    // Add glowing effects around the edges of the vault
    const createGlowingEdge = (width, height, depth, x, y, z) => {
        const edgeGeometry = new THREE.BoxGeometry(width, height, depth);
        const edgeMaterial = new THREE.MeshBasicMaterial({
            color: 0x4f46e5,
            transparent: true,
            opacity: 0.6
        });
        
        const edge = new THREE.Mesh(edgeGeometry, edgeMaterial);
        edge.position.set(x, y, z);
        return edge;
    };
    
    // Add glowing edges
    const edgeTop = createGlowingEdge(3.1, 0.05, 2.1, 0, 1.02, 0);
    const edgeBottom = createGlowingEdge(3.1, 0.05, 2.1, 0, -1.02, 0);
    const edgeLeft = createGlowingEdge(0.05, 2.1, 2.1, -1.52, 0, 0);
    const edgeRight = createGlowingEdge(0.05, 2.1, 2.1, 1.52, 0, 0);
    
    vaultGroup.add(edgeTop, edgeBottom, edgeLeft, edgeRight);
    
    // Create floating credentials (document particles)
    const credentialCount = 8;
    const credentials = [];
    
    for (let i = 0; i < credentialCount; i++) {
        // Choose between document or certificate shape
        const isDocument = Math.random() > 0.3;
        
        const width = isDocument ? 0.6 : 0.5;
        const height = isDocument ? 0.8 : 0.7;
        
        const geometry = new THREE.PlaneGeometry(width, height);
        const color = Math.random() > 0.5 ? 0x4f46e5 : 0x10b981;
        
        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
        });
        
        const credential = new THREE.Mesh(geometry, material);
        
        // Position inside vault
        credential.position.set(
            (Math.random() - 0.5) * 1.8,
            (Math.random() - 0.5) * 1.2,
            (Math.random() - 0.5) * 1.2
        );
        
        // Random rotation
        credential.rotation.x = Math.random() * Math.PI;
        credential.rotation.y = Math.random() * Math.PI;
        
        credentials.push({
            mesh: credential,
            initialY: credential.position.y,
            floatSpeed: Math.random() * 0.01 + 0.005,
            rotateSpeed: Math.random() * 0.01 + 0.005
        });
        
        vaultGroup.add(credential);
    }
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 1, 2);
    scene.add(directionalLight);
    
    const blueLight = new THREE.PointLight(0x4f46e5, 0.8, 10);
    blueLight.position.set(-2, 2, 2);
    scene.add(blueLight);
    
    const greenLight = new THREE.PointLight(0x10b981, 0.8, 10);
    greenLight.position.set(2, -2, -2);
    scene.add(greenLight);
    
    // Position camera
    camera.position.z = 4.5;
    
    // Add interaction with mouse
    let mouseX = 0;
    let mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX) / 100;
        mouseY = (event.clientY - windowHalfY) / 100;
    });
    
    // Set up animation with GSAP
    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: container,
            start: "top bottom-=100",
            end: "bottom top+=100",
            toggleActions: "play none none reverse",
            scrub: 0.5
        }
    });
    
    // Animate door opening when scrolling to the section
    timeline.to(door.position, {
        x: -2,
        duration: 1,
        ease: "power2.out"
    });
    
    timeline.to(door.rotation, {
        y: -Math.PI / 2,
        duration: 1,
        ease: "power2.out"
    }, "-=0.5");
    
    timeline.to(handle.rotation, {
        y: Math.PI,
        duration: 0.5,
        ease: "power2.inOut"
    }, "-=1.5");
    
    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    // Animation loop
    const clock = new THREE.Clock();
    
    function animate() {
        requestAnimationFrame(animate);
        
        const time = clock.getElapsedTime();
        
        // Update digital display
        if (Math.floor(time * 2) % 2 === 0) {
            displayCtx.fillStyle = '#10b981';
            displayCtx.fillRect(0, 0, 64, 32);
            
            displayCtx.fillStyle = '#000';
            displayCtx.font = '18px monospace';
            displayCtx.textAlign = 'center';
            displayCtx.textBaseline = 'middle';
            
            const code = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            displayCtx.fillText(code, 32, 16);
            
            displayTexture.needsUpdate = true;
        }
        
        // Animate floating credentials
        credentials.forEach(item => {
            item.mesh.position.y = item.initialY + Math.sin(time * item.floatSpeed * 5) * 0.2;
            item.mesh.rotation.x += item.rotateSpeed / 2;
            item.mesh.rotation.y += item.rotateSpeed;
        });
        
        // Rotate vault based on mouse movement (with damping)
        vaultGroup.rotation.x = THREE.MathUtils.lerp(vaultGroup.rotation.x, -mouseY * 0.3, 0.05);
        vaultGroup.rotation.y = THREE.MathUtils.lerp(vaultGroup.rotation.y, mouseX * 0.3, 0.05);
        
        // Animate locks/bolts
        locks.forEach((lock, index) => {
            const delay = index * 0.5;
            const extended = (Math.sin(time - delay) + 1) / 2;
            lock.position.x = -1.2 - extended * 0.3;
        });
        
        // Pulse the glowing edges
        const edgePulse = (Math.sin(time * 2) + 1) / 2;
        [edgeTop, edgeBottom, edgeLeft, edgeRight].forEach(edge => {
            edge.material.opacity = 0.4 + edgePulse * 0.3;
        });
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Dispatch custom event when Three.js scene is ready
    window.dispatchEvent(new CustomEvent('three-ready'));
}

/**
 * Create animated particles inside the digital vault
 * This function is no longer called but kept as a reference
 */
function createDigitalVaultParticles() {
    const container = document.querySelector('.digital-vault');
    if (!container) return;
    
    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Create particle system
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 200;
    
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);
    
    const color1 = new THREE.Color(0x4f46e5);
    const color2 = new THREE.Color(0x10b981);
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Position particles in a box shape
        positions[i3] = (Math.random() - 0.5) * 5;
        positions[i3 + 1] = (Math.random() - 0.5) * 3;
        positions[i3 + 2] = (Math.random() - 0.5) * 3;
        
        // Vary particle sizes
        sizes[i] = Math.random() * 0.1 + 0.02;
        
        // Mix colors
        const mixedColor = color1.clone().lerp(color2, Math.random());
        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Custom shader material for better-looking particles
    const particlesMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 }
        },
        vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float time;
            
            void main() {
                vColor = color;
                
                // Animate particles in a swirling motion
                vec3 pos = position;
                float movementRadius = length(pos.xz);
                float angle = atan(pos.z, pos.x) + time * (0.1 + 0.1 * movementRadius);
                
                pos.x = cos(angle) * movementRadius;
                pos.z = sin(angle) * movementRadius;
                pos.y += sin(time * 0.5 + pos.x * 2.0) * 0.1;
                
                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            
            void main() {
                // Create circular particles with soft edges
                float distanceFromCenter = length(gl_PointCoord - vec2(0.5));
                float strength = 1.0 - smoothstep(0.0, 0.5, distanceFromCenter);
                
                gl_FragColor = vec4(vColor, strength);
            }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
    // Add document flow lines (data streams)
    const flowLinesCount = 15;
    const flowLines = [];
    
    for (let i = 0; i < flowLinesCount; i++) {
        const points = [];
        const segments = Math.floor(Math.random() * 5) + 3;
        const startX = (Math.random() - 0.5) * 4;
        const startY = (Math.random() - 0.5) * 2;
        const startZ = (Math.random() - 0.5) * 2;
        
        for (let j = 0; j <= segments; j++) {
            const x = startX + (j / segments) * 2 - 1;
            const y = startY + (Math.random() - 0.5) * 0.5;
            const z = startZ + (Math.random() - 0.5) * 0.5;
            
            points.push(new THREE.Vector3(x, y, z));
        }
        
        const curve = new THREE.CatmullRomCurve3(points);
        const geometry = new THREE.TubeGeometry(curve, 20, 0.02, 8, false);
        
        const useColor1 = Math.random() > 0.5;
        const material = new THREE.MeshBasicMaterial({
            color: useColor1 ? 0x4f46e5 : 0x10b981,
            transparent: true,
            opacity: 0.5
        });
        
        const line = new THREE.Mesh(geometry, material);
        scene.add(line);
        flowLines.push({
            mesh: line,
            speed: Math.random() * 0.01 + 0.01,
            material
        });
    }
    
    // Position camera
    camera.position.z = 5;
    
    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    // Animation loop
    const clock = new THREE.Clock();
    
    function animate() {
        requestAnimationFrame(animate);
        
        const time = clock.getElapsedTime();
        
        // Update particle uniforms
        particlesMaterial.uniforms.time.value = time;
        
        // Animate flow lines
        flowLines.forEach(line => {
            // Pulse effect for flow lines
            line.material.opacity = 0.3 + Math.sin(time * 2 + line.speed * 50) * 0.2;
            
            // Moving effect
            const positions = line.mesh.geometry.attributes.position.array;
            const count = positions.length / 3;
            
            for (let i = 0; i < count; i++) {
                const i3 = i * 3;
                const offset = i / count;
                positions[i3 + 1] += Math.sin(time * 3 + offset * 10) * 0.001;
            }
            
            line.mesh.geometry.attributes.position.needsUpdate = true;
        });
        
        // Rotate particle system slightly
        particles.rotation.y = time * 0.1;
        
        renderer.render(scene, camera);
    }
    
    animate();
}