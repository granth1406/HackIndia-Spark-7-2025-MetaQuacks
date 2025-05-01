// Dashboard functionality
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.dashboard-sidebar');
    
    // Animation activation for dashboard content
    const dashboardContent = document.querySelector('.dashboard-content');
    if (dashboardContent) {
        // Force dashboard content to be visible
        dashboardContent.style.opacity = '1';
        
        // Activate animations for child elements
        setTimeout(() => {
            const activityItems = document.querySelectorAll('.activity-item');
            activityItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('active');
                }, index * 100);
            });
            
            const credentialCards = document.querySelectorAll('.credential-card');
            credentialCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('active');
                }, index * 100);
            });
        }, 300);
    }
    
    // Force stats grid and dashboard grid to be visible
    const statsGrid = document.querySelector('.stats-grid');
    const dashboardGrid = document.querySelector('.dashboard-grid');
    const credentialsGrid = document.querySelector('.credentials-grid');
    
    if (statsGrid) statsGrid.style.opacity = '1';
    if (dashboardGrid) dashboardGrid.style.opacity = '1';
    if (credentialsGrid) credentialsGrid.style.opacity = '1';
    
    // Mobile menu toggle (continued)
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
    
    // Filter Credentials functionality
    window.filterCredentials = function(category) {
        // Get all filter buttons and remove active class
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            if (btn.innerText.toLowerCase().includes(category.toLowerCase())) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Get all credential cards
        const credentialCards = document.querySelectorAll('.credential-card');
        
        // If category is 'all', show all cards
        if (category.toLowerCase() === 'all') {
            credentialCards.forEach(card => {
                card.style.display = 'block';
                // Add a small delay for animation purposes
                setTimeout(() => {
                    card.classList.add('active');
                }, 100);
            });
            return;
        }
        
        // Loop through all credential cards
        credentialCards.forEach(card => {
            // Get the card type from the content (this would usually be a data attribute in production)
            let cardType = '';
            
            // Extract card type from content (simplified approach for demo)
            const title = card.querySelector('h3').textContent.toLowerCase();
            const issuer = card.querySelector('.issuer').textContent.toLowerCase();
            
            // Determine card type based on content
            if (title.includes('degree') || issuer.includes('university') || issuer.includes('institute of technology')) {
                cardType = 'education';
            } else if (title.includes('certified') || title.includes('certification') || title.includes('architect') || title.includes('developer')) {
                cardType = 'certification';
            } else if (issuer.includes('corp') || title.includes('professional')) {
                cardType = 'employment';
            } else if (title.includes('award') || title.includes('achievement')) {
                cardType = 'achievements';
            }
            
            // Show/hide based on filter
            if (cardType === category.toLowerCase()) {
                card.style.display = 'block';
                // Add a small delay for animation purposes
                setTimeout(() => {
                    card.classList.add('active');
                }, 100);
            } else {
                card.classList.remove('active');
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300); // Match transition duration from CSS
            }
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
    
    // Add data attributes to credential cards for better filtering
    const addDataAttributes = () => {
        const credentialCards = document.querySelectorAll('.credential-card');
        
        credentialCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const issuer = card.querySelector('.issuer').textContent.toLowerCase();
            
            // Set data attributes based on content for more robust filtering
            if (title.includes('degree') || issuer.includes('university') || issuer.includes('institute of technology')) {
                card.setAttribute('data-type', 'education');
            } else if (title.includes('certified') || title.includes('certification') || title.includes('architect') || title.includes('developer')) {
                card.setAttribute('data-type', 'certification');
            } else if (issuer.includes('corp') || title.includes('professional')) {
                card.setAttribute('data-type', 'employment');
            } else if (title.includes('award') || title.includes('achievement')) {
                card.setAttribute('data-type', 'achievements');
            } else {
                card.setAttribute('data-type', 'other');
            }
        });
    }
    
    // Initialize data attributes for filtering
    addDataAttributes();
    
    // Initialize sorting functionality
    const sortDropdown = document.querySelector('.sort-btn');
    if (sortDropdown) {
        sortDropdown.addEventListener('click', () => {
            // In a real app, you would show a dropdown for sorting options
            alert('Sort options: Newest, Oldest, Name A-Z, Name Z-A');
        });
    }

    // Advanced Filter functionality
    const filterBtn = document.querySelector('.filter-dropdown .filter-btn');
    const filterDropdown = document.getElementById('filterDropdown');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const applyFiltersBtn = document.getElementById('applyFilters');
    
    // Toggle filter dropdown
    if (filterBtn && filterDropdown) {
        filterBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            filterDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!filterDropdown.contains(e.target) && e.target !== filterBtn) {
                filterDropdown.classList.remove('show');
            }
        });
    }
    
    // Advanced filtering functionality
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            applyAdvancedFilters();
            filterDropdown.classList.remove('show');
        });
    }
    
    // Clear all filters
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            // Uncheck all checkboxes
            const checkboxes = filterDropdown.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            
            // Show all credential cards again
            const credentialCards = document.querySelectorAll('.credential-card');
            credentialCards.forEach(card => {
                card.style.display = 'block';
                setTimeout(() => {
                    card.classList.add('active');
                }, 100);
            });
            
            // Update filter button UI
            filterBtn.classList.remove('active');
            
            // Remove any active filter tags if they exist
            const activeFilters = document.querySelector('.active-filters');
            if (activeFilters) {
                activeFilters.innerHTML = '';
                activeFilters.style.display = 'none';
            }
        });
    }
    
    // Function to apply advanced filters
    function applyAdvancedFilters() {
        // Get all selected filter values
        const selectedIssuers = getSelectedValues('issuer');
        const selectedStatuses = getSelectedValues('status');
        const selectedExpiries = getSelectedValues('expiry');
        
        // Get all credential cards
        const credentialCards = document.querySelectorAll('.credential-card');
        
        // If no filters are selected, show all cards
        if (selectedIssuers.length === 0 && selectedStatuses.length === 0 && selectedExpiries.length === 0) {
            credentialCards.forEach(card => {
                card.style.display = 'block';
                setTimeout(() => {
                    card.classList.add('active');
                }, 100);
            });
            return;
        }
        
        // Flag to track if filters are active
        let filtersActive = false;
        
        // Show filter button as active
        if (selectedIssuers.length > 0 || selectedStatuses.length > 0 || selectedExpiries.length > 0) {
            filterBtn.classList.add('active');
            filtersActive = true;
        } else {
            filterBtn.classList.remove('active');
        }
        
        // Create or show active filters container
        let activeFilters = document.querySelector('.active-filters');
        if (!activeFilters) {
            activeFilters = document.createElement('div');
            activeFilters.className = 'active-filters';
            const filterOptions = document.querySelector('.filter-options');
            filterOptions.appendChild(activeFilters);
        }
        
        // Clear previous filter tags
        activeFilters.innerHTML = '';
        
        // Show active filters if any are selected
        if (filtersActive) {
            activeFilters.style.display = 'flex';
            
            // Create tags for each selected filter
            createFilterTags(selectedIssuers, 'issuer', activeFilters);
            createFilterTags(selectedStatuses, 'status', activeFilters);
            createFilterTags(selectedExpiries, 'expiry', activeFilters);
        } else {
            activeFilters.style.display = 'none';
        }
        
        // For each credential card, check if it matches the selected filters
        credentialCards.forEach(card => {
            // Get card data from content
            const title = card.querySelector('h3').textContent.toLowerCase();
            const issuer = card.querySelector('.issuer').textContent.toLowerCase();
            const isVerified = card.querySelector('.verified') !== null;
            const detailItems = card.querySelectorAll('.detail-item');
            
            // Extract expiry date if available
            let expiryDate = null;
            let isPermanent = false;
            
            detailItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes('expires:')) {
                    if (text.includes('permanent')) {
                        isPermanent = true;
                    } else {
                        // Extract expiry date - format: "Expires: MMM DD, YYYY"
                        const dateStr = text.replace('expires:', '').trim();
                        expiryDate = new Date(dateStr);
                    }
                }
            });
            
            // Check if card matches issuer filter
            let matchesIssuer = selectedIssuers.length === 0;
            if (!matchesIssuer) {
                selectedIssuers.forEach(selected => {
                    if (selected === 'microsoft' && (issuer.includes('microsoft') || title.includes('azure'))) {
                        matchesIssuer = true;
                    } else if (selected === 'google' && (issuer.includes('google') || title.includes('google'))) {
                        matchesIssuer = true;
                    } else if (selected === 'aws' && (issuer.includes('amazon') || issuer.includes('aws') || title.includes('aws'))) {
                        matchesIssuer = true;
                    } else if (selected === 'mit' && (issuer.includes('mit') || issuer.includes('massachusetts'))) {
                        matchesIssuer = true;
                    } else if (selected === 'pmi' && (issuer.includes('pmi') || issuer.includes('project management'))) {
                        matchesIssuer = true;
                    } else if (selected === 'isc2' && (issuer.includes('isc') || title.includes('cissp'))) {
                        matchesIssuer = true;
                    }
                });
            }
            
            // Check if card matches status filter
            let matchesStatus = selectedStatuses.length === 0;
            if (!matchesStatus) {
                if (selectedStatuses.includes('verified') && isVerified) {
                    matchesStatus = true;
                } else if (selectedStatuses.includes('pending') && !isVerified) {
                    matchesStatus = true;
                }
            }
            
            // Check if card matches expiry filter
            let matchesExpiry = selectedExpiries.length === 0;
            if (!matchesExpiry && expiryDate) {
                const today = new Date();
                const daysDiff = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));
                
                if (selectedExpiries.includes('30days') && daysDiff <= 30 && daysDiff > 0) {
                    matchesExpiry = true;
                } else if (selectedExpiries.includes('90days') && daysDiff <= 90 && daysDiff > 0) {
                    matchesExpiry = true;
                } else if (selectedExpiries.includes('1year') && daysDiff <= 365 && daysDiff > 0) {
                    matchesExpiry = true;
                } else if (selectedExpiries.includes('expired') && daysDiff <= 0) {
                    matchesExpiry = true;
                }
            } else if (!matchesExpiry && isPermanent && selectedExpiries.includes('permanent')) {
                matchesExpiry = true;
            }
            
            // Show/hide card based on all filter matches
            if (matchesIssuer && matchesStatus && matchesExpiry) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.classList.add('active');
                }, 100);
            } else {
                card.classList.remove('active');
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300); // Transition duration
            }
        });
    }
    
    // Helper function to get selected checkbox values for a filter type
    function getSelectedValues(filterName) {
        const checkboxes = document.querySelectorAll(`input[name="${filterName}"]:checked`);
        return Array.from(checkboxes).map(checkbox => checkbox.value);
    }
    
    // Helper function to create filter tags
    function createFilterTags(selectedValues, filterType, container) {
        selectedValues.forEach(value => {
            const tag = document.createElement('div');
            tag.className = 'filter-tag';
            
            // Format the display text based on the filter type
            let displayText = value;
            
            if (filterType === 'expiry') {
                if (value === '30days') displayText = 'Expires in 30 days';
                if (value === '90days') displayText = 'Expires in 90 days';
                if (value === '1year') displayText = 'Expires in 1 year';
                if (value === 'expired') displayText = 'Expired';
                if (value === 'permanent') displayText = 'Permanent';
            } else if (filterType === 'status') {
                displayText = value.charAt(0).toUpperCase() + value.slice(1);
            } else if (filterType === 'issuer') {
                displayText = value.charAt(0).toUpperCase() + value.slice(1);
            }
            
            tag.innerHTML = `
                <span>${displayText}</span>
                <span class="remove-filter" data-filter="${filterType}" data-value="${value}">×</span>
            `;
            
            container.appendChild(tag);
            
            // Add click event to remove filter
            const removeBtn = tag.querySelector('.remove-filter');
            removeBtn.addEventListener('click', (e) => {
                const filterType = e.target.getAttribute('data-filter');
                const filterValue = e.target.getAttribute('data-value');
                
                // Find and uncheck the corresponding checkbox
                const checkbox = document.querySelector(`input[name="${filterType}"][value="${filterValue}"]`);
                if (checkbox) {
                    checkbox.checked = false;
                }
                
                // Re-apply filters
                applyAdvancedFilters();
            });
        });
    }
});