// If the page is opened with a hash (e.g., index.html#about), perform a smooth scroll to the target
document.addEventListener('DOMContentLoaded', function() {
    try {
        var hash = window.location.hash || '';
        if (hash) {
            var id = hash.slice(1);
            var el = document.getElementById(id);
            if (el) {
                // Small timeout to ensure layout and fixed header sizing are applied
                setTimeout(function() {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
            }
        }
    } catch (e) {
        // ignore errors
    }
});
