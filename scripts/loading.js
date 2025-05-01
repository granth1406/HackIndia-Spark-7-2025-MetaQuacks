// Loading page functionality
document.addEventListener('DOMContentLoaded', () => {
    const loadingOverlay = document.getElementById('loading-overlay');
    const mainContent = document.getElementById('main-content');
    
    // Create network nodes in background
    const nodesContainer = document.getElementById('nodes');
    const nodeCount = 20;
    const nodes = [];
    const connections = [];

    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
        const size = Math.floor(Math.random() * 6) + 4;
        const node = document.createElement('div');
        node.className = 'node';
        node.style.width = `${size}px`;
        node.style.height = `${size}px`;
        node.style.left = `${Math.random() * 90 + 5}%`;
        node.style.top = `${Math.random() * 90 + 5}%`;
        
        nodesContainer.appendChild(node);
        nodes.push({
            element: node,
            x: parseFloat(node.style.left),
            y: parseFloat(node.style.top),
            vx: (Math.random() - 0.5) * 0.05,
            vy: (Math.random() - 0.5) * 0.05
        });
    }

    // Create connections between nodes
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            if (Math.random() > 0.7) continue;
            
            const connection = document.createElement('div');
            connection.className = 'connection';
            nodesContainer.appendChild(connection);
            
            connections.push({
                element: connection,
                from: i,
                to: j
            });
        }
    }

    // Animate network nodes
    function updateNetwork() {
        // Update node positions
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            
            // Update position
            node.x += node.vx;
            node.y += node.vy;
            
            // Bounce off edges
            if (node.x < 5 || node.x > 95) {
                node.vx *= -1;
                node.x = Math.max(5, Math.min(95, node.x));
            }
            
            if (node.y < 5 || node.y > 95) {
                node.vy *= -1;
                node.y = Math.max(5, Math.min(95, node.y));
            }
            
            // Update DOM
            node.element.style.left = `${node.x}%`;
            node.element.style.top = `${node.y}%`;
        }
        
        // Update connections
        for (const conn of connections) {
            const fromNode = nodes[conn.from];
            const toNode = nodes[conn.to];
            
            const fromX = fromNode.x;
            const fromY = fromNode.y;
            const toX = toNode.x;
            const toY = toNode.y;
            
            const length = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
            const angle = Math.atan2(toY - fromY, toX - fromX);
            
            conn.element.style.width = `${length}%`;
            conn.element.style.left = `${fromX}%`;
            conn.element.style.top = `${fromY}%`;
            conn.element.style.transform = `rotate(${angle}rad)`;
        }
        
        requestAnimationFrame(updateNetwork);
    }
    
    updateNetwork();

    // Handle block activation in sequence
    const blocks = document.querySelectorAll('.block');
    
    function activateBlocksSequentially() {
        blocks.forEach((block, index) => {
            setTimeout(() => {
                block.classList.add('active');
                
                // If last block activated, hide loading overlay
                if (index === blocks.length - 1) {
                    setTimeout(() => {
                        loadingOverlay.classList.add('hidden');
                        mainContent.style.visibility = 'visible';
                        // Add fade-in class to main content for a smooth transition
                        mainContent.classList.add('fade-in');
                    }, 300); // Reduced from 500ms to 300ms
                }
            }, index * 150); // Reduced from 300ms to 150ms between blocks
        });
    }
    
    // Start the sequence after a brief initial delay
    setTimeout(() => {
        activateBlocksSequentially();
    }, 200); // Short delay before starting animation
});