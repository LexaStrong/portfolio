/**
 * Portfolio Architecture & Interactions
 * Alexander Appiah-Kubi
 */

document.addEventListener('DOMContentLoaded', () => {
    initPagePreloader();
    initScrollProgress();
    initActiveNavObserver();
    initProjectFiltering();
    initCopyEmail();
    initSubtleScrollReveals();
    initFormRedirect();
});

/* ==========================================================================
   Scroll Progress Indicator
   ========================================================================== */
function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollTop = window.scrollY || document.documentElement.scrollTop;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const percentage = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
                bar.style.width = `${percentage}%`;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

/* ==========================================================================
   Active Navigation Highlighting
   ========================================================================== */
function initActiveNavObserver() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    if (!navLinks.length || !sections.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === `#${activeId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    });

    sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   Meaningful Interaction: Category Filter Tabs
   ========================================================================== */
function initProjectFiltering() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const projectCards = document.querySelectorAll('.project-entry');
    if (!filterTabs.length || !projectCards.length) return;

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const filter = tab.getAttribute('data-filter');

            // Update tab states
            filterTabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            // Filter project cards
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* ==========================================================================
   Meaningful Interaction: Quick Copy Email with Visual State
   ========================================================================== */
function initCopyEmail() {
    const btn = document.getElementById('copy-email-btn');
    const label = document.getElementById('copy-email-text');
    if (!btn || !label) return;

    const email = 'iamlexastrong@gmail.com';

    btn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(email);
            const originalText = label.textContent;
            label.textContent = 'Copied!';
            btn.style.borderColor = 'var(--brand-amber)';
            btn.style.color = 'var(--brand-amber)';

            setTimeout(() => {
                label.textContent = originalText;
                btn.style.borderColor = '';
                btn.style.color = '';
            }, 2200);
        } catch {
            // Fallback: prompt mailto
            window.location.href = `mailto:${email}`;
        }
    });
}

/* ==========================================================================
   Purposeful Subtle Scroll Reveals (Respects Prefers-Reduced-Motion)
   ========================================================================== */
function initSubtleScrollReveals() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const revealElements = document.querySelectorAll(
        '.hero-content, .profile-card, .architecture-card, .capability-card, .process-card, .project-entry, .case-study-entry, .review-card, .contact-box'
    );

    revealElements.forEach(el => el.classList.add('reveal-init'));

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   Formspree Success Handling
   ========================================================================== */
function initFormRedirect() {
    const successEl = document.querySelector('[data-fs-success]');
    if (!successEl) return;

    const observer = new MutationObserver(() => {
        if (!successEl.hasAttribute('hidden')) {
            successEl.style.display = 'flex';
        }
    });

    observer.observe(successEl, { attributes: true, attributeFilter: ['hidden'] });
}

/* ==========================================================================
   Page Preloader Dismissal
   ========================================================================== */
function initPagePreloader() {
    const preloader = document.getElementById('page-preloader');
    if (!preloader) return;

    const dismiss = () => {
        preloader.classList.add('loaded');
        setTimeout(() => {
            if (preloader.parentNode) {
                preloader.parentNode.removeChild(preloader);
            }
        }, 500);
    };

    // Render loader for 7 seconds
    setTimeout(dismiss, 7000);
}
