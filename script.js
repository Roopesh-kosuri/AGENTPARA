/* =============================================
   ROOPESH RAM VARMA KOSURI — PORTFOLIO
   JavaScript: Three.js, GSAP, Terminal, Effects
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ─── LOADING SCREEN + MATRIX RAIN ───
    const loadingScreen = document.getElementById('loading-screen');
    const loadingBarFill = document.getElementById('loading-bar-fill');
    const loadingStatus = document.getElementById('loading-status');
    const loadingText = document.getElementById('loading-text');

    const statusMessages = [
        'Establishing secure connection...',
        'Decrypting personnel files...',
        'Loading neural network modules...',
        'Initializing defense protocols...',
        'Verifying clearance level...',
        'ACCESS GRANTED'
    ];

    // Matrix Rain on loading screen canvas
    function initMatrixRain() {
        const canvas = document.getElementById('matrix-rain');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:<>?/~ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ';
        const fontSize = 12;
        const columns = Math.floor(canvas.width / fontSize);
        const drops = Array(columns).fill(1);

        function drawMatrix() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#00FF41';
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        const matrixInterval = setInterval(drawMatrix, 40);

        // Cleanup after loading
        setTimeout(() => clearInterval(matrixInterval), 4500);
    }

    initMatrixRain();

    // Animate loading progress
    let progress = 0;
    let statusIndex = 0;
    const loadInterval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress > 100) progress = 100;
        loadingBarFill.style.width = progress + '%';

        if (progress > (statusIndex + 1) * (100 / statusMessages.length)) {
            statusIndex = Math.min(statusIndex + 1, statusMessages.length - 1);
            loadingStatus.textContent = statusMessages[statusIndex];
        }

        if (progress >= 100) {
            clearInterval(loadInterval);
            loadingText.innerHTML = 'ACCESS GRANTED';
            loadingText.style.color = '#00FF9F';
            loadingStatus.textContent = 'Welcome, Operative.';
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                document.body.style.overflow = 'auto';
                initGSAPAnimations();
                animateSkillBars();
            }, 800);
        }
    }, 350);

    // Prevent scroll during loading
    document.body.style.overflow = 'hidden';


    // ─── THREE.JS HERO BACKGROUND ───
    function initThreeJS() {
        const canvas = document.getElementById('hero-canvas');
        if (!canvas || typeof THREE === 'undefined') return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Particle System
        const particleCount = 600;
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 14;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 14;
            velocities.push({
                x: (Math.random() - 0.5) * 0.003,
                y: (Math.random() - 0.5) * 0.003,
                z: (Math.random() - 0.5) * 0.003
            });
        }

        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particleMaterial = new THREE.PointsMaterial({
            color: 0x00FF9F,
            size: 0.03,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);

        // Wireframe Icosahedron (globe-like effect)
        const icoGeometry = new THREE.IcosahedronGeometry(2.5, 1);
        const icoMaterial = new THREE.MeshBasicMaterial({
            color: 0x00FF9F,
            wireframe: true,
            transparent: true,
            opacity: 0.08
        });
        const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
        scene.add(icosahedron);

        // Inner wireframe
        const icoGeometry2 = new THREE.IcosahedronGeometry(1.8, 1);
        const icoMaterial2 = new THREE.MeshBasicMaterial({
            color: 0x00FF9F,
            wireframe: true,
            transparent: true,
            opacity: 0.04
        });
        const icosahedron2 = new THREE.Mesh(icoGeometry2, icoMaterial2);
        scene.add(icosahedron2);

        camera.position.z = 5;

        // Mouse tracking
        let mouseX = 0, mouseY = 0;
        let targetMouseX = 0, targetMouseY = 0;

        document.addEventListener('mousemove', (e) => {
            targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        function animate() {
            requestAnimationFrame(animate);

            // Smooth mouse follow
            mouseX += (targetMouseX - mouseX) * 0.05;
            mouseY += (targetMouseY - mouseY) * 0.05;

            // Rotate particles
            particles.rotation.x += 0.0003;
            particles.rotation.y += 0.0005;
            particles.rotation.x += mouseY * 0.0003;
            particles.rotation.y += mouseX * 0.0003;

            // Animate particle positions
            const pos = particleGeometry.attributes.position.array;
            for (let i = 0; i < particleCount; i++) {
                pos[i * 3] += velocities[i].x;
                pos[i * 3 + 1] += velocities[i].y;
                pos[i * 3 + 2] += velocities[i].z;

                // Boundary wrap
                if (Math.abs(pos[i * 3]) > 7) velocities[i].x *= -1;
                if (Math.abs(pos[i * 3 + 1]) > 7) velocities[i].y *= -1;
                if (Math.abs(pos[i * 3 + 2]) > 7) velocities[i].z *= -1;
            }
            particleGeometry.attributes.position.needsUpdate = true;

            // Rotate wireframes
            icosahedron.rotation.x += 0.001;
            icosahedron.rotation.y += 0.002;
            icosahedron.rotation.x += mouseY * 0.001;
            icosahedron.rotation.y += mouseX * 0.001;

            icosahedron2.rotation.x -= 0.0015;
            icosahedron2.rotation.y -= 0.001;

            renderer.render(scene, camera);
        }
        animate();

        // Handle resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    initThreeJS();


    // ─── TYPING EFFECT ───
    function initTypingEffect() {
        const element = document.getElementById('typing-text');
        if (!element) return;

        const phrases = [
            'AI & ML Developer',
            'Game Developer (Fogwatch Project)',
            'Cyber-Themed Builder',
            'Defense Tech Enthusiast',
            'Future Innovator'
        ];

        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 80;

        function type() {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                element.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 40;
            } else {
                element.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 80;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true;
                typeSpeed = 2000; // Pause before deleting
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 500; // Pause before next phrase
            }

            setTimeout(type, typeSpeed);
        }

        type();
    }

    initTypingEffect();


    // ─── NAVIGATION ───
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll behavior - solid nav on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Hamburger toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('open');
    });

    // Nav link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('open');

            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Scroll spy
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 200;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });


    // ─── GSAP SCROLL ANIMATIONS ───
    function initGSAPAnimations() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger);

        // Reveal UP animations
        gsap.utils.toArray('.reveal-up').forEach((el, i) => {
            gsap.fromTo(el, {
                opacity: 0,
                y: 60
            }, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: i * 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Reveal LEFT
        gsap.utils.toArray('.reveal-left').forEach(el => {
            gsap.fromTo(el, {
                opacity: 0,
                x: -60
            }, {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Reveal RIGHT
        gsap.utils.toArray('.reveal-right').forEach(el => {
            gsap.fromTo(el, {
                opacity: 0,
                x: 60
            }, {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Section headers
        gsap.utils.toArray('.section-header').forEach(el => {
            gsap.fromTo(el, { opacity: 0, y: 30 }, {
                opacity: 1, y: 0, duration: 0.6,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Project cards stagger
        gsap.utils.toArray('.project-card').forEach((card, i) => {
            gsap.fromTo(card, {
                opacity: 0,
                y: 50,
                scale: 0.95
            }, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.7,
                delay: i * 0.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Cert cards stagger
        gsap.utils.toArray('.cert-card').forEach((card, i) => {
            gsap.fromTo(card, {
                opacity: 0,
                y: 40,
                rotateX: 10
            }, {
                opacity: 1,
                y: 0,
                rotateX: 0,
                duration: 0.6,
                delay: i * 0.15,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Parallax on hero elements
        gsap.to('.hero-content', {
            y: 100,
            opacity: 0,
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            }
        });

        gsap.to('.radar-container', {
            y: 50,
            opacity: 0,
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: '50% top',
                scrub: 1
            }
        });
    }


    // ─── SKILL BARS ANIMATION ───
    function animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-bar-fill');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.dataset.width;
                    bar.style.width = width + '%';
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.5 });

        skillBars.forEach(bar => observer.observe(bar));
    }


    // ─── RADAR CHART (Canvas) ───
    function drawRadarChart() {
        const canvas = document.getElementById('radar-chart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const dpr = window.devicePixelRatio || 1;
        const size = 400;
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        canvas.style.width = size + 'px';
        canvas.style.height = size + 'px';
        ctx.scale(dpr, dpr);

        const centerX = size / 2;
        const centerY = size / 2;
        const maxRadius = 150;
        const skills = [
            { name: 'Python', value: 0.85 },
            { name: 'AI/ML', value: 0.80 },
            { name: 'Web Dev', value: 0.75 },
            { name: 'Problem\nSolving', value: 0.90 },
            { name: 'Game\nDev', value: 0.45 }
        ];
        const sides = skills.length;
        const angleStep = (2 * Math.PI) / sides;
        const startAngle = -Math.PI / 2; // Start from top

        // Draw grid rings
        for (let ring = 1; ring <= 5; ring++) {
            const r = (maxRadius / 5) * ring;
            ctx.beginPath();
            for (let i = 0; i <= sides; i++) {
                const angle = startAngle + angleStep * i;
                const x = centerX + r * Math.cos(angle);
                const y = centerY + r * Math.sin(angle);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.strokeStyle = 'rgba(0, 255, 159, 0.1)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Draw radial lines
        for (let i = 0; i < sides; i++) {
            const angle = startAngle + angleStep * i;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(
                centerX + maxRadius * Math.cos(angle),
                centerY + maxRadius * Math.sin(angle)
            );
            ctx.strokeStyle = 'rgba(0, 255, 159, 0.1)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Animate the skill polygon
        let animProgress = 0;
        function animateRadar() {
            if (animProgress > 1) animProgress = 1;

            // Clear only the data area
            ctx.save();
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            for (let i = 0; i <= sides; i++) {
                const angle = startAngle + angleStep * i;
                const x = centerX + (maxRadius + 5) * Math.cos(angle);
                const y = centerY + (maxRadius + 5) * Math.sin(angle);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.restore();

            // Redraw grid
            for (let ring = 1; ring <= 5; ring++) {
                const r = (maxRadius / 5) * ring;
                ctx.beginPath();
                for (let i = 0; i <= sides; i++) {
                    const angle = startAngle + angleStep * i;
                    const x = centerX + r * Math.cos(angle);
                    const y = centerY + r * Math.sin(angle);
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.strokeStyle = 'rgba(0, 255, 159, 0.1)';
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            // Redraw radial lines
            for (let i = 0; i < sides; i++) {
                const angle = startAngle + angleStep * i;
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(
                    centerX + maxRadius * Math.cos(angle),
                    centerY + maxRadius * Math.sin(angle)
                );
                ctx.strokeStyle = 'rgba(0, 255, 159, 0.1)';
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            // Draw filled skill area
            ctx.beginPath();
            for (let i = 0; i <= sides; i++) {
                const idx = i % sides;
                const angle = startAngle + angleStep * idx;
                const r = maxRadius * skills[idx].value * animProgress;
                const x = centerX + r * Math.cos(angle);
                const y = centerY + r * Math.sin(angle);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fillStyle = 'rgba(0, 255, 159, 0.15)';
            ctx.fill();
            ctx.strokeStyle = '#00FF9F';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw dots at vertices
            for (let i = 0; i < sides; i++) {
                const angle = startAngle + angleStep * i;
                const r = maxRadius * skills[i].value * animProgress;
                const x = centerX + r * Math.cos(angle);
                const y = centerY + r * Math.sin(angle);

                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fillStyle = '#00FF9F';
                ctx.fill();
                ctx.beginPath();
                ctx.arc(x, y, 6, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(0, 255, 159, 0.4)';
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            // Draw labels
            for (let i = 0; i < sides; i++) {
                const angle = startAngle + angleStep * i;
                const labelR = maxRadius + 25;
                const x = centerX + labelR * Math.cos(angle);
                const y = centerY + labelR * Math.sin(angle);

                ctx.fillStyle = '#c8d6d0';
                ctx.font = '11px "Share Tech Mono", monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                const lines = skills[i].name.split('\n');
                lines.forEach((line, lineIdx) => {
                    ctx.fillText(line, x, y + lineIdx * 14 - (lines.length - 1) * 7);
                });
            }

            if (animProgress < 1) {
                animProgress += 0.025;
                requestAnimationFrame(animateRadar);
            }
        }

        // Start animation when visible
        const radarObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animProgress = 0;
                    animateRadar();
                    radarObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        radarObserver.observe(canvas);
    }

    drawRadarChart();


    // ─── TERMINAL ───
    function initTerminal() {
        const input = document.getElementById('terminal-input');
        const output = document.getElementById('terminal-output');
        const body = document.getElementById('terminal-body');
        if (!input || !output) return;

        const commands = {
            help: () => [
                '<span class="term-green">Available commands:</span>',
                '',
                '  <span class="term-cmd">about</span>      — Who is Roopesh?',
                '  <span class="term-cmd">projects</span>   — View projects',
                '  <span class="term-cmd">skills</span>     — List technical skills',
                '  <span class="term-cmd">social</span>     — Social media links',
                '  <span class="term-cmd">certs</span>      — Certifications',
                '  <span class="term-cmd">whoami</span>     — Identity check',
                '  <span class="term-cmd">date</span>       — Current date/time',
                '  <span class="term-cmd">ls</span>         — List files',
                '  <span class="term-cmd">hack</span>       — ??? (try it)',
                '  <span class="term-cmd">clear</span>      — Clear terminal',
                ''
            ],

            about: () => [
                '<span class="term-green">╔══════════════════════════════════════╗</span>',
                '<span class="term-green">║       OPERATIVE DOSSIER             ║</span>',
                '<span class="term-green">╚══════════════════════════════════════╝</span>',
                '',
                '  Name     : Roopesh Ram Varma Kosuri',
                '  Role     : AI & ML Developer',
                '  Base     : Lovely Professional University, India',
                '  Degree   : B.Tech in AI & ML',
                '  Passions : AI, Aviation, Defense Tech, Gaming',
                '  Status   : <span class="term-green">ACTIVE</span>',
                ''
            ],

            projects: () => [
                '<span class="term-green">[1]</span> AI Criminal Face Detection  <span class="term-dim">— IN DEV</span>',
                '    Intelligent surveillance using facial recognition',
                '',
                '<span class="term-green">[2]</span> Personal AI Assistant       <span class="term-dim">— IN DEV</span>',
                '    Jarvis-style cross-platform assistant',
                '',
                '<span class="term-green">[3]</span> FOGWATCH Game               <span class="term-green">— DEPLOYED</span>',
                '    Survival horror with lighthouse defense mechanics',
                '    <span class="term-cyan">→ https://roopesh-kosuri.github.io/FOGWATCH-website/</span>',
                ''
            ],

            skills: () => [
                '<span class="term-green">Technical Skills:</span>',
                '',
                '  Python          ████████████████░░░░ 85%',
                '  AI/ML           ████████████████░░░░ 80%',
                '  Web Development ███████████████░░░░░ 75%',
                '  Problem Solving █████████████████░░░ 90%',
                '  Game Dev        █████████░░░░░░░░░░░ 45%',
                ''
            ],

            social: () => [
                '<span class="term-green">Secure Communication Channels:</span>',
                '',
                '  <span class="term-cyan">GitHub</span>    → github.com/Roopesh-kosuri',
                '  <span class="term-cyan">LinkedIn</span>  → linkedin.com/in/roopesh-ram-varma-kosuri-28186a37b',
                '  <span class="term-cyan">Instagram</span> → instagram.com/ram.air747',
                ''
            ],

            certs: () => [
                '<span class="term-green">Certifications:</span>',
                '',
                '  <span class="term-green">✓</span> Google Prompt Engineering     <span class="term-green">[COMPLETED]</span>',
                '  <span class="term-green">✓</span> IBM Cloud Computing           <span class="term-green">[COMPLETED]</span>',
                '  <span class="term-dim">◷</span> AWS Certification             <span class="term-dim">[IN PROGRESS]</span>',
                '  <span class="term-dim">◷</span> Microsoft Azure               <span class="term-dim">[IN PROGRESS]</span>',
                ''
            ],

            whoami: () => [
                '<span class="term-green">roopesh_kosuri</span> — Clearance Level: ALPHA',
                'AI Developer | Defense Tech Enthusiast',
                ''
            ],

            date: () => {
                const now = new Date();
                return [
                    `<span class="term-green">${now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>`,
                    `${now.toLocaleTimeString()} — System uptime: ∞`,
                    ''
                ];
            },

            ls: () => [
                '<span class="term-green">drwxr-xr-x</span>  about/',
                '<span class="term-green">drwxr-xr-x</span>  projects/',
                '<span class="term-green">drwxr-xr-x</span>  skills/',
                '<span class="term-green">drwxr-xr-x</span>  certifications/',
                '<span class="term-dim">-rw-r--r--</span>  classified.enc',
                '<span class="term-dim">-rw-r--r--</span>  neural_network.py',
                '<span class="term-dim">-rw-r--r--</span>  defense_protocol.sh',
                ''
            ],

            hack: () => {
                // Easter egg: fake hack sequence
                const lines = [
                    '<span class="term-red">⚠ INITIATING BREACH PROTOCOL...</span>',
                    '',
                    '<span class="term-dim">Scanning network... 192.168.1.x</span>',
                    '<span class="term-dim">Port 22 [SSH] ............ OPEN</span>',
                    '<span class="term-dim">Port 80 [HTTP] ........... OPEN</span>',
                    '<span class="term-dim">Port 443 [HTTPS] ......... OPEN</span>',
                    '<span class="term-dim">Port 3306 [MySQL] ........ FILTERED</span>',
                    '',
                    '<span class="term-dim">Bypassing firewall... ████████████ 100%</span>',
                    '<span class="term-dim">Injecting payload... ████████████ 100%</span>',
                    '<span class="term-dim">Extracting data...</span>',
                    '',
                    '<span class="term-green">████████████████████████████████████████</span>',
                    '<span class="term-green">█                                      █</span>',
                    '<span class="term-green">█   JUST KIDDING! 😄                   █</span>',
                    '<span class="term-green">█   This is a portfolio, not a shell.   █</span>',
                    '<span class="term-green">█   But thanks for the curiosity!       █</span>',
                    '<span class="term-green">█                                      █</span>',
                    '<span class="term-green">████████████████████████████████████████</span>',
                    ''
                ];
                return lines;
            },

            clear: () => {
                output.innerHTML = '';
                return [];
            }
        };

        function addLine(html) {
            const line = document.createElement('div');
            line.className = 'terminal-line';
            line.innerHTML = html;
            output.appendChild(line);
        }

        function processCommand(cmd) {
            const trimmed = cmd.trim().toLowerCase();

            // Echo the command
            addLine(`<span class="term-green">rrv@portfolio:~$</span> ${cmd}`);

            if (trimmed === '') {
                addLine('');
                return;
            }

            if (commands[trimmed]) {
                const result = commands[trimmed]();
                if (trimmed === 'hack') {
                    // Animate hack output line by line
                    result.forEach((line, i) => {
                        setTimeout(() => {
                            addLine(line);
                            output.scrollTop = output.scrollHeight;
                        }, i * 200);
                    });
                    return;
                }
                result.forEach(line => addLine(line));
            } else {
                addLine(`<span class="term-red">Command not found:</span> ${trimmed}`);
                addLine('Type <span class="term-cmd">help</span> for available commands.');
                addLine('');
            }

            output.scrollTop = output.scrollHeight;
        }

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                processCommand(input.value);
                input.value = '';
            }
        });

        // Focus terminal when clicking anywhere in it
        body.addEventListener('click', () => input.focus());
    }

    initTerminal();


    // ─── MOUSE PARALLAX ON HERO ───
    function initMouseParallax() {
        const hero = document.getElementById('hero');
        const heroContent = document.querySelector('.hero-content');
        const radar = document.querySelector('.radar-container');

        if (!hero || !heroContent) return;

        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            heroContent.style.transform = `translate(${x * 15}px, ${y * 15}px)`;
            if (radar) {
                radar.style.transform = `translate(${x * -10}px, ${y * -10}px)`;
            }
        });

        hero.addEventListener('mouseleave', () => {
            heroContent.style.transform = 'translate(0, 0)';
            if (radar) radar.style.transform = 'translate(0, 0)';
        });
    }

    initMouseParallax();


    // ─── GLITCH EFFECT TRIGGER ───
    function initGlitchTrigger() {
        const glitchElements = document.querySelectorAll('.glitch');

        setInterval(() => {
            glitchElements.forEach(el => {
                el.style.animation = 'none';
                el.offsetHeight; // Force reflow
                el.style.animation = '';
            });
        }, 5000);
    }

    initGlitchTrigger();


    // ─── 3D CARD TILT EFFECT ───
    function initTiltCards() {
        const tiltCards = document.querySelectorAll('.tilt-card');

        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -8;
                const rotateY = ((x - centerX) / centerX) * 8;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            });
        });
    }

    initTiltCards();


    // ─── ANIMATED COUNTERS ───
    function initCounters() {
        const counters = document.querySelectorAll('.counter-value');
        let animated = false;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    counters.forEach(counter => {
                        const target = parseInt(counter.dataset.target);
                        const duration = 2000;
                        const startTime = performance.now();

                        function updateCounter(currentTime) {
                            const elapsed = currentTime - startTime;
                            const progress = Math.min(elapsed / duration, 1);
                            // Ease out cubic
                            const eased = 1 - Math.pow(1 - progress, 3);
                            const current = Math.floor(eased * target);

                            counter.textContent = current.toLocaleString();

                            if (progress < 1) {
                                requestAnimationFrame(updateCounter);
                            } else {
                                counter.textContent = target.toLocaleString();
                                // Add a "+" symbol for large numbers
                                if (target >= 100) {
                                    counter.textContent = target.toLocaleString() + '+';
                                }
                            }
                        }

                        requestAnimationFrame(updateCounter);
                    });
                    observer.disconnect();
                }
            });
        }, { threshold: 0.5 });

        const counterRow = document.querySelector('.counter-row');
        if (counterRow) observer.observe(counterRow);
    }

    initCounters();


    // ─── MOUSE TRAIL EFFECT ───
    function initMouseTrail() {
        const canvas = document.getElementById('mouse-trail');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const trail = [];
        const maxTrailLength = 25;
        let mouseX = 0, mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            trail.push({ x: mouseX, y: mouseY, alpha: 1 });
            if (trail.length > maxTrailLength) trail.shift();

            for (let i = 0; i < trail.length; i++) {
                const point = trail[i];
                const ratio = i / trail.length;
                const size = ratio * 3;
                const alpha = ratio * 0.4;

                ctx.beginPath();
                ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 255, 159, ${alpha})`;
                ctx.fill();
            }

            requestAnimationFrame(animate);
        }

        animate();

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    initMouseTrail();


    // ─── TRAIT BAR ANIMATION ───
    function initTraitBars() {
        const traitBars = document.querySelectorAll('.trait-bar');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.dataset.width;
                    bar.style.width = width + '%';
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.5 });

        traitBars.forEach(bar => observer.observe(bar));
    }

    initTraitBars();


    // ─── ENHANCED GSAP FOR NEW SECTIONS ───
    function initNewSectionAnimations() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        // Intel cards
        gsap.utils.toArray('.intel-card').forEach((card, i) => {
            gsap.fromTo(card, {
                opacity: 0,
                x: i % 2 === 0 ? -60 : 60
            }, {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // AI domain cards stagger
        gsap.utils.toArray('.ai-domain-card').forEach((card, i) => {
            gsap.fromTo(card, {
                opacity: 0,
                y: 60,
                scale: 0.9
            }, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.7,
                delay: i * 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Vision block
        gsap.utils.toArray('.vision-block').forEach(el => {
            gsap.fromTo(el, {
                opacity: 0,
                y: 40,
                scale: 0.98
            }, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Vision area tags
        gsap.utils.toArray('.vision-area').forEach((tag, i) => {
            gsap.fromTo(tag, {
                opacity: 0,
                y: 20,
                scale: 0.8
            }, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.5,
                delay: i * 0.1,
                ease: 'back.out(1.5)',
                scrollTrigger: {
                    trigger: tag,
                    start: 'top 95%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Tech stack items
        gsap.utils.toArray('.tech-item').forEach((item, i) => {
            gsap.fromTo(item, {
                opacity: 0,
                y: 30,
                rotateY: 20
            }, {
                opacity: 1,
                y: 0,
                rotateY: 0,
                duration: 0.5,
                delay: i * 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Counter row
        gsap.utils.toArray('.counter-item').forEach((item, i) => {
            gsap.fromTo(item, {
                opacity: 0,
                y: 40,
                scale: 0.9
            }, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                delay: i * 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Threat dashboard
        const dashboard = document.querySelector('.threat-dashboard');
        if (dashboard) {
            gsap.fromTo(dashboard, {
                opacity: 0,
                y: 30,
                scaleX: 0.95
            }, {
                opacity: 1,
                y: 0,
                scaleX: 1,
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: dashboard,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        }

        // Learning block
        const learningBlock = document.querySelector('.learning-block');
        if (learningBlock) {
            gsap.fromTo(learningBlock, {
                opacity: 0,
                y: 50
            }, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: learningBlock,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        }

        // HUD text boxes
        gsap.utils.toArray('.hud-text-box').forEach(el => {
            gsap.fromTo(el, {
                opacity: 0,
                scaleX: 0.9
            }, {
                opacity: 1,
                scaleX: 1,
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });
    }

    // Call after loading screen dismisses (inside the existing loading callback)
    // We also call it here in case loading is already done
    setTimeout(initNewSectionAnimations, 4500);

});
