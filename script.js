/* =========================================================
   Pradeep Kumar — Portfolio interactions
   ========================================================= */

/*
 * Contact form delivery.
 * GitHub Pages is static, so by default the form opens the visitor's email
 * client with the message pre-filled. To receive submissions directly instead,
 * create a free form at https://formspree.io and paste its endpoint here, e.g.
 * 'https://formspree.io/f/abcdwxyz'.
 */
const FORM_ENDPOINT = '';
const CONTACT_EMAIL = 'contact@pradeepn.in';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNav();
    initScrollEffects();
    initReveal();
    initCounters();
    initRotator();
    initTerminal();
    initSkillsFilter();
    initPointerEffects();
    initContactForm();
    $('#year').textContent = new Date().getFullYear();
});

/* ---------- Theme ---------- */
function initTheme() {
    const root = document.documentElement;
    const meta = $('meta[name="theme-color"]');
    const apply = (t) => {
        root.setAttribute('data-theme', t);
        if (meta) meta.setAttribute('content', t === 'dark' ? '#07080c' : '#f6f6f3');
    };
    apply(root.getAttribute('data-theme') || 'dark');

    $('#themeToggle').addEventListener('click', () => {
        const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        apply(next);
        try { localStorage.setItem('theme', next); } catch (e) { /* storage unavailable */ }
    });
}

/* ---------- Navigation ---------- */
function initNav() {
    const menuBtn = $('#menuBtn');
    const links = $('#navLinks');

    const close = () => {
        links.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
    };
    menuBtn.addEventListener('click', () => {
        const open = links.classList.toggle('open');
        menuBtn.setAttribute('aria-expanded', String(open));
    });
    $$('a', links).forEach((a) => a.addEventListener('click', close));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    document.addEventListener('click', (e) => {
        if (!links.contains(e.target) && !menuBtn.contains(e.target)) close();
    });

    // Highlight the section currently in view
    const navAnchors = $$('a[href^="#"]', links);
    const sections = navAnchors.map((a) => $(a.getAttribute('href'))).filter(Boolean);
    const spy = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            navAnchors.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => spy.observe(s));
}

/* ---------- Scroll progress, sticky nav, back-to-top ---------- */
function initScrollEffects() {
    const nav = $('#nav');
    const bar = $('#scrollProgress');
    const toTop = $('#toTop');
    let ticking = false;

    const update = () => {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
        nav.classList.toggle('scrolled', y > 20);
        toTop.classList.toggle('show', y > 700);
        ticking = false;
    };
    window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();

    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' }));
}

/* ---------- Reveal on scroll (with stagger for siblings) ---------- */
function initReveal() {
    const items = $$('.reveal');
    if (!('IntersectionObserver' in window)) {
        items.forEach((el) => el.classList.add('in'));
        return;
    }
    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const siblings = $$(':scope > .reveal', el.parentElement);
            const idx = Math.max(0, siblings.indexOf(el));
            el.style.transitionDelay = Math.min(idx * 70, 420) + 'ms';
            el.classList.add('in');
            setTimeout(() => { el.style.transitionDelay = ''; }, 1400);
            io.unobserve(el);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach((el) => io.observe(el));
}

/* ---------- Animated counters ---------- */
function initCounters() {
    const counters = $$('[data-count]');
    const run = (el) => {
        const target = Number(el.dataset.count);
        if (prefersReducedMotion) { el.textContent = target; return; }
        const duration = 1600;
        const start = performance.now();
        const step = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 4);
            el.textContent = Math.round(target * eased);
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
        });
    }, { threshold: 0.6 });
    counters.forEach((c) => io.observe(c));
}

/* ---------- Rotating phrase in hero ---------- */
function initRotator() {
    const el = $('#rotator');
    if (!el || prefersReducedMotion) return;
    const phrases = [
        'AI-powered test automation',
        'self-healing test suites',
        'intelligent test generation',
        'AI-driven defect prediction',
        'visual AI validation',
        'CI/CD quality gates',
    ];
    let i = 0;
    setInterval(() => {
        el.classList.add('out');
        setTimeout(() => {
            i = (i + 1) % phrases.length;
            el.textContent = phrases[i];
            el.classList.remove('out');
        }, 350);
    }, 2800);
}

/* ---------- Terminal typing animation ---------- */
function initTerminal() {
    const body = $('#terminalBody');
    if (!body) return;

    const lines = [
        { text: 'Running 1,284 tests using 8 workers', cls: 'dim' },
        { text: '✓ checkout.spec.ts      (42 passed)', cls: 'ok' },
        { text: '✓ auth.spec.ts          (37 passed)', cls: 'ok' },
        { text: '⟳ healed locator  #btn-submit → [data-test=submit]', cls: 'heal' },
        { text: '✓ payments.api.ts       (96 passed)', cls: 'ok' },
        { text: '✓ visual.ai.spec.ts     (0 diffs)', cls: 'ok' },
        { text: '1,284 passed · 0 failed · p95 182ms', cls: '' },
    ];

    const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const render = (done, partial) => {
        const html = done.map((l) => `<span class="${l.cls}">${escape(l.text)}</span>`);
        if (partial) html.push(`<span class="${partial.cls}">${escape(partial.text)}</span><span class="caret"></span>`);
        else html.push('<span class="caret"></span>');
        body.innerHTML = html.join('\n');
    };

    if (prefersReducedMotion) { render(lines); return; }

    const play = () => {
        let li = 0, ci = 0;
        const done = [];
        const tick = () => {
            if (li >= lines.length) {
                render(done);
                setTimeout(play, 4500);
                return;
            }
            const line = lines[li];
            ci += 2;
            if (ci >= line.text.length) {
                done.push(line);
                li++; ci = 0;
                render(done);
                setTimeout(tick, 380);
            } else {
                render(done, { text: line.text.slice(0, ci), cls: line.cls });
                setTimeout(tick, 18);
            }
        };
        tick();
    };

    // Start when the terminal becomes visible
    const io = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) { play(); io.disconnect(); }
    });
    io.observe(body);
}

/* ---------- Skills filter ---------- */
function initSkillsFilter() {
    const buttons = $$('.filter');
    const cards = $$('.skill-card');

    buttons.forEach((btn) => btn.addEventListener('click', () => {
        const f = btn.dataset.filter;
        buttons.forEach((b) => {
            const on = b === btn;
            b.classList.toggle('active', on);
            b.setAttribute('aria-selected', String(on));
        });
        cards.forEach((card) => {
            const show = f === 'all' || card.dataset.cat === f;
            card.classList.toggle('hidden', !show);
            card.classList.remove('fade-in');
            if (show) {
                card.classList.add('in');
                void card.offsetWidth; // restart animation
                card.classList.add('fade-in');
            }
        });
    }));
}

/* ---------- Cursor glow, card spotlight, subtle tilt ---------- */
function initPointerEffects() {
    if (window.matchMedia('(hover: none)').matches) return;

    const glow = $('#cursorGlow');
    let gx = 0, gy = 0, tx = 0, ty = 0, rafId = null;

    const loop = () => {
        gx += (tx - gx) * 0.12;
        gy += (ty - gy) * 0.12;
        glow.style.transform = `translate(${gx - 240}px, ${gy - 240}px)`;
        rafId = Math.abs(tx - gx) + Math.abs(ty - gy) > 0.5 ? requestAnimationFrame(loop) : null;
    };

    window.addEventListener('pointermove', (e) => {
        document.body.classList.add('has-pointer');
        tx = e.clientX; ty = e.clientY;
        if (!rafId && !prefersReducedMotion) rafId = requestAnimationFrame(loop);
    }, { passive: true });

    // Spotlight follows pointer within each card
    $$('.card').forEach((card) => {
        card.addEventListener('pointermove', (e) => {
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mx', `${e.clientX - r.left}px`);
            card.style.setProperty('--my', `${e.clientY - r.top}px`);
        });
    });

    if (prefersReducedMotion) return;
    $$('.tilt').forEach((card) => {
        card.addEventListener('pointermove', (e) => {
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            card.style.transform = `perspective(900px) rotateX(${(-py * 4).toFixed(2)}deg) rotateY(${(px * 4).toFixed(2)}deg) translateY(-4px)`;
        });
        card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
}

/* ---------- Contact form ---------- */
function initContactForm() {
    const form = $('#contactForm');
    const status = $('#formStatus');
    const btnLabel = $('.btn-label', form);

    const setStatus = (msg, type = '') => {
        status.textContent = msg;
        status.className = 'form-status' + (type ? ' ' + type : '');
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate
        let valid = true;
        $$('input[required], textarea[required]', form).forEach((field) => {
            const ok = field.value.trim() !== '' && field.checkValidity();
            field.closest('.field').classList.toggle('invalid', !ok);
            if (!ok) valid = false;
        });
        if (!valid) { setStatus('Please fill in all fields with a valid email address.', 'error'); return; }
        if (form._gotcha.value) return; // bot

        const data = {
            name: form.name.value.trim(),
            email: form.email.value.trim(),
            subject: form.subject.value.trim(),
            message: form.message.value.trim(),
        };

        if (!FORM_ENDPOINT) {
            const body = `${data.message}\n\n— ${data.name} (${data.email})`;
            window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}`;
            setStatus('Opening your email app… If nothing happens, write to ' + CONTACT_EMAIL, 'success');
            return;
        }

        btnLabel.textContent = 'Sending…';
        form.querySelector('button[type="submit"]').disabled = true;
        try {
            const res = await fetch(FORM_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Request failed');
            form.reset();
            setStatus("Thanks! Your message has been sent — I'll get back to you soon.", 'success');
        } catch (err) {
            setStatus('Something went wrong. Please email ' + CONTACT_EMAIL + ' directly.', 'error');
        } finally {
            btnLabel.textContent = 'Send message';
            form.querySelector('button[type="submit"]').disabled = false;
        }
    });

    $$('input, textarea', form).forEach((f) => f.addEventListener('input', () => f.closest('.field')?.classList.remove('invalid')));
}
