// FAQ accordion
document.querySelectorAll('.faq-item').forEach(function(item) {
    item.addEventListener('click', function() {
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(function(i) { i.classList.remove('open'); });
        if (!isOpen) item.classList.add('open');
    });
});
