gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    const ctx = gsap.context(() => {

        // ── Hero Entrance ──────────────────────────────
        const heroTl = gsap.timeline({ delay: 0.1 });
        heroTl
            .from(".label-mono", { y: 20, opacity: 0, duration: 0.7, ease: "power3.out" })
            .from(".title-line-1", { y: 50, opacity: 0, duration: 0.9, ease: "power4.out" }, "-=0.4")
            .from(".title-line-2", { y: 50, opacity: 0, duration: 0.9, ease: "power4.out" }, "-=0.65")
            .from(".hero-subline", { opacity: 0, y: 20, duration: 0.8, ease: "power3.out" }, "-=0.5")
            .from(".hero-actions", { opacity: 0, y: 16, duration: 0.6, ease: "power3.out" }, "-=0.5")
            .from(".hero-scroll-indicator", { opacity: 0, duration: 0.5 }, "-=0.2");

        // ── Stat Counters ──────────────────────────────
        const statNumbers = document.querySelectorAll('.stat-number');
        if (statNumbers.length > 0) {
            gsap.from('.stats-strip', {
                scrollTrigger: {
                    trigger: '.stats-strip',
                    start: 'top 85%',
                    once: true,
                    onEnter: () => {
                        statNumbers.forEach(el => {
                            const target = parseInt(el.dataset.target, 10);
                            let current = 0;
                            const step = target / 40;
                            const timer = setInterval(() => {
                                current = Math.min(current + step, target);
                                el.textContent = Math.round(current);
                                if (current >= target) clearInterval(timer);
                            }, 30);
                        });
                    }
                }
            });
        }

        // ── Scroll Reveal (batch) ──────────────────────
        ScrollTrigger.batch('.reveal', {
            start: 'top 88%',
            onEnter: batch => batch.forEach((el, i) => {
                gsap.to(el, {
                    opacity: 1,
                    y: 0,
                    duration: 0.85,
                    ease: 'power3.out',
                    delay: i * 0.08,
                    onStart: () => el.classList.add('in-view')
                });
            }),
            once: true
        });

        // ── Sticky Protocol Stack ──────────────────────
        const steps = gsap.utils.toArray('.protocol-card');
        steps.forEach((step, i) => {
            if (i < steps.length - 1) {
                gsap.to(step, {
                    scrollTrigger: {
                        trigger: step,
                        start: 'top 10%',
                        endTrigger: '.protocol-wrapper',
                        end: 'bottom bottom',
                        pin: true,
                        pinSpacing: false,
                        scrub: true
                    },
                    scale: 0.92,
                    filter: 'blur(8px)',
                    opacity: 0.4
                });
            }
        });

        // ── Eclipse Hero (moon + stars) ─────────────────
        (function initEclipseHero() {
            const starCanvas = document.getElementById('starCanvas');
            const eclipse = document.getElementById('eclipse');
            const moon = document.getElementById('moon');
            const glowRing = document.getElementById('glowRing');
            const glowMid = document.getElementById('glowMid');
            const glowInner = document.getElementById('glowInner');
            const glowFar = document.getElementById('glowFar');
            const chromo = document.getElementById('chromo');

            if (!starCanvas || !eclipse || !moon) return;

            const MOON_MAX = 520; // start further below so rise is more visible
            const TOTALITY = 20;
            const ENTRY_MS = 3000;

            // Sun canvas inside eclipse
            const sunCanvas = document.getElementById('sunCanvas');
            if (sunCanvas && sunCanvas.getContext) {
                const sunCtx = sunCanvas.getContext('2d');
                sunCanvas.width = 260;
                sunCanvas.height = 260;
                const drawSun = () => {
                    sunCtx.clearRect(0, 0, 260, 260);
                    const g = sunCtx.createRadialGradient(130, 130, 0, 130, 130, 130);
                    g.addColorStop(0.00, '#fff4d0');
                    g.addColorStop(0.18, '#ffd060');
                    g.addColorStop(0.45, '#e99818');
                    g.addColorStop(0.72, '#c06010');
                    g.addColorStop(0.90, '#7a2e00');
                    g.addColorStop(1.00, '#3a1000');
                    sunCtx.beginPath();
                    sunCtx.arc(130, 130, 130, 0, Math.PI * 2);
                    sunCtx.fillStyle = g;
                    sunCtx.fill();
                };
                drawSun();
            }

            // Starfield canvas
            const sCtx = starCanvas.getContext('2d');
            const resizeStars = () => {
                starCanvas.width = window.innerWidth;
                starCanvas.height = window.innerHeight;
            };
            resizeStars();
            window.addEventListener('resize', resizeStars);

            const STAR_COUNT = 160;
            const stars = Array.from({ length: STAR_COUNT }, () => ({
                x: Math.random(),
                y: Math.random(),
                r: Math.random() * 0.9 + 0.3,
                base: Math.random() * 0.35 + 0.08,
                amp: Math.random() * 0.25 + 0.05,
                freq: Math.random() * 0.0008 + 0.0003,
                phase: Math.random() * Math.PI * 2
            }));

            const shoots = [];
            function spawnShoot() {
                const side = Math.random() > 0.5;
                shoots.push({
                    x: side ? Math.random() * 0.4 : Math.random() * 0.6 + 0.4,
                    y: Math.random() * 0.5,
                    len: Math.random() * 120 + 60,
                    speed: Math.random() * 0.0006 + 0.0004,
                    angle: Math.PI / 4 + (Math.random() - 0.5) * 0.4,
                    life: 0,
                    max: 1
                });
            }

            function scheduleShoot() {
                spawnShoot();
                setTimeout(scheduleShoot, Math.random() * 5000 + 3000);
            }
            setTimeout(scheduleShoot, 2500);

            let totalityLevel = 0;

            function drawStars(ts) {
                const W = starCanvas.width, H = starCanvas.height;
                sCtx.clearRect(0, 0, W, H);

                stars.forEach(s => {
                    const twinkle = Math.sin(s.phase + ts * s.freq) * s.amp;
                    const toBoost = totalityLevel * (0.6 - s.base);
                    const alpha = Math.max(0, Math.min(1, s.base + twinkle + toBoost));
                    sCtx.beginPath();
                    sCtx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
                    sCtx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
                    sCtx.fill();
                });

                for (let i = shoots.length - 1; i >= 0; i--) {
                    const sh = shoots[i];
                    sh.life = Math.min(sh.life + sh.speed * 16, sh.max);
                    if (sh.life >= sh.max) { shoots.splice(i, 1); continue; }

                    const prog = sh.life;
                    const fadeIn = Math.min(prog / 0.2, 1);
                    const fadeOut = prog > 0.7 ? 1 - (prog - 0.7) / 0.3 : 1;
                    const alpha = fadeIn * fadeOut * 0.8;

                    const tx = sh.x * W + Math.cos(sh.angle) * sh.len * prog;
                    const ty = sh.y * H + Math.sin(sh.angle) * sh.len * prog;
                    const hx = tx - Math.cos(sh.angle) * Math.min(sh.len * 0.35, sh.len * prog);
                    const hy = ty - Math.sin(sh.angle) * Math.min(sh.len * 0.35, sh.len * prog);

                    const g = sCtx.createLinearGradient(hx, hy, tx, ty);
                    g.addColorStop(0, 'rgba(255,255,255,0)');
                    g.addColorStop(1, `rgba(255,255,255,${alpha.toFixed(3)})`);

                    sCtx.beginPath();
                    sCtx.moveTo(hx, hy);
                    sCtx.lineTo(tx, ty);
                    sCtx.strokeStyle = g;
                    sCtx.lineWidth = 1.2;
                    sCtx.stroke();
                }

                requestAnimationFrame(drawStars);
            }
            requestAnimationFrame(drawStars);

            function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

            let prevAtTotality = false;

            function setGlowSize(glowLevel) {
                const midInset = -60 - glowLevel * 60;
                const farInset = -120 - glowLevel * 100;
                const px = v => `${Math.round(v)}px`;
                if (glowMid) glowMid.style.inset = px(midInset);
                if (glowFar) glowFar.style.inset = px(farInset);
            }

            function updateState(moonY) {
                const frac = clamp(moonY / MOON_MAX, 0, 1);
                const proximity = 1 - frac;
                const atTotality = moonY <= TOTALITY;

                const glowT = clamp((proximity - 0.65) / 0.35, 0, 1);
                const glowEased = glowT * glowT * glowT;

                if (glowMid) glowMid.style.opacity = glowEased * 0.9;
                if (glowInner) glowInner.style.opacity = glowEased * 1.0;
                if (glowFar) glowFar.style.opacity = glowEased * 0.75;
                setGlowSize(glowEased);

                if (glowRing) {
                    if (atTotality && !prevAtTotality) {
                        glowRing.style.opacity = 1;
                        glowRing.classList.add('active');
                    } else if (!atTotality && prevAtTotality) {
                        glowRing.style.opacity = 0;
                        glowRing.classList.remove('active');
                    }
                    if (!atTotality) {
                        glowRing.style.opacity = glowEased * 1.2;
                    }
                }

                if (chromo) {
                    chromo.style.boxShadow = atTotality
                        ? '0 0 0 1.5px rgba(200,45,15,0.50), 0 0 6px 2px rgba(180,35,10,0.18)'
                        : '0 0 0 0 transparent';
                }

                totalityLevel = glowEased;
                prevAtTotality = atTotality;
            }

            function setMoonY(y) {
                moon.style.transform = `translateY(${y}px)`;
                updateState(y);
            }

            function easeOutExpo(t) { return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t); }

            let entryStart = null, entryDone = false, scrollLocked = true;

            function runEntry(ts) {
                if (!entryStart) entryStart = ts;
                const t = Math.min((ts - entryStart) / ENTRY_MS, 1);
                // Animate from well below centre (MOON_MAX) up to slight overshoot above 0
                const pathStart = MOON_MAX;
                const pathEnd = 0; // stop exactly at totality
                const eased = easeOutExpo(t);
                const y = pathStart + (pathEnd - pathStart) * eased;
                setMoonY(y);
                if (t < 1) {
                    requestAnimationFrame(runEntry);
                } else {
                    setMoonY(pathEnd);
                    entryDone = true;
                    setTimeout(() => { scrollLocked = false; }, 800);
                }
            }

            // Start entry without forcing scroll/overflow (we already manage layout elsewhere)
            setMoonY(MOON_MAX);

            setTimeout(() => requestAnimationFrame(runEntry), 800);

            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!entryDone || scrollLocked) return;
                if (!ticking) {
                    requestAnimationFrame(() => {
                        ticking = false;
                        const max = document.body.scrollHeight - window.innerHeight;
                        const frac = max > 0 ? window.scrollY / max : 0;
                        setMoonY(frac * MOON_MAX);
                    });
                    ticking = true;
                }
            }, { passive: true });
        })();
    });
});