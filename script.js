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

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Parallax effect for elements with data-parallax attribute
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-parallax'));
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Initialize Three.js 3D Scene
function initThreeJS() {
    // Check if Three.js is available and device is capable
    if (typeof THREE === 'undefined' || window.innerWidth < 768) {
        // Show fallback image on mobile or if Three.js fails
        document.querySelector('.hero-fallback').style.display = 'block';
        return;
    }
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    const container = document.getElementById('three-container');
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    scene.add(directionalLight);
    
    // Add a subtle rim light
    const rimLight = new THREE.DirectionalLight(0xfff5e6, 0.3);
    rimLight.position.set(-10, 10, -5);
    scene.add(rimLight);
    
    // Create a simple luxury house model (simplified for performance)
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
        houseGroup.add(mainBuilding);
        
        // Roof
        const roofGeometry = new THREE.ConeGeometry(4.5, 2, 4);
        const roofMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8b7355,
            roughness: 0.4,
            metalness: 0.05
        });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 3;
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
                windowMesh.position.set(i * 2 - 1, 0.5, 4.05);
            } else {
                // Side windows
                windowMesh.position.set(3.05, 0.5, (i-2) * 3 - 1.5);
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
        door.position.set(0, -0.9, 4.05);
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
        ground.position.y = -2.5;
        ground.receiveShadow = true;
        houseGroup.add(ground);
        
        // Decorative elements
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
            pillar.position.set(xPos, 0, zPos);
            pillar.castShadow = true;
            houseGroup.add(pillar);
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
        camera.lookAt(0, 0, 0);
        
        // Animate particles
        particles.children.forEach((particle, i) => {
            particle.position.y += Math.sin(time + i) * 0.002;
            particle.position.x += Math.cos(time + i * 0.5) * 0.002;
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

// Gallery Lightbox
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    let currentIndex = 0;
    
    // Open lightbox
    galleryItems.forEach((item, index) => {
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
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        updateLightbox();
    });
    
    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % galleryItems.length;
        updateLightbox();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        } else if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            updateLightbox();
        } else if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % galleryItems.length;
            updateLightbox();
        }
    });
    
    function updateLightbox() {
        const item = galleryItems[currentIndex];
        const imgSrc = item.querySelector('img').src;
        const title = item.querySelector('h3').textContent;
        const description = item.querySelector('p').textContent;
        
        lightboxImg.src = imgSrc;
        lightboxCaption.querySelector('h3').textContent = title;
        lightboxCaption.querySelector('p').textContent = description;
    }
}

// Testimonials Slider
function initTestimonials() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    
    let currentSlide = 0;
    
    // Show slide
    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = (n + slides.length) % slides.length;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    // Next slide
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    // Previous slide
    function prevSlide() {
        showSlide(currentSlide - 1);
    }
    
    // Event listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });
    
    // Auto slide every 5 seconds
    setInterval(nextSlide, 5000);
}

// Contact Form Validation
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Basic validation
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        
        let isValid = true;
        
        // Reset previous error states
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error');
        });
        
        // Validate name
        if (!name.value.trim()) {
            name.parentElement.classList.add('error');
            isValid = false;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            email.parentElement.classList.add('error');
            isValid = false;
        }
        
        // Validate message
        if (!message.value.trim()) {
            message.parentElement.classList.add('error');
            isValid = false;
        }
        
        if (isValid) {
            // Simulate form submission
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.querySelector('span').textContent;
            
            submitBtn.querySelector('span').textContent = 'Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('Thank you for your message! We will contact you soon to discuss your vision.');
                contactForm.reset();
                submitBtn.querySelector('span').textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        }
    });
}

// Service Card Hover Effects
function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.zIndex = '1';
        });
    });
}

// Smooth Scrolling for Anchor Links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initParallax();
    initThreeJS();
    initGallery();
    initTestimonials();
    initContactForm();
    initServiceCards();
    initSmoothScrolling();
    
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
});
