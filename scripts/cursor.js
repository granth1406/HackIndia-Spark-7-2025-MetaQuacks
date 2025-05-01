document.addEventListener('DOMContentLoaded', () => {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-dot-outline');
    
    // Check if on touch device - don't show custom cursor on touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (!isTouchDevice) {
        // Add active class to enable styling
        document.body.classList.add('custom-cursor-active');
        
        // Make cursor visible when mouse enters viewport
        document.addEventListener('mouseenter', () => {
            cursorDot.style.opacity = 1;
            cursorOutline.style.opacity = 1;
        });
        
        // Hide cursor when mouse leaves viewport
        document.addEventListener('mouseleave', () => {
            cursorDot.style.opacity = 0;
            cursorOutline.style.opacity = 0;
        });
        
        // Cursor follows mouse with subtle lag effect
        let mouseX = 0;
        let mouseY = 0;
        let outlineX = 0;
        let outlineY = 0;
        const speed = 0.2; // Adjust for faster/slower following
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Position dot directly at cursor
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });
        
        // Smooth animation for outline with requestAnimationFrame
        function animateOutline() {
            // Calculate distance between current position and target
            let distX = mouseX - outlineX;
            let distY = mouseY - outlineY;
            
            // Move outline a percentage of the distance
            outlineX += distX * speed;
            outlineY += distY * speed;
            
            // Apply position
            cursorOutline.style.left = outlineX + 'px';
            cursorOutline.style.top = outlineY + 'px';
            
            requestAnimationFrame(animateOutline);
        }
        
        animateOutline();
        
        // Add click effect
        document.addEventListener('mousedown', () => {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(0.7)';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(0.7)';
        });
        
        document.addEventListener('mouseup', () => {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        
        // Enhanced interaction for clickable elements
        const clickables = document.querySelectorAll('a, button, .btn, .feature-card, .testimonial-card, .mobile-menu-btn');
        
        clickables.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorOutline.style.backgroundColor = 'rgba(93, 95, 239, 0.4)';
            });
            
            element.addEventListener('mouseleave', () => {
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorOutline.style.backgroundColor = 'rgba(93, 95, 239, 0.2)';
            });
        });
    }
});