// Common functionality for all pages

// Preloader
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 1500);
});

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        
        // Update active state
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        n.classList.add('active');
    }));
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Animated counter for stats
function initStatsCounter() {
    const counters = document.querySelectorAll('.stat-number');
    
    if (!counters.length) return;
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-count');
        const increment = target / 200;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                setTimeout(updateCounter, 10);
            } else {
                counter.textContent = target;
            }
        };
        
        // Start counter when element is in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// Gallery Filter Functionality
function initGalleryFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-grid-item');
    
    if (!filterButtons.length || !galleryItems.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Gallery Lightbox
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-grid-item');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    if (!galleryItems.length || !lightbox) return;
    
    let currentIndex = 0;
    const images = [];
    
    // Collect all gallery images
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        const title = item.querySelector('h3').textContent;
        const location = item.querySelector('p').textContent;
        
        images.push({
            src: img.src,
            title: title,
            location: location
        });
        
        // Add click event to each gallery item
        item.addEventListener('click', () => {
            currentIndex = index;
            updateLightbox();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close lightbox
    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Navigation
    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateLightbox();
    });
    
    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % images.length;
        updateLightbox();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        } else if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateLightbox();
        } else if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % images.length;
            updateLightbox();
        }
    });
    
    function updateLightbox() {
        const image = images[currentIndex];
        lightboxImg.src = image.src;
        lightboxCaption.querySelector('h3').textContent = image.title;
        lightboxCaption.querySelector('p').textContent = image.location;
    }
}

// Contact Form Validation
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Basic validation
        const requiredFields = contactForm.querySelectorAll('[required]');
        let isValid = true;
        
        // Reset previous error states
        contactForm.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error');
        });
        
        // Validate each required field
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.parentElement.classList.add('error');
                isValid = false;
            }
            
            // Email validation
            if (field.type === 'email' && field.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value)) {
                    field.parentElement.classList.add('error');
                    isValid = false;
                }
            }
        });
        
        if (isValid) {
            // Simulate form submission
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.querySelector('span').textContent;
            const originalIcon = submitBtn.innerHTML;
            
            submitBtn.querySelector('span').textContent = 'Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'form-success';
                successMessage.innerHTML = `
                    <div style="background: #4CAF50; color: white; padding: 20px; border-radius: 2px; text-align: center; margin-top: 20px;">
                        <h3><i class="fas fa-check-circle"></i> Thank You!</h3>
                        <p>Your message has been sent successfully. We will contact you within 24 hours to discuss your project.</p>
                    </div>
                `;
                
                contactForm.parentNode.insertBefore(successMessage, contactForm.nextSibling);
                
                // Reset form
                contactForm.reset();
                submitBtn.querySelector('span').textContent = originalText;
                submitBtn.disabled = false;
                
                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth' });
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            }, 1500);
        }
    });
}

// FAQ Accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (!faqItems.length) return;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.display = 'none';
                    otherItem.querySelector('.faq-toggle i').className = 'fas fa-plus';
                }
            });
            
            // Toggle current item
            const isActive = item.classList.contains('active');
            
            if (isActive) {
                item.classList.remove('active');
                answer.style.display = 'none';
                toggle.querySelector('i').className = 'fas fa-plus';
            } else {
                item.classList.add('active');
                answer.style.display = 'block';
                toggle.querySelector('i').className = 'fas fa-minus';
            }
        });
    });
}

// Load More Projects Button
function initLoadMore() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    if (!loadMoreBtn) return;
    
    loadMoreBtn.addEventListener('click', () => {
        // Simulate loading more projects
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        loadMoreBtn.disabled = true;
        
        setTimeout(() => {
            // In a real implementation, this would fetch more projects from a server
            loadMoreBtn.textContent = 'All Projects Loaded';
            loadMoreBtn.style.opacity = '0.5';
            loadMoreBtn.style.cursor = 'default';
            
            // Show a message
            const message = document.createElement('p');
            message.textContent = 'All projects are currently displayed.';
            message.style.textAlign = 'center';
            message.style.color = '#777';
            message.style.marginTop = '20px';
            
            loadMoreBtn.parentNode.appendChild(message);
        }, 1500);
    });
}

// Three.js 3D Animation for Home Page
function initThreeJS() {
    // Check if Three.js is available and device is capable
    if (typeof THREE === 'undefined' || window.innerWidth < 768) {
        // Show fallback image on mobile or if Three.js fails
        const heroFallback = document.querySelector('.hero-fallback');
        if (heroFallback) {
            heroFallback.style.display = 'block';
        }
        return;
    }
    
    const container = document.getElementById('three-container');
    if (!container) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance"
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    container.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    scene.add(directionalLight);
    
    // Add a subtle rim light
    const rimLight = new THREE.DirectionalLight(0xfff5e6, 0.3);
    rimLight.position.set(-10, 10, -5);
    scene.add(rimLight);
    
    // Create a simple luxury house model
    function createHouse() {
        const houseGroup = new THREE.Group();
        
        // Main building
        const mainGeometry = new THREE.BoxGeometry(6, 4, 8);
        const mainMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xf0f0f0,
            roughness: 0.2,
            metalness: 0.1
        });
        const mainBuilding = new THREE.Mesh(mainGeometry, mainMaterial);
        mainBuilding.castShadow = true;
        mainBuilding.receiveShadow = true;
        mainBuilding.position.y = 2;
        houseGroup.add(mainBuilding);
        
        // Roof
        const roofGeometry = new THREE.ConeGeometry(4.5, 2, 4);
        const roofMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8b7355,
            roughness: 0.4,
            metalness: 0.05
        });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 5;
        roof.rotation.y = Math.PI / 4;
        roof.castShadow = true;
        houseGroup.add(roof);
        
        // Windows
        const windowMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x87ceeb,
            roughness: 0.1,
            metalness: 0.9,
            transparent: true,
            opacity: 0.7
        });
        
        for (let i = 0; i < 4; i++) {
            const windowGeometry = new THREE.BoxGeometry(0.8, 1.2, 0.1);
            const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
            
            if (i < 2) {
                // Front windows
                windowMesh.position.set(i * 2 - 1, 2.5, 4.05);
            } else {
                // Side windows
                windowMesh.position.set(3.05, 2.5, (i-2) * 3 - 1.5);
                windowMesh.rotation.y = Math.PI / 2;
            }
            
            houseGroup.add(windowMesh);
        }
        
        // Door
        const doorGeometry = new THREE.BoxGeometry(1.5, 2.2, 0.2);
        const doorMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8b4513,
            roughness: 0.6,
            metalness: 0.1
        });
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.set(0, 1.1, 4.05);
        door.castShadow = true;
        houseGroup.add(door);
        
        // Ground plane
        const groundGeometry = new THREE.PlaneGeometry(40, 40);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xcccccc,
            roughness: 0.8,
            metalness: 0.1
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        houseGroup.add(ground);
        
        // Decorative pillars
        const pillarGeometry = new THREE.CylinderGeometry(0.2, 0.2, 4);
        const pillarMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xd4b896,
            roughness: 0.3,
            metalness: 0.3
        });
        
        for (let i = 0; i < 4; i++) {
            const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
            const xPos = i % 2 === 0 ? -2.5 : 2.5;
            const zPos = i < 2 ? -3 : 3;
            pillar.position.set(xPos, 2, zPos);
            pillar.castShadow = true;
            houseGroup.add(pillar);
        }
        
        // Add some decorative elements
        const sphereGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const sphereMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xb19777,
            roughness: 0.4,
            metalness: 0.5
        });
        
        for (let i = 0; i < 6; i++) {
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.position.set(
                (Math.random() - 0.5) * 10,
                0.3,
                (Math.random() - 0.5) * 10
            );
            sphere.castShadow = true;
            houseGroup.add(sphere);
        }
        
        return houseGroup;
    }
    
    const house = createHouse();
    scene.add(house);
    
    // Add floating particles for luxury effect
    function createParticles() {
        const particleCount = 150;
        const particles = new THREE.Group();
        
        for (let i = 0; i < particleCount; i++) {
            const size = Math.random() * 0.05 + 0.01;
            const geometry = new THREE.SphereGeometry(size, 8, 8);
            const material = new THREE.MeshBasicMaterial({ 
                color: 0xfff5e6,
                transparent: true,
                opacity: 0.4
            });
            const particle = new THREE.Mesh(geometry, material);
            
            particle.position.set(
                (Math.random() - 0.5) * 30,
                Math.random() * 15,
                (Math.random() - 0.5) * 30
            );
            
            particles.add(particle);
        }
        
        return particles;
    }
    
    const particles = createParticles();
    scene.add(particles);
    
    // Camera position
    camera.position.set(0, 5, 15);
    
    // Animation variables
    let time = 0;
    let mouseX = 0;
    let mouseY = 0;
    
    // Mouse movement for subtle camera interaction
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = (event.clientY / window.innerHeight) * 2 - 1;
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        time += 0.005;
        
        // Slow camera rotation
        house.rotation.y = time * 0.1;
        
        // Subtle camera movement based on mouse position
        camera.position.x = Math.sin(time * 0.2) * 2 + mouseX * 0.5;
        camera.position.y = 5 + Math.sin(time * 0.3) * 0.5 + mouseY * 0.5;
        camera.lookAt(0, 2, 0);
        
        // Animate particles
        particles.children.forEach((particle, i) => {
            particle.position.y += Math.sin(time + i) * 0.002;
            particle.position.x += Math.cos(time + i * 0.5) * 0.002;
            
            // Keep particles within bounds
            if (particle.position.y > 15) particle.position.y = 0;
            if (particle.position.x > 15) particle.position.x = -15;
        });
        
        renderer.render(scene, camera);
    }
    
    // Handle window resize
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    window.addEventListener('resize', onWindowResize);
    
    // Start animation
    animate();
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Common functionality
    initStatsCounter();
    initContactForm();
    initLoadMore();
    
    // Page-specific functionality will be initialized by page-specific scripts
});

// Add CSS for form errors
const style = document.createElement('style');
style.textContent = `
    .form-group.error input,
    .form-group.error select,
    .form-group.error textarea {
        border-bottom-color: #ff6b6b;
    }
    
    .form-group.error label {
        color: #ff6b6b;
    }
    
    @media (max-width: 768px) {
        .three-container canvas {
            display: none;
        }
        
        .hero-fallback {
            display: block;
        }
    }
`;
document.head.appendChild(style);
