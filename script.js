// ========== PARTICLES ANIMATION ==========
class ParticlesAnimation {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 100;
        this.mouse = { x: null, y: null, radius: 150 };
        
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });

        this.createParticles();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = document.documentElement.scrollHeight;
    }

    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: Math.random() * 1 - 0.5,
                speedY: Math.random() * 1 - 0.5,
                color: `hsl(${Math.random() * 60 + 180}, 70%, 60%)`
            });
        }
    }

    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((particle, index) => {
            // Draw particle
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();

            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Bounce off edges
            if (particle.x > this.canvas.width || particle.x < 0) {
                particle.speedX *= -1;
            }
            if (particle.y > this.canvas.height || particle.y < 0) {
                particle.speedY *= -1;
            }

            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.mouse.radius) {
                const angle = Math.atan2(dy, dx);
                const force = (this.mouse.radius - distance) / this.mouse.radius;
                particle.x -= Math.cos(angle) * force * 2;
                particle.y -= Math.sin(angle) * force * 2;
            }

            // Draw connections
            for (let j = index + 1; j < this.particles.length; j++) {
                const other = this.particles[j];
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    this.ctx.strokeStyle = `rgba(56, 189, 248, ${1 - distance / 100})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.stroke();
                }
            }
        });
    }

    animate() {
        this.drawParticles();
        requestAnimationFrame(() => this.animate());
    }
}

// ========== TYPING ANIMATION ==========
class TypingAnimation {
    constructor(element, texts, typingSpeed = 100, deletingSpeed = 50, delay = 2000) {
        this.element = element;
        this.texts = texts;
        this.typingSpeed = typingSpeed;
        this.deletingSpeed = deletingSpeed;
        this.delay = delay;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;

        this.type();
    }

    type() {
        const currentText = this.texts[this.textIndex];

        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let speed = this.isDeleting ? this.deletingSpeed : this.typingSpeed;

        if (!this.isDeleting && this.charIndex === currentText.length) {
            speed = this.delay;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            speed = 500;
        }

        setTimeout(() => this.type(), speed);
    }
}

// ========== SCROLL ANIMATIONS ==========
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.animate-on-scroll');
        this.init();
    }

    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, { threshold: 0.1 });

        this.elements.forEach(el => this.observer.observe(el));
    }
}

// ========== SKILL BARS ANIMATION ==========
class SkillBarsAnimation {
    constructor() {
        this.skillBars = document.querySelectorAll('.skill-progress');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progress = entry.target.dataset.progress;
                    entry.target.style.width = progress + '%';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.skillBars.forEach(bar => observer.observe(bar));
    }
}

// ========== COUNTER ANIMATION ==========
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.target);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    }
}

// ========== THEME TOGGLE ==========
class ThemeToggle {
    constructor() {
        this.button = document.getElementById('theme-toggle');
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.button.addEventListener('click', () => this.toggle());
    }

    toggle() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }

    applyTheme(theme) {
        if (theme === 'light') {
            document.body.classList.add('light-theme');
            this.button.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            document.body.classList.remove('light-theme');
            this.button.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }
}

// ========== SMOOTH SCROLL ==========
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ========== PARALLAX EFFECT ==========
class ParallaxEffect {
    constructor() {
        this.header = document.getElementById('header');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            if (this.header) {
                this.header.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });
    }
}

// ========== CURSOR EFFECT ==========
class CursorEffect {
    constructor() {
        this.cursor = this.createCursor();
        this.cursorFollower = this.createCursorFollower();
        this.init();
    }

    createCursor() {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: var(--primary);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: difference;
            transition: transform 0.1s ease;
        `;
        document.body.appendChild(cursor);
        return cursor;
    }

    createCursorFollower() {
        const follower = document.createElement('div');
        follower.className = 'cursor-follower';
        follower.style.cssText = `
            position: fixed;
            width: 40px;
            height: 40px;
            border: 2px solid var(--primary);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            transition: all 0.15s ease;
            opacity: 0.5;
        `;
        document.body.appendChild(follower);
        return follower;
    }

    init() {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            this.cursor.style.left = mouseX + 'px';
            this.cursor.style.top = mouseY + 'px';
        });

        const followCursor = () => {
            const dx = mouseX - followerX;
            const dy = mouseY - followerY;
            followerX += dx * 0.1;
            followerY += dy * 0.1;
            this.cursorFollower.style.left = (followerX - 20) + 'px';
            this.cursorFollower.style.top = (followerY - 20) + 'px';
            requestAnimationFrame(followCursor);
        };
        followCursor();

        // Hover effects
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .sidebar-section');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.style.transform = 'scale(2)';
                this.cursorFollower.style.transform = 'scale(1.5)';
            });
            el.addEventListener('mouseleave', () => {
                this.cursor.style.transform = 'scale(1)';
                this.cursorFollower.style.transform = 'scale(1)';
            });
        });
    }
}

// ========== TILT EFFECT FOR CARDS ==========
class TiltEffect {
    constructor() {
        this.cards = document.querySelectorAll('.project-card, .stat-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }
}

// ========== INITIALIZE ALL ==========
document.addEventListener('DOMContentLoaded', () => {
    // Initialize particles
    new ParticlesAnimation();

    // Initialize typing animation
    const typingTexts = [
        'Étudiant en Cybersécurité 🛡️',
        'Ethical Hacker 💻',
        'CTF Player 🚩',
        'Security Enthusiast 🔐',
        'Future Pentester 🎯'
    ];
    const typingElement = document.getElementById('typing-text');
    new TypingAnimation(typingElement, typingTexts);

    // Initialize scroll animations
    new ScrollAnimations();

    // Initialize skill bars
    new SkillBarsAnimation();

    // Initialize counters
    new CounterAnimation();

    // Initialize theme toggle
    new ThemeToggle();

    // Initialize smooth scroll
    new SmoothScroll();

    // Initialize parallax
    new ParallaxEffect();

    // Initialize cursor effect (only on desktop)
    if (window.innerWidth > 768) {
        new CursorEffect();
    }

    // Initialize tilt effect
    new TiltEffect();

    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ========== RESIZE CANVAS ON SCROLL ==========
let resizeTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const canvas = document.getElementById('particles-canvas');
        canvas.height = document.documentElement.scrollHeight;
    }, 250);
});

// ========== EASTER EGG: KONAMI CODE ==========
let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    // Create confetti effect
    for (let i = 0; i < 100; i++) {
        createConfetti();
    }
    
    // Show message
    const message = document.createElement('div');
    message.textContent = '🎉 You found the secret! 🎉';
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 3em;
        color: var(--primary);
        z-index: 10000;
        text-shadow: 0 0 20px var(--glow);
        animation: fadeInUp 1s ease;
    `;
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
}

function createConfetti() {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: hsl(${Math.random() * 360}, 70%, 60%);
        top: -10px;
        left: ${Math.random() * 100}%;
        z-index: 9999;
        border-radius: 50%;
    `;
    document.body.appendChild(confetti);
    
    const duration = Math.random() * 3 + 2;
    const rotation = Math.random() * 360;
    
    confetti.animate([
        { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
        { transform: `translateY(${window.innerHeight}px) rotate(${rotation}deg)`, opacity: 0 }
    ], {
        duration: duration * 1000,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });
    
    setTimeout(() => {
        confetti.remove();
    }, duration * 1000);
}

// ========== MINI GAME: HACK THE SYSTEM ==========
class HackTheSystemGame {
    constructor() {
        this.board = document.getElementById('game-board');
        this.scoreDisplay = document.getElementById('game-score');
        this.levelDisplay = document.getElementById('game-level');
        this.timeDisplay = document.getElementById('game-time');
        this.messageDisplay = document.getElementById('game-message');
        this.highScoreDisplay = document.getElementById('high-score');
        this.startBtn = document.getElementById('start-game');
        this.resetBtn = document.getElementById('reset-game');
        
        this.score = 0;
        this.level = 1;
        this.time = 60;
        this.isPlaying = false;
        this.timer = null;
        this.numbers = [];
        
        this.highScore = localStorage.getItem('hackGameHighScore') || 0;
        this.highScoreDisplay.textContent = this.highScore;
        
        this.init();
    }
    
    init() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.resetBtn.addEventListener('click', () => this.resetGame());
    }
    
    isPrime(num) {
        if (num < 2) return false;
        if (num === 2) return true;
        if (num % 2 === 0) return false;
        for (let i = 3; i <= Math.sqrt(num); i += 2) {
            if (num % i === 0) return false;
        }
        return true;
    }
    
    generateNumbers() {
        this.numbers = [];
        const count = 5 + this.level * 3; // Plus de nombres avec le niveau
        const max = 30 + this.level * 10; // Nombres plus grands avec le niveau
        
        // Générer des nombres aléatoires
        for (let i = 0; i < count; i++) {
            this.numbers.push(Math.floor(Math.random() * max) + 1);
        }
        
        // S'assurer qu'il y a au moins quelques nombres premiers
        const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
        const primesToAdd = Math.min(3, count - this.numbers.length);
        for (let i = 0; i < primesToAdd; i++) {
            const prime = primes[Math.floor(Math.random() * primes.length)];
            if (!this.numbers.includes(prime)) {
                this.numbers[Math.floor(Math.random() * this.numbers.length)] = prime;
            }
        }
    }
    
    renderBoard() {
        this.board.innerHTML = '';
        this.numbers.forEach(num => {
            const tile = document.createElement('div');
            tile.className = 'game-tile';
            tile.innerHTML = `<span>${num}</span>`;
            tile.dataset.number = num;
            tile.dataset.isPrime = this.isPrime(num);
            
            tile.addEventListener('click', () => this.handleTileClick(tile));
            this.board.appendChild(tile);
        });
    }
    
    handleTileClick(tile) {
        if (!this.isPlaying || tile.classList.contains('correct') || tile.classList.contains('disabled')) {
            return;
        }
        
        const num = parseInt(tile.dataset.number);
        const isPrime = tile.dataset.isPrime === 'true';
        
        if (isPrime) {
            // Correct!
            tile.classList.add('correct');
            this.score += 10 * this.level;
            this.scoreDisplay.textContent = this.score;
            this.showMessage('✓ Correct! +' + (10 * this.level), 'success');
            
            // Vérifier si tous les nombres premiers sont trouvés
            const allPrimes = Array.from(this.board.querySelectorAll('.game-tile')).filter(t => t.dataset.isPrime === 'true');
            const foundPrimes = Array.from(this.board.querySelectorAll('.game-tile.correct'));
            
            if (allPrimes.length === foundPrimes.length) {
                this.levelUp();
            }
        } else {
            // Wrong!
            tile.classList.add('wrong');
            this.score = Math.max(0, this.score - 5);
            this.scoreDisplay.textContent = this.score;
            this.showMessage('✗ Pas un nombre premier! -5', 'error');
            
            setTimeout(() => {
                tile.classList.remove('wrong');
            }, 500);
        }
    }
    
    levelUp() {
        this.level++;
        this.levelDisplay.textContent = this.level;
        this.time += 10; // Bonus de temps
        this.showMessage(`🎉 Niveau ${this.level}! +10s bonus`, 'success');
        
        setTimeout(() => {
            this.generateNumbers();
            this.renderBoard();
        }, 1500);
    }
    
    startGame() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.score = 0;
        this.level = 1;
        this.time = 60;
        
        this.scoreDisplay.textContent = this.score;
        this.levelDisplay.textContent = this.level;
        this.timeDisplay.textContent = this.time;
        this.messageDisplay.textContent = '';
        
        this.generateNumbers();
        this.renderBoard();
        
        this.timer = setInterval(() => {
            this.time--;
            this.timeDisplay.textContent = this.time;
            
            if (this.time <= 0) {
                this.endGame();
            }
        }, 1000);
    }
    
    endGame() {
        this.isPlaying = false;
        clearInterval(this.timer);
        
        // Désactiver toutes les tuiles
        Array.from(this.board.querySelectorAll('.game-tile')).forEach(tile => {
            tile.classList.add('disabled');
        });
        
        // Vérifier le meilleur score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('hackGameHighScore', this.highScore);
            this.highScoreDisplay.textContent = this.highScore;
            this.showMessage(`🏆 Nouveau record! Score final: ${this.score}`, 'success');
        } else {
            this.showMessage(`⏱️ Temps écoulé! Score final: ${this.score}`, 'error');
        }
    }
    
    resetGame() {
        clearInterval(this.timer);
        this.isPlaying = false;
        this.score = 0;
        this.level = 1;
        this.time = 60;
        
        this.scoreDisplay.textContent = this.score;
        this.levelDisplay.textContent = this.level;
        this.timeDisplay.textContent = this.time;
        this.messageDisplay.textContent = '';
        this.board.innerHTML = '';
    }
    
    showMessage(text, type) {
        this.messageDisplay.textContent = text;
        this.messageDisplay.className = 'game-message ' + type;
        
        setTimeout(() => {
            this.messageDisplay.textContent = '';
            this.messageDisplay.className = 'game-message';
        }, 2000);
    }
}

// Initialize game
let hackGame;
setTimeout(() => {
    if (document.getElementById('game-board')) {
        hackGame = new HackTheSystemGame();
    }
}, 500);

// ========== TERMINAL INTERACTIF ==========
class InteractiveTerminal {
    constructor() {
        this.output = document.getElementById('terminal-output');
        this.input = document.getElementById('terminal-input');
        this.commands = {
            help: 'Liste des commandes disponibles',
            about: 'À propos de Matys',
            skills: 'Compétences techniques',
            projects: 'Projets réalisés',
            osint: 'Expertise OSINT',
            ctf: 'Expérience CTF',
            contact: 'Informations de contact',
            clear: 'Efface le terminal',
            whoami: 'Qui suis-je?',
            ls: 'Liste les fichiers',
            cat: 'Affiche un fichier',
            nmap: 'Scan de ports (simulé)',
            hack: 'Mode hacker',
            matrix: 'Effet Matrix',
            secret: 'Révèle un secret'
        };
        
        this.init();
    }
    
    init() {
        if (!this.input) return;
        
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const command = this.input.value.trim();
                if (command) {
                    this.executeCommand(command);
                    this.input.value = '';
                }
            }
        });
        
        this.input.focus();
    }
    
    executeCommand(cmd) {
        this.addLine(`matys@kali:~$`, cmd, 'prompt');
        
        const parts = cmd.split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        switch(command) {
            case 'help':
                this.showHelp();
                break;
            case 'about':
                this.showAbout();
                break;
            case 'skills':
                this.showSkills();
                break;
            case 'projects':
                this.showProjects();
                break;
            case 'osint':
                this.showOsint();
                break;
            case 'ctf':
                this.showCTF();
                break;
            case 'contact':
                this.showContact();
                break;
            case 'clear':
                this.clearTerminal();
                break;
            case 'whoami':
                this.addLine('', 'Matys - Étudiant en Cybersécurité | OSINT Master | CTF Player', 'success');
                break;
            case 'ls':
                this.addLine('', 'cv.pdf  projets/  certifications/  osint-tools/', 'text');
                break;
            case 'cat':
                if (args[0]) {
                    this.addLine('', `Lecture de ${args[0]}...`, 'text');
                    this.addLine('', 'Fichier non trouvé. Essayez "cat cv.pdf"', 'error');
                } else {
                    this.addLine('', 'Usage: cat <fichier>', 'error');
                }
                break;
            case 'nmap':
                this.simulateNmap();
                break;
            case 'hack':
                this.hackMode();
                break;
            case 'matrix':
                this.matrixEffect();
                break;
            case 'secret':
                this.revealSecret();
                break;
            default:
                this.addLine('', `Commande non trouvée: ${command}. Tapez 'help' pour la liste des commandes.`, 'error');
        }
        
        this.scrollToBottom();
    }
    
    addLine(prompt, text, type = 'text') {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        
        if (prompt) {
            const promptSpan = document.createElement('span');
            promptSpan.className = 'terminal-prompt';
            promptSpan.textContent = prompt + ' ';
            line.appendChild(promptSpan);
        }
        
        const textSpan = document.createElement('span');
        textSpan.className = `terminal-${type}`;
        textSpan.textContent = text;
        line.appendChild(textSpan);
        
        this.output.appendChild(line);
    }
    
    showHelp() {
        this.addLine('', '=== COMMANDES DISPONIBLES ===', 'success');
        Object.entries(this.commands).forEach(([cmd, desc]) => {
            this.addLine('', `  ${cmd.padEnd(15)} - ${desc}`, 'text');
        });
    }
    
    showAbout() {
        this.addLine('', 'Matys MANCEL', 'success');
        this.addLine('', '📚 Étudiant 1ère année - Guardia Cybersecurity School', 'text');
        this.addLine('', '🛡️ Passionné de cybersécurité, OSINT et CTF', 'text');
        this.addLine('', '🔍 Expert en Open Source Intelligence', 'text');
        this.addLine('', '🎮 Gamer & Développeur', 'text');
        this.addLine('', '🚀 Fasciné par l\'astronomie', 'text');
    }
    
    showSkills() {
        this.addLine('', '=== COMPÉTENCES TECHNIQUES ===', 'success');
        this.addLine('', '• Cybersécurité (85%)', 'text');
        this.addLine('', '• OSINT (88%)', 'text');
        this.addLine('', '• Linux / Windows (80%)', 'text');
        this.addLine('', '• Réseaux & Protocoles (75%)', 'text');
        this.addLine('', '• Python / Bash (90%)', 'text');
        this.addLine('', '• Outils: Nmap, Wireshark, Burp Suite, Metasploit', 'text');
    }
    
    showProjects() {
        this.addLine('', '=== PROJETS RÉALISÉS ===', 'success');
        this.addLine('', '1. Home Lab de cybersécurité (5 VMs)', 'text');
        this.addLine('', '2. CTF - TryHackMe & HackTheBox (Top 15%)', 'text');
        this.addLine('', '3. Projets Arduino & IoT', 'text');
        this.addLine('', '4. Développement jeux Python/Pygame', 'text');
        this.addLine('', '5. Observation astronomique', 'text');
    }
    
    showOsint() {
        this.addLine('', '=== EXPERTISE OSINT ===', 'success');
        this.addLine('', '• GEOINT - Géolocalisation & analyse satellite', 'text');
        this.addLine('', '• SOCMINT - Analyse réseaux sociaux', 'text');
        this.addLine('', '• WEBINT - Recherche web & Google Dorks', 'text');
        this.addLine('', '• Outils: Maltego, TheHarvester, Shodan, Recon-ng', 'text');
    }
    
    showCTF() {
        this.addLine('', '=== EXPÉRIENCE CTF ===', 'success');
        this.addLine('', '🏆 50+ challenges résolus', 'text');
        this.addLine('', '⭐ Top 15% sur TryHackMe', 'text');
        this.addLine('', '💀 20+ machines pwned sur HackTheBox', 'text');
        this.addLine('', '🎯 Spécialités: Web, Forensic, OSINT', 'text');
    }
    
    showContact() {
        this.addLine('', '=== CONTACT ===', 'success');
        this.addLine('', '📧 Email: mancel.matys@email.com', 'text');
        this.addLine('', '📱 Téléphone: 06 12 34 56 78', 'text');
        this.addLine('', '💼 LinkedIn: /in/mancel-matys', 'text');
        this.addLine('', '💻 GitHub: /matys-mancel', 'text');
    }
    
    clearTerminal() {
        this.output.innerHTML = '';
        this.addLine('', 'Terminal effacé.', 'success');
    }
    
    simulateNmap() {
        this.addLine('', 'Starting Nmap scan...', 'text');
        setTimeout(() => {
            this.addLine('', 'PORT     STATE    SERVICE', 'text');
            this.addLine('', '22/tcp   open     ssh', 'success');
            this.addLine('', '80/tcp   open     http', 'success');
            this.addLine('', '443/tcp  open     https', 'success');
            this.addLine('', 'Nmap done: 1 IP address scanned', 'text');
        }, 1000);
    }
    
    hackMode() {
        this.addLine('', 'Activation du mode hacker...', 'success');
        this.addLine('', 'Connexion au réseau...', 'text');
        setTimeout(() => {
            this.addLine('', '[*] Injection de payload...', 'text');
            setTimeout(() => {
                this.addLine('', '[+] Accès root obtenu!', 'success');
                this.addLine('', '[!] Juste une simulation 😉', 'error');
                unlockAchievement('hacker');
            }, 1000);
        }, 1000);
    }
    
    matrixEffect() {
        this.addLine('', 'Wake up, Neo...', 'success');
        this.addLine('', 'The Matrix has you...', 'text');
        this.addLine('', 'Follow the white rabbit. 🐰', 'text');
        unlockAchievement('matrix');
    }
    
    revealSecret() {
        this.addLine('', '🔓 SECRET DÉBLOQUÉ!', 'success');
        this.addLine('', 'Fun fact: Je code parfois en écoutant du lo-fi 🎵', 'text');
        this.addLine('', 'Mon outil OSINT préféré: Maltego 🕵️', 'text');
        unlockAchievement('secret');
    }
    
    scrollToBottom() {
        this.output.scrollTop = this.output.scrollHeight;
    }
}

// ========== MEMORY GAME ==========
class MemoryGame {
    constructor() {
        this.board = document.getElementById('memory-board');
        this.movesDisplay = document.getElementById('memory-moves');
        this.timeDisplay = document.getElementById('memory-time');
        this.bestDisplay = document.getElementById('memory-best');
        this.messageDisplay = document.getElementById('memory-message');
        this.startBtn = document.getElementById('start-memory');
        this.resetBtn = document.getElementById('reset-memory');
        
        this.icons = ['🛡️', '🔒', '💻', '🔑', '🐛', '🔐', '🌐', '⚠️'];
        this.cards = [];
        this.flippedCards = [];
        this.moves = 0;
        this.time = 0;
        this.timer = null;
        this.isPlaying = false;
        
        this.bestTime = localStorage.getItem('memoryBestTime') || '-';
        this.bestDisplay.textContent = this.bestTime;
        
        this.init();
    }
    
    init() {
        if (!this.startBtn) return;
        this.startBtn.addEventListener('click', () => this.startGame());
        this.resetBtn.addEventListener('click', () => this.resetGame());
    }
    
    startGame() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.moves = 0;
        this.time = 0;
        this.flippedCards = [];
        
        this.movesDisplay.textContent = this.moves;
        this.timeDisplay.textContent = this.time;
        this.messageDisplay.textContent = '';
        
        this.createBoard();
        
        this.timer = setInterval(() => {
            this.time++;
            this.timeDisplay.textContent = this.time;
        }, 1000);
    }
    
    createBoard() {
        this.board.innerHTML = '';
        this.cards = [...this.icons, ...this.icons]
            .sort(() => Math.random() - 0.5);
        
        this.cards.forEach((icon, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.index = index;
            card.dataset.icon = icon;
            
            card.innerHTML = `
                <div class="card-front">❓</div>
                <div class="card-back">${icon}</div>
            `;
            
            card.addEventListener('click', () => this.flipCard(card));
            this.board.appendChild(card);
        });
    }
    
    flipCard(card) {
        if (!this.isPlaying || card.classList.contains('flipped') || card.classList.contains('matched') || this.flippedCards.length >= 2) {
            return;
        }
        
        card.classList.add('flipped');
        this.flippedCards.push(card);
        
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.movesDisplay.textContent = this.moves;
            this.checkMatch();
        }
    }
    
    checkMatch() {
        const [card1, card2] = this.flippedCards;
        const icon1 = card1.dataset.icon;
        const icon2 = card2.dataset.icon;
        
        if (icon1 === icon2) {
            setTimeout(() => {
                card1.classList.add('matched');
                card2.classList.add('matched');
                this.flippedCards = [];
                this.showMessage('✓ Bonne paire!', 'success');
                
                if (document.querySelectorAll('.memory-card.matched').length === this.cards.length) {
                    this.endGame();
                }
            }, 500);
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                this.flippedCards = [];
                this.showMessage('✗ Pas la même!', 'error');
            }, 1000);
        }
    }
    
    endGame() {
        clearInterval(this.timer);
        this.isPlaying = false;
        
        const best = this.bestDisplay.textContent;
        if (best === '-' || this.time < parseInt(best)) {
            this.bestDisplay.textContent = this.time;
            localStorage.setItem('memoryBestTime', this.time);
            this.showMessage(`🏆 Nouveau record! ${this.time}s en ${this.moves} coups`, 'success');
        } else {
            this.showMessage(`✅ Terminé en ${this.time}s avec ${this.moves} coups`, 'success');
        }
        
        unlockAchievement('memory');
    }
    
    resetGame() {
        clearInterval(this.timer);
        this.isPlaying = false;
        this.moves = 0;
        this.time = 0;
        this.movesDisplay.textContent = this.moves;
        this.timeDisplay.textContent = this.time;
        this.messageDisplay.textContent = '';
        this.board.innerHTML = '';
    }
    
    showMessage(text, type) {
        this.messageDisplay.textContent = text;
        this.messageDisplay.className = 'game-message ' + type;
        setTimeout(() => {
            this.messageDisplay.textContent = '';
        }, 2000);
    }
}

// ========== PORT SCANNER SIMULATOR ==========
class PortScanner {
    constructor() {
        this.targetInput = document.getElementById('scanner-target');
        this.scanBtn = document.getElementById('start-scan');
        this.output = document.getElementById('scanner-output');
        
        this.commonPorts = [
            {port: 21, service: 'FTP', open: false},
            {port: 22, service: 'SSH', open: true},
            {port: 23, service: 'Telnet', open: false},
            {port: 25, service: 'SMTP', open: true},
            {port: 80, service: 'HTTP', open: true},
            {port: 110, service: 'POP3', open: false},
            {port: 143, service: 'IMAP', open: true},
            {port: 443, service: 'HTTPS', open: true},
            {port: 3306, service: 'MySQL', open: false},
            {port: 3389, service: 'RDP', open: false},
            {port: 5432, service: 'PostgreSQL', open: false},
            {port: 8080, service: 'HTTP-Proxy', open: true}
        ];
        
        this.init();
    }
    
    init() {
        if (!this.scanBtn) return;
        this.scanBtn.addEventListener('click', () => this.startScan());
    }
    
    startScan() {
        const target = this.targetInput.value || 'target.example.com';
        this.output.innerHTML = '';
        
        this.addLine(`<span class="port-open">Starting Nmap scan on ${target}...</span>`);
        this.addLine(`<span class="port-open">Initiating SYN Stealth Scan...</span>`);
        this.addLine('');
        
        setTimeout(() => {
            this.addLine('<span class="port-open">PORT      STATE    SERVICE</span>');
            this.addLine('<span class="port-open">──────────────────────────────</span>');
            
            this.commonPorts.forEach((portInfo, index) => {
                setTimeout(() => {
                    const state = portInfo.open ? 'open' : Math.random() > 0.7 ? 'filtered' : 'closed';
                    const className = state === 'open' ? 'port-open' : state === 'filtered' ? 'port-filtered' : 'port-closed';
                    this.addLine(`<span class="${className}">${portInfo.port}/tcp   ${state.padEnd(8)} ${portInfo.service}</span>`);
                    
                    if (index === this.commonPorts.length - 1) {
                        setTimeout(() => {
                            this.addLine('');
                            this.addLine('<span class="port-open">Nmap scan completed!</span>');
                            this.addLine(`<span class="port-open">Services detected: ${this.commonPorts.filter(p => p.open).length} open ports</span>`);
                            unlockAchievement('scanner');
                        }, 100);
                    }
                }, index * 150);
            });
        }, 500);
    }
    
    addLine(html) {
        const line = document.createElement('div');
        line.className = 'scanner-line';
        line.innerHTML = html;
        this.output.appendChild(line);
        this.output.scrollTop = this.output.scrollHeight;
    }
}

// ========== ACHIEVEMENTS SYSTEM ==========
const achievements = [
    {id: 'visitor', icon: '👋', title: 'Bienvenue', desc: 'Visiter le CV', unlocked: true},
    {id: 'hacker', icon: '💻', title: 'H4ck3r', desc: 'Utiliser hack dans le terminal', unlocked: false},
    {id: 'matrix', icon: '🕶️', title: 'Neo', desc: 'Entrer dans la Matrix', unlocked: false},
    {id: 'secret', icon: '🔓', title: 'Curieux', desc: 'Trouver un secret', unlocked: false},
    {id: 'gamer', icon: '🎮', title: 'Gamer', desc: 'Finir Hack The System', unlocked: false},
    {id: 'memory', icon: '🧠', title: 'Mémoire', desc: 'Finir Memory Cyber', unlocked: false},
    {id: 'scanner', icon: '🔍', title: 'Scanner', desc: 'Faire un scan de ports', unlocked: false},
    {id: 'konami', icon: '🕹️', title: 'Old School', desc: 'Trouver le Konami Code', unlocked: false},
    {id: 'osint', icon: '🔎', title: 'OSINT Master', desc: 'Lancer un défi OSINT', unlocked: false},
    {id: 'rootme', icon: '🚩', title: 'Root-Me Hero', desc: 'Valider le challenge Root-Me', unlocked: false},
    {id: 'explorer', icon: '🗺️', title: 'Explorateur', desc: 'Cliquer sur tous les secrets', unlocked: false}
];

function initAchievements() {
    const container = document.getElementById('badges-container');
    if (!container) return;
    
    const saved = JSON.parse(localStorage.getItem('achievements') || '{}');
    
    achievements.forEach(achievement => {
        if (saved[achievement.id]) {
            achievement.unlocked = true;
        }
        
        const badge = document.createElement('div');
        badge.className = `achievement-badge ${achievement.unlocked ? 'unlocked' : ''}`;
        badge.dataset.id = achievement.id;
        badge.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-title">${achievement.title}</div>
            <div class="achievement-desc">${achievement.desc}</div>
        `;
        container.appendChild(badge);
    });
}

function unlockAchievement(id) {
    const achievement = achievements.find(a => a.id === id);
    if (!achievement || achievement.unlocked) return;
    
    achievement.unlocked = true;
    
    const saved = JSON.parse(localStorage.getItem('achievements') || '{}');
    saved[id] = true;
    localStorage.setItem('achievements', JSON.stringify(saved));
    
    const badge = document.querySelector(`[data-id="${id}"]`);
    if (badge) {
        badge.classList.add('unlocked');
    }
    
    showNotification(`🎉 Badge débloqué: ${achievement.title}!`);
}

function showNotification(text) {
    const notif = document.createElement('div');
    notif.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, #0ea5e9, #38bdf8);
        color: white;
        padding: 20px 30px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(14, 165, 233, 0.4);
        z-index: 10000;
        animation: slideInRight 0.5s ease;
        font-weight: bold;
        font-size: 1.1em;
    `;
    notif.textContent = text;
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => notif.remove(), 500);
    }, 3000);
}

// ========== SECRET UNLOCKS ==========
let secretsFound = 0;

function initSecrets() {
    const secrets = document.querySelectorAll('.secret-unlock');
    secrets.forEach(secret => {
        secret.addEventListener('click', function() {
            if (!this.classList.contains('unlocked')) {
                this.classList.add('unlocked');
                const secretNum = this.dataset.secret;
                this.querySelector('span').textContent = `Secret ${secretNum}: Mon premier langage était Python 🐍`;
                secretsFound++;
                
                if (secretsFound >= 3) {
                    unlockAchievement('explorer');
                }
                
                unlockAchievement('secret');
            }
        });
    });
}

// ========== OSINT CHALLENGE ==========
function initOsintChallenge() {
    const btn = document.getElementById('osint-challenge-btn');
    if (!btn) return;
    
    btn.addEventListener('click', () => {
        const challenges = [
            'Trouve l\'adresse IP du serveur de ce site',
            'Identifie la technologie utilisée pour ce CV',
            'Recherche mes comptes sur les réseaux sociaux',
            'Trouve ma localisation approximative via les indices du CV',
            'Identifie les outils OSINT que j\'utilise'
        ];
        
        const challenge = challenges[Math.floor(Math.random() * challenges.length)];
        showNotification(`🎯 Défi OSINT: ${challenge}`);
        unlockAchievement('osint');
    });
    
    const osintCards = document.querySelectorAll('.osint-card');
    osintCards.forEach(card => {
        card.addEventListener('click', () => {
            const tool = card.dataset.tool;
            showNotification(`Cliquez sur "${card.querySelector('h4').textContent}" - Expertise validée!`);
        });
    });
}

// ========== CLICKABLE PASSIONS ==========
function initClickablePassions() {
    const passion = document.querySelector('[data-passion="osint"]');
    if (!passion) return;
    
    passion.addEventListener('click', () => {
        document.querySelector('.osint-section').scrollIntoView({behavior: 'smooth'});
        showNotification('📍 Navigation vers la section OSINT!');
    });
}

// ========== ROOT-ME CHALLENGE ==========
class RootMeChallenge {
    constructor() {
        this.flagInput = document.getElementById('flag-input');
        this.submitBtn = document.getElementById('submit-flag');
        this.messageDisplay = document.getElementById('challenge-message');
        this.hintDisplay = document.getElementById('hint-display');
        this.leaderboard = document.getElementById('leaderboard');
        
        // Le vrai flag: RM{OSINT_M4ST3R_2025}
        this.correctFlag = 'RM{OSINT_M4ST3R_2025}';
        this.score = 50;
        this.startTime = Date.now();
        this.hintsUsed = [];
        
        this.hints = {
            1: '🔍 Indice 2: Faites un clic droit > Inspecter l\'élément. Cherchez les commentaires HTML...',
            2: '💡 Indice 3: Trouvez l\'élément avec data-secret. Décodez le base64: T1NJTlRfTTRTVDNSXzIwMjU=',
            3: '🎯 Solution: Le flag est RM{OSINT_M4ST3R_2025}'
        };
        
        this.init();
    }
    
    init() {
        if (!this.submitBtn) return;
        
        this.submitBtn.addEventListener('click', () => this.validateFlag());
        this.flagInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.validateFlag();
        });
        
        // Hint buttons
        document.querySelectorAll('.hint-btn').forEach(btn => {
            btn.addEventListener('click', () => this.showHint(btn.dataset.hint));
        });
        
        // Check if source code is opened (step 1)
        this.checkInspection();
        
        // Load leaderboard
        this.loadLeaderboard();
    }
    
    checkInspection() {
        // Detect DevTools
        const devtools = /./;
        devtools.toString = function() {
            unlockProgress(1);
            return 'DevTools';
        };
        console.log('%c', devtools);
        
        // Also check if they view the hidden element
        const hiddenData = document.getElementById('hidden-data');
        if (hiddenData) {
            const observer = new MutationObserver(() => {
                unlockProgress(1);
            });
            observer.observe(hiddenData, { attributes: true });
        }
    }
    
    showHint(hintNum) {
        const btn = document.getElementById(`hint-btn-${hintNum}`);
        if (btn.classList.contains('used')) return;
        
        const costs = { 1: 5, 2: 10, 3: 30 };
        const cost = costs[hintNum];
        
        if (confirm(`Utiliser cet indice coûtera ${cost} points. Continuer?`)) {
            this.score -= cost;
            this.hintsUsed.push(hintNum);
            btn.classList.add('used');
            btn.disabled = true;
            
            this.hintDisplay.innerHTML = `
                <strong>💡 ${hintNum === '3' ? 'Solution' : 'Indice ' + (parseInt(hintNum) + 1)}:</strong><br>
                ${this.hints[hintNum]}<br>
                <small style="color: var(--danger);">(-${cost} points)</small>
            `;
            
            if (hintNum === '2') {
                unlockProgress(2);
            }
            
            showNotification(`Indice débloqué! -${cost} points`);
        }
    }
    
    validateFlag() {
        const userFlag = this.flagInput.value.trim();
        
        if (!userFlag) {
            this.showMessage('Veuillez entrer un flag!', 'error');
            return;
        }
        
        if (userFlag === this.correctFlag) {
            this.onSuccess();
        } else {
            this.onError(userFlag);
        }
    }
    
    onSuccess() {
        unlockProgress(3);
        
        const timeSpent = Math.floor((Date.now() - this.startTime) / 1000);
        const finalScore = Math.max(this.score, 0);
        
        this.showMessage(`🎉 FLAG VALIDÉ! Score: ${finalScore}/50 pts | Temps: ${timeSpent}s`, 'success');
        
        // Save to leaderboard
        this.saveScore(finalScore, timeSpent);
        
        // Unlock achievement
        unlockAchievement('rootme');
        
        // Confetti
        for (let i = 0; i < 50; i++) {
            createConfetti();
        }
        
        // Disable inputs
        this.flagInput.disabled = true;
        this.submitBtn.disabled = true;
        
        showNotification('🏆 Challenge Root-Me complété!');
    }
    
    onError(attempt) {
        let message = '❌ Flag incorrect! ';
        
        // Hints based on attempt
        if (!attempt.startsWith('RM{')) {
            message += 'Le flag doit commencer par RM{...}';
        } else if (!attempt.endsWith('}')) {
            message += 'Le flag doit se terminer par }';
        } else if (attempt.toLowerCase().includes('osint')) {
            message += 'Vous êtes sur la bonne piste! Vérifiez la casse...';
        } else {
            message += 'Réessayez ou utilisez les indices.';
        }
        
        this.showMessage(message, 'error');
    }
    
    showMessage(text, type) {
        this.messageDisplay.textContent = text;
        this.messageDisplay.className = 'challenge-message ' + type;
        
        if (type === 'error') {
            setTimeout(() => {
                this.messageDisplay.textContent = '';
                this.messageDisplay.className = 'challenge-message';
            }, 4000);
        }
    }
    
    saveScore(score, time) {
        const leaderboardData = JSON.parse(localStorage.getItem('rootme-leaderboard') || '[]');
        
        const newEntry = {
            name: 'Vous',
            score: score,
            time: time,
            date: new Date().toISOString()
        };
        
        leaderboardData.push(newEntry);
        leaderboardData.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return a.time - b.time;
        });
        
        // Keep top 10
        const top10 = leaderboardData.slice(0, 10);
        localStorage.setItem('rootme-leaderboard', JSON.stringify(top10));
        
        this.loadLeaderboard();
    }
    
    loadLeaderboard() {
        const leaderboardData = JSON.parse(localStorage.getItem('rootme-leaderboard') || '[]');
        
        if (leaderboardData.length === 0) {
            // Default leaderboard
            leaderboardData.push(
                { name: 'H4ck3r_Pro', score: 50, time: 127 },
                { name: 'OSINT_Master', score: 45, time: 156 },
                { name: 'Cyber_Ninja', score: 40, time: 203 },
                { name: 'Root_Hunter', score: 35, time: 289 }
            );
        }
        
        this.leaderboard.innerHTML = '';
        
        leaderboardData.forEach((entry, index) => {
            const item = document.createElement('div');
            item.className = 'leaderboard-item';
            
            let rankClass = '';
            let medal = '';
            if (index === 0) { rankClass = 'gold'; medal = '🥇'; }
            else if (index === 1) { rankClass = 'silver'; medal = '🥈'; }
            else if (index === 2) { rankClass = 'bronze'; medal = '🥉'; }
            
            item.innerHTML = `
                <div class="leaderboard-rank ${rankClass}">${medal || '#' + (index + 1)}</div>
                <div class="leaderboard-name">${entry.name}</div>
                <div class="leaderboard-score">${entry.score} pts</div>
                <div class="leaderboard-time">${entry.time}s</div>
            `;
            
            this.leaderboard.appendChild(item);
        });
    }
}

function unlockProgress(step) {
    const stepElement = document.getElementById(`step-${step}`);
    if (stepElement && !stepElement.classList.contains('unlocked')) {
        stepElement.classList.add('unlocked');
        stepElement.querySelector('i').className = 'fas fa-check-circle';
        showNotification(`✅ Étape ${step} débloquée!`);
    }
}

// ========== INITIALIZE ALL NEW FEATURES ==========
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        // Terminal
        if (document.getElementById('terminal-input')) {
            new InteractiveTerminal();
        }
        
        // Memory Game
        if (document.getElementById('memory-board')) {
            new MemoryGame();
        }
        
        // Port Scanner
        if (document.getElementById('start-scan')) {
            new PortScanner();
        }
        
        // Root-Me Challenge
        if (document.getElementById('flag-input')) {
            new RootMeChallenge();
        }
        
        // Achievements
        initAchievements();
        
        // Secrets
        initSecrets();
        
        // OSINT
        initOsintChallenge();
        
        // Clickable Passions
        initClickablePassions();
        
        console.log('%c🎉 Toutes les fonctionnalités interactives sont chargées!', 'color: #10b981; font-size: 16px; font-weight: bold;');
        console.log('%c🚩 Challenge Root-Me disponible! Trouvez le flag...', 'color: #ef4444; font-size: 14px; font-weight: bold;');
    }, 500);
});

// Unlock Konami achievement when activated
const originalActivateEasterEgg = activateEasterEgg;
activateEasterEgg = function() {
    originalActivateEasterEgg();
    unlockAchievement('konami');
};

// ========== CONSOLE MESSAGE ==========
console.log('%c👨‍💻 Hey there!', 'color: #0ea5e9; font-size: 20px; font-weight: bold;');
console.log('%cI see you\'re checking the console. Impressive! 🕵️', 'color: #38bdf8; font-size: 14px;');
console.log('%cFeel free to explore the code. Happy hacking! 🚀', 'color: #06b6d4; font-size: 14px;');
console.log('%cTry the Konami Code: ⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️BA', 'color: #10b981; font-size: 12px;');
console.log('%c🎮 2 mini-jeux, un terminal interactif, un scanner de ports...', 'color: #f59e0b; font-size: 12px;');
console.log('%c🏆 10 badges à débloquer! Bonne chance!', 'color: #fbbf24; font-size: 14px; font-weight: bold;');
