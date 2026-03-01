gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    const ctx = gsap.context(() => {

        // ── Hero Entrance ──────────────────────────────
        const heroTl = gsap.timeline({ delay: 0.1 });
        heroTl
            .from(".label-mono", { y: 20, opacity: 0, duration: 0.7, ease: "power3.out" })
            .from(".title-line-1", { y: 50, opacity: 0, duration: 0.9, ease: "power4.out" }, "-=0.4")
            .from(".title-line-2", { y: 50, opacity: 0, duration: 0.9, ease: "power4.out" }, "-=0.65")
            .from(".hero-subline",  { opacity: 0, y: 20, duration: 0.8, ease: "power3.out" }, "-=0.5")
            .from(".hero-actions",  { opacity: 0, y: 16, duration: 0.6, ease: "power3.out" }, "-=0.5")
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

        // ── Parallax Hero ──────────────────────────────
        gsap.to('.hero-section', {
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            },
            backgroundPositionY: '30%',
            ease: 'none'
        });

    });
});