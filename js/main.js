'use strict';

// ─── Constants ────────────────────────────────────────────────────────────────
const PROFILE_PATH = 'assets/telescope_profile.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Load JSON from a URL and return the parsed object.
 * @param {string} url
 * @returns {Promise<object>}
 */
async function fetchJSON(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
    return res.json();
}

/**
 * Safely set the href of a link element.
 * @param {string} id
 * @param {string} href
 */
function setLink(id, href) {
    const el = document.getElementById(id);
    if (el) el.href = href;
}

/**
 * Update the availability status text to the current month/year.
 */
function updateAvailabilityStatus() {
    const el = document.getElementById('current-status');
    if (!el) return;
    const now = new Date();
    const label = now.toLocaleString('en-US', {month: 'long', year: 'numeric'});
    el.textContent = `Available for new projects — ${label}`;
}

// ─── Section renderers ────────────────────────────────────────────────────────

/** Populate the hero section from profile data. */
function renderHero(data) {
    const {hero, social_networks: sn} = data;

    const nameEl = document.getElementById('hero-name');
    const roleEl = document.getElementById('hero-role');
    const tagEl = document.getElementById('hero-tagline');
    const badgeEl = document.getElementById('tech-badges');

    if (nameEl) nameEl.textContent = hero.full_name;
    if (roleEl) roleEl.textContent = hero.role_title;
    // JSON has a typo in the key — handle both variants gracefully
    if (tagEl) tagEl.textContent = hero['one_liner_tagline,'] ?? hero.one_liner_tagline ?? '';

    if (badgeEl) {
        badgeEl.innerHTML = Object.keys(hero.tech_logo_badges)
            .map(tech => `<span class="skill-pill">${escapeHtml(tech)}</span>`)
            .join('');
    }

    // Social links in the hero bar
    if (sn.corporate_email) {
        setLink('hero-email-link', `mailto:${sn.corporate_email}`);
    }
    if (sn.linkedin_username) {
        setLink('hero-linkedin-link', `https://linkedin.com/in/${sn.linkedin_username}`);
    }
    if (sn.credly) {
        setLink('hero-credly-link', `https://www.credly.com/users/${sn.credly}/badges`);
    }
    document.querySelectorAll('.github-link').forEach(link => {
        if (sn.github) link.href = `https://github.com/${sn.github}`;
    });
}

/** Populate the expertise cards section. */
function renderExpertiseCards(data) {
    const container = document.getElementById('expertise-cards');
    if (!container) return;

    container.innerHTML = Object.entries(data.expertise_cards)
        .map(([title, info]) => `
            <div class="years-card">
                <div class="years-title">${escapeHtml(title)}</div>
                <div class="years-years"><strong>Experience:</strong> ${info.years_of_experience} yr${info.years_of_experience !== 1 ? 's' : ''}</div>
                <ul>
                    ${info.capability_bullets.map(b => `<li>${escapeHtml(b)}</li>`).join('')}
                </ul>
            </div>`)
        .join('');
}

/** Populate the certifications grid. */
function renderCertifications(data) {
    const container = document.querySelector('.certifications-grid');
    if (!container) return;

    container.innerHTML = data.certifications
        .map(cert => `
            <div class="cert-card">
                <div class="cert-title">${escapeHtml(cert.name)}</div>
                <div class="cert-date">${escapeHtml(cert.issue_dates.trim())}</div>
                <a href="${encodeURI(cert.link)}" target="_blank" rel="noopener noreferrer" class="cert-verify">
                    Verify <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
                </a>
            </div>`)
        .join('');
}

/** Populate the featured projects grid. */
function renderProjects(data) {
    const container = document.querySelector('.projects-grid');
    if (!container) return;

    container.innerHTML = data.featured_projects
        .map(proj => `
            <div class="project-card">
                <div class="project-name">${escapeHtml(proj.project_name)}</div>
                <div class="project-desc">${escapeHtml(proj.one_sentence_description)}</div>
                <div class="project-stack">
                    ${proj.tech_stack_chips.split(',')
            .map(chip => `<span class="tech-chip">${escapeHtml(chip.trim())}</span>`)
            .join('')}
                </div>
                <div class="project-impact">${escapeHtml(proj.one_impact_metric)}</div>
                <a href="${encodeURI(proj.github_demo_link)}" target="_blank" rel="noopener noreferrer" class="project-link">
                    GitHub / Demo <i class="fa-brands fa-github" aria-hidden="true"></i>
                </a>
            </div>`)
        .join('');
}

/** Populate the footer social links. */
function renderFooterLinks(data) {
    const {social_networks: sn} = data;

    if (sn.corporate_email) setLink('email-link', `mailto:${sn.corporate_email}`);
    if (sn.linkedin_username) setLink('linkedin-link', `https://linkedin.com/in/${sn.linkedin_username}`);
    if (sn.credly) setLink('credly-link', `https://www.credly.com/users/${sn.credly}/badges`);
}

/** Build and animate the timeline. */
function renderTimeline(data) {
    const container = document.getElementById('timeline-container');
    if (!container || !data.timeline) return;

    container.innerHTML = data.timeline
        .map(item => {
            // Safely derive 2-char initials from the company name
            const initials = (item.company.split('-')[0].match(/\b\w+/g) ?? ['?'])
                .join('')
                .substring(0, 2)
                .toUpperCase();

            return `
                <div class="timeline-item">
                    <div class="timeline-content">
                        <div class="timeline-company">${escapeHtml(item.company)}</div>
                        <div class="timeline-role">${escapeHtml(item.role)}</div>
                        <div class="timeline-date">
                            <i class="fa-regular fa-calendar" aria-hidden="true"></i>
                            ${escapeHtml(item.date_range)}
                        </div>
                        <div class="timeline-achievement">${escapeHtml(item.one_headline_achievemen)}</div>
                    </div>
                    <div class="timeline-node" aria-hidden="true">${initials}</div>
                    <div class="timeline-spacer"></div>
                </div>`;
        })
        .join('');

    // Scroll-triggered reveal
    const observer = new IntersectionObserver(
        entries => entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        }),
        {threshold: 0.2, rootMargin: '0px 0px -80px 0px'}
    );

    container.querySelectorAll('.timeline-item').forEach(item => observer.observe(item));
}

// ─── Radar Chart ──────────────────────────────────────────────────────────────

/** Initialise the skills radar chart with a scroll-triggered animation. */
function initRadarChart(data) {
    const canvas = document.getElementById('radarChart');
    if (!canvas) return;

    const radarData = data.skills_radar;
    const labels = Object.keys(radarData);
    const values = labels.map(k => radarData[k]);

    const chart = new Chart(canvas, {
        type: 'radar',
        data: {
            labels,
            datasets: [{
                label: 'Expertise Level',
                data: values,
                backgroundColor: 'rgba(0, 212, 255, 0.15)',
                borderColor: '#00D4FF',
                borderWidth: 2,
                pointBackgroundColor: '#7B61FF',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointHoverBackgroundColor: '#00D4FF',
                pointHoverBorderColor: '#fff',
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            animation: {duration: 0},   // animation fires via IntersectionObserver below
            scales: {
                r: {
                    min: 0,
                    max: 10,
                    ticks: {
                        stepSize: 2,
                        color: 'rgba(240, 246, 255, 0.6)',
                        backdropColor: 'transparent',
                        font: {size: 12, family: "'JetBrains Mono', monospace"},
                    },
                    grid: {color: '#30363d', lineWidth: 1},
                    angleLines: {color: '#30363d', lineWidth: 1},
                    pointLabels: {
                        color: '#F0F6FF',
                        font: {size: 13, weight: '600', family: "'Space Grotesk', sans-serif"},
                        padding: 15,
                    },
                },
            },
            plugins: {
                legend: {display: false},
                tooltip: {
                    backgroundColor: 'rgba(13, 17, 23, 0.95)',
                    titleColor: '#00D4FF',
                    bodyColor: '#F0F6FF',
                    borderColor: '#7B61FF',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: ctx => `Skill Level: ${ctx.parsed.r}/10`,
                    },
                },
            },
        },
    });

    // Trigger animation once the chart scrolls into view
    const chartObserver = new IntersectionObserver(
        entries => entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            chart.options.animation = {
                duration: 1800,
                easing: 'easeInOutQuart',
                onProgress({currentStep, numSteps}) {
                    const progress = currentStep / numSteps;
                    canvas.style.filter = `drop-shadow(0 0 ${20 * progress}px rgba(0, 212, 255, 0.3))`;
                },
                onComplete() {
                    canvas.style.filter = 'drop-shadow(0 0 20px rgba(0, 212, 255, 0.3))';
                },
            };
            chart.update();
            chartObserver.unobserve(entry.target);
        }),
        {threshold: 0.3}
    );
    chartObserver.observe(canvas);

    // Reveal the section wrapper
    const section = document.querySelector('.skills-section');
    if (section) {
        const sectionObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    section.classList.add('visible');
                    sectionObserver.unobserve(section);
                }
            },
            {threshold: 0.3}
        );
        sectionObserver.observe(section);
    }
}

// ─── Particle canvas ──────────────────────────────────────────────────────────

/** Simple floating-dot particle animation for the hero section. */
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({length: 60}, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
    }));

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const p of particles) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 212, 255, 0.3)';
            ctx.fill();
            p.x += p.dx;
            p.y += p.dy;
            if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        }
        requestAnimationFrame(animate);
    }

    animate();
}

// DEPRECATED
// ─── PDF download ─────────────────────────────────────────────────────────────
//
// function downloadPDF() {
//     const options = {
//         margin:     0.5,
//         filename:   'serhii-burch-cv.pdf',
//         image:      { type: 'jpeg', quality: 0.98 },
//         html2canvas: { scale: 2, useCORS: true },
//         jsPDF:      { unit: 'in', format: 'A4', orientation: 'portrait' },
//     };
//     html2pdf().set(options).from(document.body).save();
// }

// ─── XSS helper ───────────────────────────────────────────────────────────────

/** Escape text before inserting into innerHTML. */
function escapeHtml(str = '') {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ─── Bootstrap ────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
    // Kick off non-data-dependent tasks immediately
    initParticles();
    updateAvailabilityStatus();

    // Wire up the Download CV button
    const dlBtn = document.getElementById('downloadBtn');
    if (dlBtn) dlBtn.addEventListener('click', downloadPDF);

    // Load profile data once, then populate every section
    try {
        const data = profileData;

        renderHero(data);
        renderExpertiseCards(data);
        renderCertifications(data);
        renderProjects(data);
        renderFooterLinks(data);
        renderTimeline(data);
        initRadarChart(data);
    } catch (err) {
        console.error('Failed to load profile data:', err);
    }
});
