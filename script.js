document.addEventListener('DOMContentLoaded', () => {
    initCanvasAnimation();
    initScrollInteractions();
    initNavHighlighting();
});

/* ==========================================================================
   Canvas Network/Particle Background
   ========================================================================== */
function initCanvasAnimation() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resize);
    resize();
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 0.5;
            this.baseColor = Math.random() > 0.5 ? 'rgba(0, 240, 255, ' : 'rgba(191, 0, 255, ';
            this.alpha = Math.random() * 0.5 + 0.1;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.baseColor + this.alpha + ')';
            ctx.fill();
        }
    }
    
    // Create particles
    const particleCount = Math.min(Math.floor(window.innerWidth / 15), 100);
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        
        // Update and draw particles
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

/* ==========================================================================
   Scroll Interactions (Reveals & Parallax)
   ========================================================================== */
function initScrollInteractions() {
    // 1. Intersection Observer for Reveals
    const revealElements = document.querySelectorAll('.fade-up, .fade-in, .floating-profile-card');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only reveal once
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
    
    // 2. Parallax Effect on Scroll
    const parallaxElements = document.querySelectorAll('[data-speed]');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        // Only do parallax on desktop for better mobile performance
        if (window.innerWidth > 768) {
            parallaxElements.forEach(el => {
                const speed = parseFloat(el.getAttribute('data-speed'));
                // calculate offset
                const yPos = -(scrolled * speed);
                
                // Use requestAnimationFrame in production, but direct transform works for modern simple sites
                el.style.transform = `translateY(${yPos}px)`;
            });
        } else {
            // Reset transforms on mobile
            parallaxElements.forEach(el => {
                el.style.transform = 'none';
            });
        }
    });
}

/* ==========================================================================
   Navigation Highlighting based on Scroll Section
   ========================================================================== */
function initNavHighlighting() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    const dockLinks = document.querySelectorAll('.dock-item');
    
    if (sections.length === 0) return;
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // When user scrolls past 1/3rd of the section height
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });
        
        // Update Top Nav
        navLinks.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === `#${current}`) {
                a.classList.add('active');
            }
        });
        
        // Update Dock
        dockLinks.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === `#${current}`) {
                a.classList.add('active');
            }
        });
    });
}
