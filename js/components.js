/* ════════════════════════
   DISPATCHED ALERT CARDS
════════════════════════ */
const alerts = [
    "ARMED RESPONSE DISPATCHED — Zone 4 — ETA: 4 min",
    "PATROL UNIT ALPHA — Sector 7 Checkpoint — All Clear",
    "ALARM ACTIVATION — Borrowdale Industrial — Responding",
    "GUARD TOUR VERIFIED — Eastlea Perimeter — 02:17",
    "CCTV FEED NOMINAL — Harare CBD — 48 cameras online"
];

function initShuffler() {
    const stack = document.getElementById('alert-stack');
    if (!stack) return;

    alerts.forEach(text => {
        const card = document.createElement('div');
        card.className = 'shuffle-card';
        card.textContent = text;
        stack.appendChild(card);
    });

    let idx = 0;
    let interval = null;

    function step() {
        const cards = stack.querySelectorAll('.shuffle-card');
        if (!cards.length) return;
        const first = cards[0];
        first.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        first.style.opacity = '0';
        first.style.transform = 'translateY(-18px)';
        setTimeout(() => {
            stack.appendChild(first);
            first.style.transition = 'none';
            first.style.opacity = '1';
            first.style.transform = 'translateY(0)';
        }, 420);
    }

    interval = setInterval(step, 2800);

    // Pause when off-screen
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting && interval) { clearInterval(interval); interval = null; }
            else if (e.isIntersecting && !interval) { interval = setInterval(step, 2800); }
        });
    });
    io.observe(stack);
}

/* ════════════════════════
   TYPEWRITER FEED
════════════════════════ */
const termLines = [
    "> ALL PATROL UNITS NOMINAL — 14 ACTIVE ROUTES",
    "> CCTV FEED: HARARE CBD — 48 CAMERAS ONLINE",
    "> INCIDENT LOG: 0 UNRESOLVED — LAST UPDATE: 00:03",
    "> GUARD TOUR VERIFIED: EASTLEA PERIMETER — 02:17",
    "> ARMED RESPONSE: STANDBY — UNITS ALPHA, BRAVO"
];

async function typeWriter() {
    const el = document.getElementById('typewriter-feed');
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        el.textContent = termLines.join('\n');
        return;
    }

    let lineIndex = 0;
    while (true) {
        el.textContent = '';
        for (const char of termLines[lineIndex]) {
            el.textContent += char;
            await new Promise(r => setTimeout(r, 32));
        }
        await new Promise(r => setTimeout(r, 2000));
        lineIndex = (lineIndex + 1) % termLines.length;
    }
}

/* ════════════════════════
   LIVE CLOCK
════════════════════════ */
function initClock() {
    const clock = document.getElementById('live-clock');
    if (!clock) return;
    const tick = () => { clock.textContent = new Date().toLocaleTimeString('en-GB'); };
    tick();
    setInterval(tick, 1000);
}

/* ════════════════════════
   CALENDAR GRID
════════════════════════ */
function initCalendar() {
    const grid = document.getElementById('calendar-grid');
    if (!grid) return;

    const total = 28;
    const highlighted = [5, 11, 17, 22];
    const dimmed = [3, 8, 14, 19, 25];

    for (let i = 1; i <= total; i++) {
        const cell = document.createElement('div');
        cell.className = 'cal-cell';
        cell.textContent = i;
        if (highlighted.includes(i)) cell.classList.add('active');
        else if (dimmed.includes(i)) cell.classList.add('dimmed');
        grid.appendChild(cell);
    }

    // Animate cursor hovering over cells
    const cursor = document.getElementById('svg-cursor');
    if (!cursor) return;

    const cells = grid.querySelectorAll('.cal-cell');
    let ci = 0;
    setInterval(() => {
        const cell = cells[Math.floor(Math.random() * cells.length)];
        const rect = cell.getBoundingClientRect();
        const gridRect = grid.getBoundingClientRect();
        cursor.style.transform = `translate(${rect.left - gridRect.left}px, ${rect.top - gridRect.top}px)`;
        cursor.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        ci++;
    }, 1200);
}

/* ════════════════════════
   NAVBAR
════════════════════════ */
function initNav() {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.navbar-pill');
    const links = document.querySelectorAll('.nav-links a');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!expanded));
        nav.classList.toggle('mobile-open');
    });

    links.forEach(a => a.addEventListener('click', () => {
        nav.classList.remove('mobile-open');
        toggle.setAttribute('aria-expanded', 'false');
    }));

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            nav.classList.remove('mobile-open');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });
}

/* ════════════════════════
   SCROLL OBSERVER (navbar)
════════════════════════ */
function initScrollObserver() {
    const sentinel = document.getElementById('top-sentinel');
    const nav = document.querySelector('.navbar-pill');
    if (!sentinel || !nav) return;

    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            nav.classList.toggle('scrolled', !e.isIntersecting);
        });
    });
    io.observe(sentinel);
}

/* ════════════════════════
   FORM HANDLER
════════════════════════ */
function initFormHandler() {
    const form = document.getElementById('assessment-form');
    const success = document.getElementById('form-success');
    if (!form || !success) return;

    // Helper: show/clear field error
    function setError(fieldId, msg) {
        const field = form.querySelector(`#${fieldId}`);
        if (!field) return;
        let err = field.parentElement.querySelector('.field-error');
        if (msg) {
            field.style.borderColor = '#e53e3e';
            if (!err) {
                err = document.createElement('span');
                err.className = 'field-error';
                err.setAttribute('aria-live', 'polite');
                field.parentElement.appendChild(err);
            }
            err.textContent = msg;
        } else {
            field.style.borderColor = '';
            if (err) err.remove();
        }
    }

    form.addEventListener('submit', e => {
        e.preventDefault();
        let valid = true;

        const name = form.querySelector('#f-name');
        const company = form.querySelector('#f-company');
        const email = form.querySelector('#f-email');
        const service = form.querySelector('#f-service');

        // Name
        if (!name.value.trim()) {
            setError('f-name', 'Please enter your full name.');
            valid = false;
        } else { setError('f-name', ''); }

        // Company
        if (!company.value.trim()) {
            setError('f-company', 'Please enter your company or organisation name.');
            valid = false;
        } else { setError('f-company', ''); }

        // Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
            setError('f-email', 'Please enter a valid email address.');
            valid = false;
        } else { setError('f-email', ''); }

        // Service
        if (!service.value) {
            setError('f-service', 'Please select a service.');
            valid = false;
        } else { setError('f-service', ''); }

        if (!valid) return;

        // Collect data
        const formData = new FormData(form);

        // Show loading state if desired (optional, for now just proceeding to fetch)
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending...</span>';

        fetch('process-form.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // All good — show success
                    form.classList.add('hidden');
                    success.classList.remove('hidden');
                    setTimeout(() => {
                        success.classList.add('hidden');
                        form.reset();
                        form.classList.remove('hidden');
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                    }, 4000);
                } else {
                    alert(data.message || 'Something went wrong. Please try again.');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Could not connect to the server. Please try again later.');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            });
    });

    // Clear error on input
    form.querySelectorAll('input, select').forEach(el => {
        el.addEventListener('input', () => setError(el.id, ''));
    });
}

/* ════════════════════════
   INIT
════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initNav();
    initScrollObserver();
    initShuffler();
    typeWriter();
    initClock();
    initCalendar();
    initFormHandler();
});