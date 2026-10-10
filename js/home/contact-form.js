// ── Contact form — opens email client with all fields pre-filled ──
(function () {
    const form     = document.getElementById('contact-form');
    const waBtn    = document.getElementById('whatsapp-btn');
    const success  = document.getElementById('contact-success');
    const MY_EMAIL = 'twambililemusukwa@gmail.com';
    const WA_NUMBER = '265884950893'; // +265 99 588 64 98 (no + or spaces)

    // Build WhatsApp link dynamically as the user types
    function updateWaLink() {
        const name    = (document.getElementById('contact-name').value   || '').trim();
        const subject = (document.getElementById('contact-subject').value|| '').trim();
        const message = (document.getElementById('contact-message').value|| '').trim();
        const parts = [];
        if (name)    parts.push('Hi, I\'m ' + name + '.');
        if (subject) parts.push('Subject: ' + subject);
        if (message) parts.push(message);
        const text = parts.length ? parts.join('\n') : 'Hi Twambi, I found your portfolio and would like to get in touch.';
        waBtn.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
    }

    ['contact-name','contact-email','contact-subject','contact-message'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.addEventListener('input', updateWaLink);
    });
    updateWaLink(); // set default on load

    // Submit → compose mailto and open email client
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const name    = document.getElementById('contact-name').value.trim();
        const email   = document.getElementById('contact-email').value.trim();
        const subject = document.getElementById('contact-subject').value.trim() || 'Portfolio Contact';
        const message = document.getElementById('contact-message').value.trim();

        const body = [
            'Name: ' + name,
            'Email: ' + email,
            '',
            message
        ].join('\n');

        const mailto = 'mailto:' + MY_EMAIL
            + '?subject=' + encodeURIComponent(subject)
            + '&body='    + encodeURIComponent(body);

        window.location.href = mailto;

        // Show success feedback
        if (success) {
            success.classList.add('visible');
            setTimeout(function() { success.classList.remove('visible'); }, 6000);
        }
    });
})();
