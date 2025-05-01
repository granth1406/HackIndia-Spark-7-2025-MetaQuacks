/**
 * Particle Background Animation
 * Creates an interactive particle network for the site background
 */

document.addEventListener('DOMContentLoaded', () => {
    initParticleBackground();
});

function initParticleBackground() {
    const container = document.getElementById('particle-container');
    if (!container) return;

    // Canvas setup
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    container.appendChild(canvas);

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Particles configuration
    const particleConfig = {
        count: calculateParticleCount(),
        color: '#6366f1',
        secondaryColor: '#10b981',
        radius: 1.5,
        maxRadius: 3,
        speed: 0.2,
        connectDistance: 150,
        opacity: 0.4
    };

    // Calculate particle count based on screen size
    function calculateParticleCount() {
        const area = window.innerWidth * window.innerHeight;
        return Math.min(Math.max(Math.floor(area / 20000), 30), 100);
    }

    // Particle array
    let particles = [];

    // Mouse position for interactive effect
    let mouse = {
        x: null,
        y: null,
        radius: 120
    };

    // Track mouse movement
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    // Reset mouse position when inactive
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particleConfig.count = calculateParticleCount();
        init();
    });

    // Particle class
    class Particle {
        constructor(x, y, directionX, directionY, radius, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.radius = radius;
            this.baseRadius = radius;
            this.color = color;
            this.isSecondary = Math.random() > 0.7;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.isSecondary ? particleConfig.secondaryColor : particleConfig.color;
            ctx.globalAlpha = particleConfig.opacity;
            ctx.fill();
        }

        // Update particle position and check for mouse interaction
        update() {
            // Boundary collision detection
            if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
                this.directionY = -this.directionY;
            }

            // Move particle
            this.x += this.directionX;
            this.y += this.directionY;

            // Mouse interaction
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    // Inside mouse radius, push particles away slightly
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouse.radius - distance) / mouse.radius;
                    
                    const directionX = forceDirectionX * force * -1;
                    const directionY = forceDirectionY * force * -1;
                    
                    this.x += directionX;
                    this.y += directionY;
                    
                    // Increase size on hover
                    this.radius = Math.min(this.baseRadius * 2, particleConfig.maxRadius);
                } else {
                    // Reset to original size when not hovering
                    if (this.radius > this.baseRadius) {
                        this.radius -= 0.1;
                    }
                }
            } else if (this.radius > this.baseRadius) {
                this.radius -= 0.1;
            }

            // Draw the particle
            this.draw();
        }
    }

    // Connect nearby particles with lines
    function connect() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < particleConfig.connectDistance) {
                    const opacity = 1 - (distance / particleConfig.connectDistance);
                    
                    // Gradient line between particles
                    const gradient = ctx.createLinearGradient(
                        particles[i].x, particles[i].y,
                        particles[j].x, particles[j].y
                    );
                    
                    const color1 = particles[i].isSecondary ? particleConfig.secondaryColor : particleConfig.color;
                    const color2 = particles[j].isSecondary ? particleConfig.secondaryColor : particleConfig.color;
                    
                    gradient.addColorStop(0, color1);
                    gradient.addColorStop(1, color2);
                    
                    ctx.strokeStyle = gradient;
                    ctx.globalAlpha = opacity * 0.3;
                    ctx.lineWidth = 1;
                    
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Initialize particles
    function init() {
        particles = [];
        for (let i = 0; i < particleConfig.count; i++) {
            const radius = (Math.random() * 2) + particleConfig.radius;
            // Random position ensuring particles don't start outside the canvas
            const x = Math.random() * (canvas.width - radius * 2) + radius;
            const y = Math.random() * (canvas.height - radius * 2) + radius;
            const directionX = (Math.random() - 0.5) * particleConfig.speed;
            const directionY = (Math.random() - 0.5) * particleConfig.speed;
            
            particles.push(new Particle(x, y, directionX, directionY, radius, particleConfig.color));
        }
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
        }
        
        connect();
    }

    init();
    animate();
}