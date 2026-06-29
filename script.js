// Fade-in animations (if present on the page)
const fadeEls = document.querySelectorAll('.fade-in-up');
if (fadeEls.length) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
    }, { threshold: 0.1 });
    fadeEls.forEach(el => observer.observe(el));
}

// Mobile menu toggle
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('open'));
}

// Contact form submission (only present on contact.html)
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        status.textContent = 'Sending...';
        status.className = 'text-sm text-center text-slate-500';

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();

            if (result.success) {
                status.textContent = 'Message sent successfully!';
                status.className = 'text-sm text-center text-green-600';
                form.reset();
            } else {
                status.textContent = result.error || 'Something went wrong.';
                status.className = 'text-sm text-center text-red-600';
            }
        } catch (err) {
            status.textContent = 'Failed to send. Please try again later.';
            status.className = 'text-sm text-center text-red-600';
        }
    });
}
