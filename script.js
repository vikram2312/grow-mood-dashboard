document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       THEME SWITCHER
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check local storage or system preferences
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && !systemPrefersDark)) {
        setLightTheme();
    } else {
        setDarkTheme();
    }
    
    themeToggleBtn.addEventListener('click', () => {
        if (document.body.classList.contains('dark-theme')) {
            setLightTheme();
        } else {
            setDarkTheme();
        }
    });
    
    function setLightTheme() {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        themeIcon.className = 'fa-solid fa-sun';
        localStorage.setItem('theme', 'light');
    }
    
    function setDarkTheme() {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        themeIcon.className = 'fa-solid fa-moon';
        localStorage.setItem('theme', 'dark');
    }

    /* ==========================================================================
       MOBILE MENU TOGGLE
       ========================================================================== */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navbar.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navbar.classList.remove('active');
        });
    });

    /* ==========================================================================
       ACTIVE NAV SPY (SCROLLSPY)
       ========================================================================== */
    const sections = document.querySelectorAll('section');
    
    function scrollSpy() {
        const scrollPosition = window.scrollY + 120; // offset for fixed header
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', scrollSpy);

    /* ==========================================================================
       PROGRESS BAR ANIMATION (INTERSECTION OBSERVER)
       ========================================================================== */
    const progressBars = document.querySelectorAll('.progress-fill');
    
    // Reset width to 0 initial state for animation
    progressBars.forEach(bar => {
        const targetWidth = bar.style.width;
        bar.setAttribute('data-target-width', targetWidth);
        bar.style.width = '0%';
    });
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const barObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                const finalWidth = fill.getAttribute('data-target-width');
                fill.style.width = finalWidth;
                observer.unobserve(fill);
            }
        });
    }, observerOptions);
    
    progressBars.forEach(bar => barObserver.observe(bar));

    /* ==========================================================================
       AR VIEWPORT SIMULATOR
       ========================================================================== */
    const simButtons = document.querySelectorAll('.btn-sim');
    const simBgImg = document.getElementById('sim-view-bg');
    const hudOverlay = document.getElementById('hud-overlay');
    const hudModeTag = document.getElementById('hud-mode-tag');
    const holoTitle = document.getElementById('holo-title');
    const holoDesc = document.getElementById('holo-desc');
    const hudZoom = document.getElementById('hud-zoom');
    
    const simModes = {
        space: {
            bg: 'assets/arvr_concept.png',
            tag: 'MODE: SPACE EXPLORATION',
            title: 'Solar System AR',
            desc: 'Target: Saturn. Distance: 1.4B km. Rings composition: Water ice particles with rocky debris.',
            zoom: 'Zoom: 1.0x',
            hudColor: '#06b6d4',
            bgOpacity: '0.6'
        },
        art: {
            bg: 'assets/artwork.png',
            tag: 'MODE: VIRTUAL ART STUDIO',
            title: '3D Canvas Editor',
            desc: 'Artwork: "Serenade of the Skies". Canvas depth: 15cm. Recommended stroke: Soft Impasto brush.',
            zoom: 'Zoom: 1.5x',
            hudColor: '#d946ef',
            bgOpacity: '0.5'
        },
        anatomy: {
            bg: 'assets/profile.png',
            tag: 'MODE: INTERACTIVE BIOLOGY',
            title: 'Cognitive Mapping',
            desc: 'Subject: Stuti (Creator). Neural state: Focused / Creative. Active process: Designing spatial computing interfaces.',
            zoom: 'Zoom: 2.0x',
            hudColor: '#10b981',
            bgOpacity: '0.45'
        }
    };
    
    simButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active state from all buttons
            simButtons.forEach(b => b.classList.remove('active'));
            // Add active state to clicked button
            btn.classList.add('active');
            
            const modeName = btn.getAttribute('data-mode');
            const data = simModes[modeName];
            
            if (data) {
                // Apply transition fade-out/in effect
                simBgImg.style.opacity = '0';
                hudOverlay.style.opacity = '0.3';
                
                setTimeout(() => {
                    // Update content
                    simBgImg.src = data.bg;
                    simBgImg.style.opacity = data.bgOpacity;
                    hudModeTag.textContent = data.tag;
                    holoTitle.textContent = data.title;
                    holoDesc.textContent = data.desc;
                    hudZoom.textContent = data.zoom;
                    
                    // Update overlay glow color
                    hudOverlay.style.color = data.hudColor;
                    hudOverlay.style.textShadow = `0 0 5px ${data.hudColor}`;
                    const reticle = hudOverlay.querySelector('.reticle');
                    if (reticle) {
                        reticle.style.borderColor = data.hudColor;
                    }
                    const holoCard = hudOverlay.querySelector('.hologram-card');
                    if (holoCard) {
                        holoCard.style.borderColor = data.hudColor;
                        holoCard.style.background = `rgba(${hexToRgb(data.hudColor)}, 0.15)`;
                    }
                    
                    hudOverlay.style.opacity = '1';
                }, 300);
            }
        });
    });
    
    // Helper function to convert hex color to rgb string
    function hexToRgb(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
        
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? 
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` 
            : null;
    }

    /* ==========================================================================
       CONTACT FORM SUBMISSION
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');
    const formSubmitBtn = document.getElementById('form-submit-btn');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('form-name').value.trim();
        const email = document.getElementById('form-email').value.trim();
        const subject = document.getElementById('form-subject').value.trim();
        const message = document.getElementById('form-message').value.trim();
        
        if (!name || !email || !subject || !message) {
            showFeedback('Please fill out all fields.', 'error');
            return;
        }
        
        // Show loading state on button
        const btnText = formSubmitBtn.querySelector('span');
        const btnIcon = formSubmitBtn.querySelector('i');
        const originalText = btnText.textContent;
        const originalIconClass = btnIcon.className;
        
        btnText.textContent = 'Sending...';
        btnIcon.className = 'fa-solid fa-spinner fa-spin';
        formSubmitBtn.disabled = true;
        
        // Mock server latency
        setTimeout(() => {
            showFeedback(`Thank you, ${name}! Your message has been sent successfully to Stuti.`, 'success');
            contactForm.reset();
            
            // Restore button state
            btnText.textContent = originalText;
            btnIcon.className = originalIconClass;
            formSubmitBtn.disabled = false;
        }, 1200);
    });
    
    function showFeedback(msg, type) {
        formFeedback.textContent = msg;
        formFeedback.className = `form-feedback-message ${type}`;
        
        // Scroll feedback message into view if needed
        formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Auto hide message after 5 seconds if success
        if (type === 'success') {
            setTimeout(() => {
                formFeedback.className = 'form-feedback-message hidden';
            }, 6000);
        }
    }
});
