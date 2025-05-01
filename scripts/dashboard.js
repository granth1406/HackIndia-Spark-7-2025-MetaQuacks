// Dashboard functionality
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.dashboard-sidebar');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            sidebar.classList.contains('active') && 
            !sidebar.contains(e.target) && 
            e.target !== mobileMenuBtn) {
            sidebar.classList.remove('active');
        }
    });
    
    // File upload handling
    const uploadBtn = document.querySelector('.upload-btn');
    const fileInput = document.getElementById('credential-upload');
    
    if (uploadBtn && fileInput) {
        uploadBtn.addEventListener('click', () => {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                const fileName = e.target.files[0].name;
                alert(`File selected: ${fileName}\nUploading credential...`);
                // In a real app, you would process the file upload here
            }
        });
    }
    
    // Drag and drop functionality for file upload
    const uploadArea = document.querySelector('.upload-area');
    
    if (uploadArea) {
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        // Highlight drop area when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, unhighlight, false);
        });
        
        function highlight() {
            uploadArea.classList.add('highlight');
        }
        
        function unhighlight() {
            uploadArea.classList.remove('highlight');
        }
        
        // Handle dropped files
        uploadArea.addEventListener('drop', handleDrop, false);
        
        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            
            if (files.length > 0) {
                const fileName = files[0].name;
                alert(`File dropped: ${fileName}\nUploading credential...`);
                // In a real app, you would process the file upload here
            }
        }
    }
    
    // Credential type selection
    const credentialTypes = document.querySelectorAll('.credential-type');
    
    if (credentialTypes.length > 0) {
        credentialTypes.forEach(type => {
            type.addEventListener('click', () => {
                // Remove active class from all types
                credentialTypes.forEach(t => t.classList.remove('active'));
                
                // Add active class to selected type
                type.classList.add('active');
                
                // Get the credential type
                const typeName = type.querySelector('span').textContent;
                alert(`Selected credential type: ${typeName}`);
                // In a real app, you would show a form specific to this credential type
            });
        });
    }
    
    // Handle credential card actions
    const actionBtns = document.querySelectorAll('.action-btn');
    
    if (actionBtns.length > 0) {
        actionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                
                const action = btn.querySelector('i').className;
                
                if (action.includes('share-nodes')) {
                    showShareOptions(btn);
                } else if (action.includes('ellipsis')) {
                    showMoreOptions(btn);
                }
            });
        });
    }
    
    function showShareOptions(btn) {
        const credentialCard = btn.closest('.credential-card');
        const credentialName = credentialCard.querySelector('h3').textContent;
        
        // In a real app, you would show a sharing modal
        alert(`Share options for: ${credentialName}`);
    }
    
    function showMoreOptions(btn) {
        const credentialCard = btn.closest('.credential-card');
        const credentialName = credentialCard.querySelector('h3').textContent;
        
        // In a real app, you would show a dropdown menu
        alert(`More options for: ${credentialName}`);
    }
    
    // Handle verification request actions
    const approveButtons = document.querySelectorAll('.request-actions .btn-primary');
    const denyButtons = document.querySelectorAll('.request-actions .btn-outline');
    
    if (approveButtons.length > 0) {
        approveButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const requestCard = btn.closest('.request-card');
                const requester = requestCard.querySelector('h3').textContent;
                
                // In a real app, you would handle the approval process
                alert(`Approved request from: ${requester}`);
                requestCard.style.opacity = '0.5';
                requestCard.style.pointerEvents = 'none';
            });
        });
    }
    
    if (denyButtons.length > 0) {
        denyButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const requestCard = btn.closest('.request-card');
                const requester = requestCard.querySelector('h3').textContent;
                
                // In a real app, you would handle the denial process
                alert(`Denied request from: ${requester}`);
                requestCard.style.opacity = '0.5';
                requestCard.style.pointerEvents = 'none';
            });
        });
    }
    
    // Notification handling
    const notificationBtn = document.querySelector('.notification-btn');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', () => {
            // In a real app, you would show a notifications dropdown
            alert('Notifications clicked');
        });
    }
    
    // User profile dropdown
    const userProfile = document.querySelector('.user-profile');
    
    if (userProfile) {
        userProfile.addEventListener('click', () => {
            // In a real app, you would show a user profile dropdown
            alert('User profile clicked');
        });
    }
});