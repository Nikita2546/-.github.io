// Режим слабовидящих
document.getElementById('accessibility-toggle')?.addEventListener('click', () => {
    document.body.classList.toggle('accessibility-mode');
    localStorage.setItem('accessibilityMode', document.body.classList.contains('accessibility-mode'));
});

// Восстановление настроек
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('accessibilityMode') === 'true') {
        document.body.classList.add('accessibility-mode');
    }
});

// Поиск
function performSearch() {
    const query = document.getElementById('site-search').value.trim().toLowerCase();
    if (!query) return;
    const sections = document.querySelectorAll('section');
    let found = false;
    sections.forEach(sec => {
        if (sec.innerText.toLowerCase().includes(query)) {
            sec.scrollIntoView({ behavior: 'smooth', block: 'center' });
            sec.style.outline = '2px solid #d4af37';
            setTimeout(() => sec.style.outline = '', 2000);
            found = true;
        }
    });
    if (!found) {
        showModal('Поиск', `Ничего не найдено по запросу: "${query}"`);
    }
}
document.getElementById('search-btn')?.addEventListener('click', performSearch);
document.getElementById('site-search')?.addEventListener('keypress', e => {
    if (e.key === 'Enter') performSearch();
});

// Плавная прокрутка
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        }
    });
});

// Анимация при прокрутке
function animateOnScroll() {
    document.querySelectorAll('.fade-up').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 100) {
            el.classList.add('appear');
        }
    });
}
window.addEventListener('scroll', animateOnScroll);
document.addEventListener('DOMContentLoaded', animateOnScroll);

// Модальное окно
function showModal(title, text) {
    const modal = document.getElementById('infoModal');
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalText').innerText = text;
    modal.classList.add('active');
}
function closeModal() {
    document.getElementById('infoModal').classList.remove('active');
}
document.getElementById('modal-close-btn')?.addEventListener('click', closeModal);
document.querySelector('.close-modal')?.addEventListener('click', closeModal);
document.addEventListener('click', e => {
    if (e.target === document.getElementById('infoModal')) closeModal();
});

// Активная ссылка
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    function setActiveLink() {
        let current = '';
        document.querySelectorAll('section').forEach(sec => {
            const top = sec.offsetTop - 100;
            if (window.scrollY >= top) current = sec.id;
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', setActiveLink);
    setActiveLink();
});