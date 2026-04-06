/* ================================================================
   КПУП «Речицаводоканал» — script.js  v2.0
   + Мобильное меню  + Новости с галереей  + Фото руководства
================================================================ */

/* ── База данных (localStorage) ── */
const DB = {
    get(k, d) { try { const v = localStorage.getItem('rv_' + k); return v !== null ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem('rv_' + k, JSON.stringify(v)); } catch {} },
};

/* ── SVG-аватары руководства (фолбэк если нет фото) ── */
const STAFF_AVATARS = {
    director: `<svg viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg" class="staff-avatar-svg">
        <circle cx="45" cy="45" r="45" fill="#003366"/>
        <circle cx="45" cy="34" r="14" fill="rgba(255,255,255,0.28)"/>
        <rect x="20" y="54" width="50" height="4" rx="2" fill="rgba(212,175,55,0.6)"/>
        <ellipse cx="45" cy="76" rx="22" ry="14" fill="rgba(255,255,255,0.18)"/>
        <rect x="30" y="28" width="30" height="4" rx="2" fill="rgba(212,175,55,0.8)"/>
    </svg>`,
    engineer: `<svg viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg" class="staff-avatar-svg">
        <circle cx="45" cy="45" r="45" fill="#004c99"/>
        <circle cx="45" cy="34" r="14" fill="rgba(255,255,255,0.28)"/>
        <rect x="22" y="24" width="46" height="8" rx="4" fill="rgba(212,175,55,0.7)"/>
        <ellipse cx="45" cy="76" rx="22" ry="14" fill="rgba(255,255,255,0.18)"/>
        <circle cx="30" cy="55" r="5" fill="rgba(255,255,255,0.2)"/>
        <circle cx="60" cy="55" r="5" fill="rgba(255,255,255,0.2)"/>
    </svg>`,
    ideology: `<svg viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg" class="staff-avatar-svg">
        <circle cx="45" cy="45" r="45" fill="#005a80"/>
        <circle cx="45" cy="34" r="14" fill="rgba(255,255,255,0.28)"/>
        <ellipse cx="45" cy="76" rx="22" ry="14" fill="rgba(255,255,255,0.18)"/>
        <path d="M32 54 Q45 48 58 54" stroke="rgba(212,175,55,0.7)" stroke-width="3" fill="none" stroke-linecap="round"/>
        <circle cx="45" cy="60" r="3" fill="rgba(212,175,55,0.6)"/>
    </svg>`,
    energetic: `<svg viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg" class="staff-avatar-svg">
        <circle cx="45" cy="45" r="45" fill="#0d7a4a"/>
        <circle cx="45" cy="34" r="14" fill="rgba(255,255,255,0.28)"/>
        <ellipse cx="45" cy="76" rx="22" ry="14" fill="rgba(255,255,255,0.18)"/>
        <path d="M50 22 L42 38 L48 38 L40 56 L52 36 L46 36 Z" fill="rgba(212,175,55,0.8)"/>
    </svg>`,
    default: `<svg viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg" class="staff-avatar-svg">
        <circle cx="45" cy="45" r="45" fill="#556"/>
        <circle cx="45" cy="34" r="14" fill="rgba(255,255,255,0.28)"/>
        <ellipse cx="45" cy="76" rx="22" ry="14" fill="rgba(255,255,255,0.18)"/>
    </svg>`,
};

/* ── Инициализация БД ── */
function initDB() {
    if (DB.get('init_v2', false)) return;
    DB.set('applications', [
        { id:1, name:'Иванов И.И.',   phone:'+375 29 123-45-67', address:'ул. Ленина, 12',    type:'Поверка/замена счётчика',   text:'Истёк срок поверки.',                   date:'10.01.2026', status:'Выполнена' },
        { id:2, name:'Петрова А.С.',  phone:'+375 29 234-56-78', address:'ул. Советская, 5',  type:'Жалоба на качество воды',   text:'Коричневый оттенок воды из крана.',     date:'12.01.2026', status:'В работе'  },
        { id:3, name:'Сидоров П.В.',  phone:'+375 44 345-67-89', address:'ул. Доватора, 18',  type:'Аварийная ситуация',         text:'Прорыв трубы во дворе.',                date:'14.01.2026', status:'Выполнена' },
        { id:4, name:'Козлова Н.А.',  phone:'+375 33 456-78-90', address:'пр. Победы, 33',    type:'Подключение к водопроводу',  text:'Новый частный дом.',                    date:'20.01.2026', status:'Новая'    },
        { id:5, name:'Захаров В.С.',  phone:'+375 29 567-89-01', address:'ул. Калинина, 7',   type:'Выдача справки/документа',   text:'Справка об отсутствии задолженности.',  date:'22.01.2026', status:'Выполнена' },
    ]);
    DB.set('news', [
        { id:1, title:'Качество воды в Речице соответствует нормам',
          text:'По итогам ежемесячного мониторинга вода в Речице соответствует всем санитарным нормам СТБ 1188-99. Превышений по всем 32 контролируемым показателям не выявлено.\n\nЛаборатория предприятия ежемесячно проводит более 500 анализов воды из различных точек водозабора и разводящей сети. Все результаты фиксируются в журнале лабораторного контроля.',
          type:'quality', date:'2026-01-10', photos:[] },
        { id:2, title:'Завершён ремонт на ул. Доватора',
          text:'На участке ул. Доватора (от д. 10 до д. 22) заменено 180 метров водопроводных труб диаметром 100 мм. Подача воды восстановлена в полном объёме.\n\nРаботы выполнены досрочно — за 4 дня вместо запланированных 6. Использовались трубы из высокоплотного полиэтилена (HDPE), срок службы которых превышает 50 лет.',
          type:'work', date:'2026-01-07', photos:[] },
        { id:3, title:'Модернизация насосной станции №3',
          text:'На насосной станции №3 (ул. Калинина) установлены новые насосы Grundfos CR 45-7 с частотными преобразователями. Экономия электроэнергии составила 25% по сравнению с предыдущим оборудованием.\n\nДавление в сети стало более стабильным. Автоматизированная система управления позволяет осуществлять мониторинг в режиме реального времени.',
          type:'work', date:'2026-01-03', photos:[] },
        { id:4, title:'Плановое отключение воды 15 февраля',
          text:'Уважаемые жители! 15 февраля с 09:00 до 14:00 будет произведено плановое отключение воды на ул. Ленина, д. 5–23 в связи с ремонтными работами на тепловой трассе.\n\nПросьба запастись водой заранее. По вопросам обращайтесь: 8 (02340) 9-82-17. Приносим извинения за временные неудобства.',
          type:'emergency', date:'2026-01-20', photos:[] },
        { id:5, title:'Новые мембранные фильтры на очистных сооружениях',
          text:'Внедрена современная система доочистки сточных вод с применением мембранных фильтров. Снижение взвешенных веществ на выходе составило 40%, БПК₅ снизился на 30%.\n\nТехнология позволяет полностью исключить сброс биологически активных веществ в р. Днепр.',
          type:'work', date:'2025-12-30', photos:[] },
    ]);
    DB.set('announcements', [
        { id:1, title:'Отключение 15 февраля', text:'ул. Ленина, д. 5–23, с 09:00 до 14:00. Просьба запастись водой заранее.', date:'2026-02-15', banner:true },
    ]);
    DB.set('quality', [
        { name:'Цветность',         value:'4 град.',       norm:'≤20',      pct:20, ok:true,  icon:'🎨' },
        { name:'Мутность',          value:'0,9 ЕМФ',       norm:'≤2,6',     pct:35, ok:true,  icon:'🌫️' },
        { name:'pH',                value:'7,4',            norm:'6,0–9,0',  pct:40, ok:true,  icon:'🧪' },
        { name:'Жёсткость',         value:'4,8 мг-экв/л',  norm:'≤7,0',     pct:69, ok:true,  icon:'💎' },
        { name:'Железо (общее)',    value:'0,24 мг/л',     norm:'≤0,3',     pct:80, ok:true,  icon:'⚙️' },
        { name:'Нитраты',           value:'8,2 мг/л',      norm:'≤45',      pct:18, ok:true,  icon:'🌿' },
        { name:'Марганец',          value:'0,07 мг/л',     norm:'≤0,1',     pct:70, ok:true,  icon:'🔩' },
        { name:'Остаточный хлор',   value:'0,35 мг/л',     norm:'0,3–0,5',  pct:70, ok:true,  icon:'💧' },
    ]);
    DB.set('tariffs_pop', [
        { service:'Холодное водоснабжение',          unit:'1 м³',      price:'0,68 руб.', subsidy:'0,45 руб.' },
        { service:'Водоотведение (канализация)',      unit:'1 м³',      price:'0,54 руб.', subsidy:'0,36 руб.' },
        { service:'Вода из колонки (сверх нормы)',    unit:'1 м³',      price:'0,72 руб.', subsidy:'—' },
        { service:'Норма потребления (без счётчика)', unit:'чел./мес.', price:'5,0 м³',   subsidy:'—' },
    ]);
    DB.set('quality_date', 'январь 2026');
    DB.set('adm_pass', 'admin123');
    DB.set('banner_text', '⚡ Плановое отключение воды: <strong>15 февраля с 09:00 до 14:00</strong> — ул. Ленина, д. 5–23.');
    // Фото руководства — пустые по умолчанию (ключ 'staff_photo_N')
    DB.set('init_v2', true);
}
initDB();

/* ── Переводы ── */
const LANG = {
    ru: { nav_title:'КПУП "Речицаводоканал"', nav_subtitle:'Водоснабжение и водоотведение г. Речица', nav_home:'Главная', nav_services:'Услуги', nav_tariffs:'Тарифы', nav_quality:'Качество воды', nav_about:'О предприятии', nav_staff:'Сотрудники', nav_news:'Новости', nav_apply:'Заявка', nav_contacts:'Контакты', hero_title:'Чистая вода — <span>основа жизни</span> Речицы', hero_text:'Коммунальное предприятие «Речицаводоканал» обеспечивает надёжное водоснабжение и водоотведение более чем для 80 000 жителей города и района с 1967 года.', hero_btn1:'Подать заявку', hero_btn2:'Позвонить', services_title:'Что мы предоставляем', staff_title:'Руководство и отделы', news_title:'Новости', apply_title:'Подать заявку', apply_desc:'Отправьте заявку онлайн — мы свяжемся с вами в рабочее время', contacts_title:'Свяжитесь с нами', footer_copy:'© 2026 КПУП «Речицаводоканал». Все права защищены.', footer_since:'Служим Речице с 1967 года', read_more:'Подробнее' },
    be: { nav_title:'КПУП "Рэчыцавадаканал"', nav_subtitle:'Водазабеспячэнне і водаадвядзенне г. Рэчыца', nav_home:'Галоўная', nav_services:'Паслугі', nav_tariffs:'Тарыфы', nav_quality:'Якасць вады', nav_about:'Аб прадпрыемстве', nav_staff:'Супрацоўнікі', nav_news:'Навіны', nav_apply:'Заяўка', nav_contacts:'Кантакты', hero_title:'Чыстая вада — <span>аснова жыцця</span> Рэчыцы', hero_text:'КП «Рэчыцавадаканал» забяспечвае надзейнае водазабеспячэнне для больш чым 80 000 жыхароў з 1967 года.', hero_btn1:'Падаць заяўку', hero_btn2:'Патэлефанаваць', services_title:'Нашы паслугі', staff_title:'Кіраўніцтва і аддзелы', news_title:'Навіны', apply_title:'Падаць заяўку', apply_desc:'Дашліце заяўку анлайн — мы звяжамся з вамі ў працоўны час', contacts_title:'Звяжыцеся з намі', footer_copy:'© 2026 КПУП «Рэчыцавадаканал». Усе правы абаронены.', footer_since:'Служым Рэчыцы з 1967 года', read_more:'Падрабязней' }
};
function switchLang(lang) {
    document.getElementById('html-root').lang = lang;
    document.querySelectorAll('[data-key]').forEach(el => {
        const k = el.getAttribute('data-key');
        if (LANG[lang]?.[k] !== undefined) el.innerHTML = LANG[lang][k];
    });
    DB.set('lang', lang);
    renderNews();
}
document.getElementById('lang-sel').addEventListener('change', e => switchLang(e.target.value));

/* ── Toast ── */
function toast(msg, type) {
    const icons = { info:'fa-info-circle', ok:'fa-check-circle', err:'fa-exclamation-circle', warn:'fa-exclamation-triangle' };
    const t = document.createElement('div');
    t.className = 'toast ' + (type || 'info');
    t.innerHTML = '<i class="fas ' + (icons[type] || 'fa-info-circle') + '"></i> ' + msg;
    document.getElementById('toast-box').appendChild(t);
    setTimeout(() => { t.style.animation = 'tOut .3s ease forwards'; setTimeout(() => t.remove(), 320); }, 3600);
}

/* ── Generic modal ── */
function showModal(title, body) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = '<div style="color:var(--text-l);line-height:1.72;font-size:.95rem">' + body + '</div>';
    document.getElementById('modal-ov').classList.add('on');
}
function closeModal() { document.getElementById('modal-ov').classList.remove('on'); }

/* ══════════════════════════════════════
   МОБИЛЬНОЕ МЕНЮ (drawer)
══════════════════════════════════════ */
(function() {
    const burgerBtn = document.getElementById('burger-btn');
    const mobNav    = document.getElementById('mob-nav');
    const mobNavOv  = document.getElementById('mob-nav-ov');
    const mobClose  = document.getElementById('mob-close');

    function openMenu() {
        mobNav.classList.add('open');
        mobNavOv.classList.add('open');
        burgerBtn.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
        mobNav.classList.remove('open');
        mobNavOv.classList.remove('open');
        burgerBtn.classList.remove('open');
        document.body.style.overflow = '';
    }

    burgerBtn?.addEventListener('click', openMenu);
    mobClose?.addEventListener('click', closeMenu);
    mobNavOv?.addEventListener('click', closeMenu);

    // Закрыть при клике по ссылке
    document.querySelectorAll('.mob-link').forEach(l => l.addEventListener('click', closeMenu));
})();

/* ── Header scroll hide ── */
let lastSc = 0;
window.addEventListener('scroll', () => {
    const s = window.scrollY;
    const h = document.getElementById('main-header');
    if (s > lastSc && s > 180) h.classList.add('gone');
    else h.classList.remove('gone');
    const st = document.getElementById('scroll-top');
    if (s > 400) st.classList.add('show'); else st.classList.remove('show');
    setActiveNav();
    lastSc = s <= 0 ? 0 : s;
});
function setActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.nav-link');
    const scrollY = window.scrollY + 140;
    sections.forEach(sec => {
        if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
            links.forEach(l => {
                l.classList.remove('on');
                if (l.getAttribute('href')?.includes('#' + sec.id)) l.classList.add('on');
            });
        }
    });
}

/* ── Fade-up animation ── */
const fadeObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); fadeObs.unobserve(e.target); } });
}, { threshold: 0.08 });
document.querySelectorAll('.fu').forEach(el => fadeObs.observe(el));

/* ── Quality bars animation ── */
const qualObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.querySelectorAll('.q-bar').forEach(bar => {
                const w = bar.style.width; bar.style.width = '0';
                setTimeout(() => { bar.style.width = w; }, 100);
            });
            qualObs.unobserve(e.target);
        }
    });
}, { threshold: 0.2 });
const ql = document.querySelector('.q-list');
if (ql) qualObs.observe(ql);

/* ── Accessibility ── */
document.getElementById('acc-btn').addEventListener('click', function() {
    document.body.classList.toggle('acc-mode');
    this.classList.toggle('on');
    DB.set('acc', document.body.classList.contains('acc-mode'));
});

/* ── Render quality ── */
function renderQuality() {
    const data = DB.get('quality', []);
    const date = DB.get('quality_date', '');
    const el = document.getElementById('quality-date');
    if (el) el.textContent = date;
    const cont = document.getElementById('q-list');
    if (!cont) return;
    cont.innerHTML = data.map(q => `
        <div class="q-item">
            <div class="q-ico">${q.icon}</div>
            <div class="q-inf">
                <div class="q-name">${q.name}</div>
                <div class="q-sub">Норма: ${q.norm}</div>
                <div class="q-bar-w"><div class="q-bar${q.ok ? '' : ' bad'}" style="width:${Math.min(q.pct, 100)}%"></div></div>
            </div>
            <div style="text-align:center;flex-shrink:0">
                <div class="q-badge ${q.ok ? 'q-ok' : 'q-warn'}">${q.value}</div>
                <div style="font-size:.68rem;margin-top:3px;color:${q.ok ? '#2e7d32' : 'var(--danger)'}">
                    ${q.ok ? '✓ норма' : '⚠ превышение'}
                </div>
            </div>
        </div>
    `).join('');
}

/* ── Render tariffs ── */
function renderTariffsPublic() {
    const data = DB.get('tariffs_pop', []);
    const tbody = document.getElementById('tp-pop-body');
    if (!tbody) return;
    tbody.innerHTML = data.map(r => `
        <tr>
            <td>${r.service}</td>
            <td>${r.unit}</td>
            <td class="t-price">${r.price}</td>
            <td class="t-price">${r.subsidy}</td>
        </tr>
    `).join('');
}

/* ── Render announcements ── */
function renderAnns() {
    const all = DB.get('announcements', []);
    const bar = document.getElementById('alert-bar');
    const txt = document.getElementById('alert-txt');
    const ann = all.find(a => a.banner);
    if (ann && bar && txt) {
        txt.innerHTML = '<strong>⚡ ' + ann.title + '</strong> — ' + ann.text;
        bar.classList.remove('gone');
    } else if (bar) {
        bar.classList.add('gone');
    }
}

/* ══════════════════════════════════════
   ФОТО СОТРУДНИКОВ
   Хранятся в localStorage как base64
══════════════════════════════════════ */
const STAFF_KEYS = {
    1: { key:'staff_photo_director',  avatar:'director',  fallbackIcon:'fa-user-tie' },
    2: { key:'staff_photo_engineer',  avatar:'engineer',  fallbackIcon:'fa-hard-hat' },
    3: { key:'staff_photo_ideology',  avatar:'ideology',  fallbackIcon:'fa-bullhorn' },
    4: { key:'staff_photo_energetic', avatar:'energetic', fallbackIcon:'fa-bolt' },
};

function renderStaffPhotos() {
    Object.entries(STAFF_KEYS).forEach(([id, info]) => {
        const el = document.getElementById('staff-av-' + id);
        if (!el) return;
        const photo = DB.get(info.key, null);
        if (photo) {
            el.innerHTML = `<img src="${photo}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
        } else {
            el.innerHTML = STAFF_AVATARS[info.avatar] || `<i class="fas ${info.fallbackIcon}"></i>`;
        }
    });
}

function uploadStaffPhoto(staffId) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp';
    input.onchange = function() {
        const file = input.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { toast('Фото слишком большое (макс. 5 МБ)', 'err'); return; }
        const reader = new FileReader();
        reader.onload = function(e) {
            const key = STAFF_KEYS[staffId]?.key;
            if (key) {
                DB.set(key, e.target.result);
                renderStaffPhotos();
                toast('Фото загружено!', 'ok');
            }
        };
        reader.readAsDataURL(file);
    };
    input.click();
}

/* ══════════════════════════════════════
   ЛАЙТБОКС (полноэкранный просмотр фото)
══════════════════════════════════════ */
let lbPhotos = [];
let lbIndex = 0;

function openLightbox(photos, idx) {
    lbPhotos = photos;
    lbIndex = idx;
    const ov = document.getElementById('lightbox');
    const img = document.getElementById('lb-img');
    img.src = photos[idx];
    ov.classList.add('on');
    document.body.style.overflow = 'hidden';
    document.getElementById('lb-prev').style.display = photos.length > 1 ? 'flex' : 'none';
    document.getElementById('lb-next').style.display = photos.length > 1 ? 'flex' : 'none';
}
function closeLightbox() {
    document.getElementById('lightbox').classList.remove('on');
    document.body.style.overflow = '';
}
function lbStep(dir) {
    lbIndex = (lbIndex + dir + lbPhotos.length) % lbPhotos.length;
    document.getElementById('lb-img').src = lbPhotos[lbIndex];
    // Синхронизация миниатюр
    document.querySelectorAll('.nm-gallery-thumb').forEach((t, i) => {
        t.classList.toggle('active', i === lbIndex);
    });
}
document.getElementById('lightbox')?.addEventListener('click', function(e) {
    if (e.target === this || e.target === document.getElementById('lb-img')) return;
    closeLightbox();
});
document.getElementById('lb-img')?.addEventListener('click', e => e.stopPropagation());
document.addEventListener('keydown', e => {
    if (!document.getElementById('lightbox')?.classList.contains('on')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lbStep(-1);
    if (e.key === 'ArrowRight') lbStep(1);
});

/* ══════════════════════════════════════
   НОВОСТНОЙ МОДАЛЬНЫЙ POPUP (ПОДРОБНЕЕ)
   Показывает полный текст + галерею фото
══════════════════════════════════════ */
let currentNewsPhotos = [];

function openNewsModal(newsId) {
    const all = DB.get('news', []);
    const n = all.find(x => x.id === newsId);
    if (!n) return;

    currentNewsPhotos = n.photos || [];
    const box = document.getElementById('news-modal-box');
    const typeMap = { work:'🔧 Ремонт', quality:'💧 Качество', emergency:'⚠️ Важно', general:'📋 Общее' };
    const typeClasses = { work:'nc-type work', quality:'nc-type quality', emergency:'nc-type emergency', general:'nc-type general' };

    // Галерея
    let galleryHtml = '';
    if (currentNewsPhotos.length) {
        const thumbs = currentNewsPhotos.map((p, i) => `
            <img src="${p}" class="nm-gallery-thumb${i === 0 ? ' active' : ''}"
                 onclick="setNmThumb(this, '${p}', ${i})" loading="lazy">
        `).join('');
        galleryHtml = `
            <div class="nm-gallery">
                <div class="nm-gallery-main">
                    <img id="nm-main-img" src="${currentNewsPhotos[0]}" alt="${esc(n.title)}"
                         onclick="openLightbox(currentNewsPhotos, 0)" style="cursor:zoom-in">
                    ${currentNewsPhotos.length > 1 ? `
                        <button class="nm-gallery-arr prev" onclick="nmGalleryStep(-1)"><i class="fas fa-chevron-left"></i></button>
                        <button class="nm-gallery-arr next" onclick="nmGalleryStep(1)"><i class="fas fa-chevron-right"></i></button>
                    ` : ''}
                </div>
                ${currentNewsPhotos.length > 1 ? `
                    <div class="nm-gallery-nav">
                        ${thumbs}
                        <div class="nm-gallery-count"><i class="fas fa-images"></i> ${currentNewsPhotos.length} фото</div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    document.getElementById('nm-content').innerHTML = `
        <div class="${typeClasses[n.type] || 'nc-type general'} nm-type">${typeMap[n.type] || '📋 Новость'}</div>
        <h2 class="nm-title">${n.title}</h2>
        <div class="nm-meta"><i class="fas fa-calendar-alt"></i> ${fmtDate(n.date)}</div>
        ${galleryHtml}
        <div class="nm-text">${n.text.replace(/\n/g, '<br>')}</div>
    `;

    document.getElementById('news-modal-ov').classList.add('on');
    document.body.style.overflow = 'hidden';
}
function closeNewsModal() {
    document.getElementById('news-modal-ov').classList.remove('on');
    document.body.style.overflow = '';
}
document.getElementById('news-modal-ov')?.addEventListener('click', function(e) {
    if (e.target === this) closeNewsModal();
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.getElementById('news-modal-ov')?.classList.contains('on')) closeNewsModal();
});

let nmCurrentIdx = 0;
function setNmThumb(thumb, src, idx) {
    nmCurrentIdx = idx;
    document.getElementById('nm-main-img').src = src;
    document.querySelectorAll('.nm-gallery-thumb').forEach((t, i) => t.classList.toggle('active', i === idx));
}
function nmGalleryStep(dir) {
    const photos = currentNewsPhotos;
    if (!photos.length) return;
    nmCurrentIdx = (nmCurrentIdx + dir + photos.length) % photos.length;
    document.getElementById('nm-main-img').src = photos[nmCurrentIdx];
    document.querySelectorAll('.nm-gallery-thumb').forEach((t, i) => t.classList.toggle('active', i === nmCurrentIdx));
}

/* ══════════════════════════════════════
   РЕНДЕР НОВОСТЕЙ
══════════════════════════════════════ */
const NTYPE = { work:'Ремонт', quality:'Качество', emergency:'Аварийное', general:'Общее' };
function fmtDate(d) {
    if (!d) return '';
    const months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
    if (d.includes('-')) {
        const [y, m, dd] = d.split('-');
        return parseInt(dd) + ' ' + months[parseInt(m) - 1] + ' ' + y;
    }
    return d;
}
function renderNews() {
    const all = DB.get('news', []);
    const cont = document.getElementById('news-list');
    if (!cont) return;
    if (!all.length) { cont.innerHTML = '<p style="color:var(--text-m)">Новостей пока нет.</p>'; return; }
    const lang = DB.get('lang', 'ru');
    const readMore = LANG[lang]?.read_more || 'Подробнее';
    const typeMap = { work:'🔧 Ремонт', quality:'💧 Качество', emergency:'⚠️ Важно', general:'📋 Новость' };

    cont.innerHTML = all.slice(0, 6).map(n => {
        const photos = n.photos || [];
        const coverHtml = photos.length ? `
            <div class="nc-cover">
                <img src="${photos[0]}" alt="${esc(n.title)}" loading="lazy">
                ${photos.length > 1 ? `<div class="nc-cover-count"><i class="fas fa-images"></i> ${photos.length}</div>` : ''}
            </div>
        ` : '';
        const shortText = n.text.length > 120 ? n.text.substring(0, 120).replace(/\n/g, ' ') + '…' : n.text.replace(/\n/g, ' ');
        return `
            <div class="nc">
                ${coverHtml}
                <div class="nc-body">
                    <div class="nc-type ${n.type}">${typeMap[n.type] || '📋'}</div>
                    <div class="nc-title">${n.title}</div>
                    <div class="nc-text">${shortText}</div>
                    <div class="nc-meta">
                        <div class="nc-date"><i class="fas fa-calendar-alt"></i> ${fmtDate(n.date)}</div>
                        <button class="nc-more" onclick="openNewsModal(${n.id})">${readMore} <i class="fas fa-arrow-right"></i></button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/* ── Заявка ── */
function submitApply(e) {
    e.preventDefault();
    const name    = document.getElementById('ap-name').value.trim();
    const phone   = document.getElementById('ap-phone').value.trim();
    const address = document.getElementById('ap-addr').value.trim();
    const type    = document.getElementById('ap-type').value;
    const text    = document.getElementById('ap-text').value.trim();
    const apps    = DB.get('applications', []);
    const newId   = apps.length ? Math.max(...apps.map(a => a.id)) + 1 : 1;
    const date    = new Date().toLocaleDateString('ru-RU');
    apps.unshift({ id: newId, name, phone, address, type, text, date, status:'Новая' });
    DB.set('applications', apps);
    e.target.reset();
    updateBadge();
    showModal('✅ Заявка принята!',
        'Уважаемый(ая) <strong>' + name + '</strong>!<br><br>' +
        'Ваша заявка <strong>№' + newId + '</strong> (<em>' + type + '</em>) успешно зарегистрирована.<br>' +
        'Мы свяжемся с вами по номеру <strong>' + phone + '</strong> в рабочее время (пн–пт 08:00–17:00).<br><br>' +
        '<em>Аварийные ситуации круглосуточно:</em> <a href="tel:80234098217" style="color:var(--primary);font-weight:700">8 (02340) 9-82-17</a>'
    );
    toast('Заявка №' + newId + ' отправлена!', 'ok');
}

/* ── Сервисные модалки ── */
const SVC = {
    consultation: { t:'Консультации', b:'Наши специалисты помогут с расчётом платежей, регистрацией счётчика, разъяснением нормативов.<br><br><b>Абонентный отдел (физ. лица):</b><br><a href="tel:80234098228" style="color:var(--primary)">8 (02340) 9-82-28</a><br>Пн–Пт: 08:00–17:00' },
    emergency:    { t:'Аварийная служба', b:'<b>📞 Аварийная служба — КРУГЛОСУТОЧНО!</b><br><br>Звоните при:<br>• Прорыве водопроводной трубы<br>• Засоре канализации<br>• Отсутствии воды<br>• Подтоплении подвала<br><br><b>Телефон:</b> <a href="tel:80234098217" style="color:var(--primary)">8 (02340) 9-82-17</a>' },
    connection:   { t:'Подключение к сети', b:'Порядок подключения:<br>1. Заявка на технические условия<br>2. Получение ТУ (10 раб. дней)<br>3. Разработка проекта<br>4. Согласование и врезка<br>5. Договор на обслуживание<br><br>Срок: от 30 дней. Стоимость по тарифам.' },
    docs:         { t:'Справки и документы', b:'Выдаём:<br>• Справка об отсутствии задолженности<br>• Технические условия<br>• Характеристика сетей<br>• Акт разграничения<br><br>Кабинет 101 или по e-mail: <a href="mailto:info-rechitsa@gomelvodokanal.by">info-rechitsa@gomelvodokanal.by</a>' },
    counter:      { t:'Поверка счётчиков', b:'Поверка счётчиков проводится раз в 4 года. Специалист выезжает на дом, процедура занимает 15–30 мин.<br><br>Запись: <a href="tel:80234098228">8 (02340) 9-82-28</a><br>Стоимость выезда: <b>32 руб.</b>' },
    analysis:     { t:'Анализ воды', b:'Аккредитованная лаборатория проводит химический и микробиологический анализ воды по заявкам граждан.<br><br>Запись: <a href="tel:+375291087629">+375 (29) 108-76-29</a>' },
    debt:         { t:'Оплата и задолженность', b:'Оплатить можно:<br>• В кассе абонентского отдела (каб. 101, Пн–Пт 08:00–17:00)<br>• Через ЕРИП (раздел «ЖКХ» → «Речицаводоканал»)<br>• По e-mail с запросом квитанции<br><br>Телефон: <a href="tel:80234098228" style="color:var(--primary)">8 (02340) 9-82-28</a>' },
    sewage:       { t:'Водоотведение', b:'Услуги:<br>• Прочистка засоров (гидропромывка)<br>• Ремонт и замена участков труб<br>• Откачка септиков<br><br>Аварийная: <a href="tel:80234098217" style="color:var(--primary)">8 (02340) 9-82-17</a>' },
};
function showSvc(id) { const s = SVC[id]; if (s) showModal(s.t, s.b); }

/* ── Тарифные вкладки ── */
function switchTariff(id, btn) {
    document.querySelectorAll('.tariff-pane').forEach(p => p.classList.remove('on'));
    document.querySelectorAll('.tariff-tab').forEach(t => t.classList.remove('on'));
    document.getElementById('tp-' + id).classList.add('on');
    btn.classList.add('on');
}

/* ══════════════════════════════════════
   АДМИН-ПАНЕЛЬ
══════════════════════════════════════ */
let admLogged = false;
let admTab = 'dashboard';

function openAdmin() {
    document.getElementById('adm-ov').classList.add('on');
    const sb = document.getElementById('adm-sb');
    if (admLogged) { sb.style.display = ''; showAdmContent(); }
    else { sb.style.display = 'none'; }
}
function closeAdmin() { document.getElementById('adm-ov').classList.remove('on'); }
document.getElementById('adm-ov').addEventListener('click', e => { if (e.target === document.getElementById('adm-ov')) closeAdmin(); });

function admLogin(e) {
    e.preventDefault();
    const u = document.getElementById('adm-u').value.trim();
    const p = document.getElementById('adm-p').value;
    const saved = DB.get('adm_pass', 'admin123');
    if ((u === 'admin' || u.toLowerCase() === 'administrator') && p === saved) {
        admLogged = true;
        document.getElementById('adm-username').textContent = u;
        document.getElementById('adm-sb').style.display = '';
        showAdmContent();
        toast('Добро пожаловать, ' + u + '!', 'ok');
    } else {
        toast('Неверный логин или пароль', 'err');
        document.getElementById('adm-p').value = '';
    }
}
function showAdmContent() {
    document.getElementById('adm-login').style.display = 'none';
    document.getElementById('adm-content').style.display = 'flex';
    switchAdmTab('dashboard');
    updateBadge();
}
function admLogout() {
    admLogged = false;
    document.getElementById('adm-content').style.display = 'none';
    document.getElementById('adm-sb').style.display = 'none';
    document.getElementById('adm-login').style.display = 'flex';
    document.getElementById('adm-u').value = '';
    document.getElementById('adm-p').value = '';
    closeAdmin();
    toast('Вы вышли из системы', 'info');
}
function switchAdmTab(tab) {
    admTab = tab;
    document.querySelectorAll('.adm-sec').forEach(s => s.classList.remove('on'));
    document.querySelectorAll('.adm-nb').forEach(b => b.classList.remove('on'));
    const sec = document.getElementById('adm-' + tab);
    if (sec) sec.classList.add('on');
    document.querySelectorAll('.adm-nb').forEach(b => {
        if (b.getAttribute('onclick')?.includes("'" + tab + "'")) b.classList.add('on');
    });
    const titles = { dashboard:'Панель управления', applications:'Заявки граждан', news:'Управление новостями', tariffs:'Редактор тарифов', quality:'Качество воды', announcements:'Объявления', settings:'Настройки', staff_photos:'Фото сотрудников' };
    document.getElementById('adm-top-ttl').textContent = titles[tab] || tab;
    const renderers = { dashboard:renderAdmDash, applications:renderAdmApps, news:renderAdmNews, tariffs:renderAdmTariffs, quality:renderAdmQuality, announcements:renderAdmAnns };
    if (renderers[tab]) renderers[tab]();
    if (tab === 'staff_photos') renderAdmStaffPhotos();
}
function updateBadge() {
    const apps = DB.get('applications', []);
    const cnt  = apps.filter(a => a.status === 'Новая').length;
    const b1   = document.getElementById('adm-badge');
    const b2   = document.getElementById('adm-cnt');
    if (cnt > 0) { b1.textContent = cnt; b1.style.display = 'flex'; if (b2) { b2.textContent = cnt; b2.style.display = 'inline'; } }
    else { b1.style.display = 'none'; if (b2) b2.style.display = 'none'; }
}

/* --- Dashboard --- */
function renderAdmDash() {
    const apps = DB.get('applications', []);
    const news = DB.get('news', []);
    const anns = DB.get('announcements', []);
    const nc   = apps.filter(a => a.status === 'Новая').length;
    document.getElementById('adm-dash-stats').innerHTML = `
        <div class="ds"><div class="ds-num">${apps.length}</div><div class="ds-lbl">Всего заявок</div></div>
        <div class="ds"><div class="ds-num" style="color:#42a5f5">${nc}</div><div class="ds-lbl">Новых</div></div>
        <div class="ds"><div class="ds-num" style="color:#66bb6a">${news.length}</div><div class="ds-lbl">Новостей</div></div>
        <div class="ds"><div class="ds-num" style="color:#ffa726">${anns.length}</div><div class="ds-lbl">Объявлений</div></div>
    `;
    document.getElementById('adm-dash-apps').innerHTML = apps.slice(0, 8).map(a => `
        <tr>
            <td><b>#${a.id}</b></td><td>${a.name}</td><td>${a.type}</td>
            <td style="font-family:var(--fm);font-size:.78rem">${a.date}</td>
            <td>${sbadge(a.status)}</td>
            <td>${abtns(a.id)}</td>
        </tr>
    `).join('') || '<tr><td colspan="6" style="text-align:center;color:rgba(255,255,255,.35);padding:28px">Заявок нет</td></tr>';
}

/* --- Applications --- */
function renderAdmApps() {
    const apps = DB.get('applications', []);
    const fv   = document.getElementById('apps-filter')?.value || '';
    const list = fv ? apps.filter(a => a.status === fv) : apps;
    document.getElementById('adm-apps-body').innerHTML = list.map(a => `
        <tr>
            <td><b>#${a.id}</b></td>
            <td>${a.name}</td>
            <td style="font-family:var(--fm);font-size:.78rem">${a.phone}</td>
            <td>${a.type}</td>
            <td>${a.address || '—'}</td>
            <td style="font-family:var(--fm);font-size:.78rem">${a.date}</td>
            <td>
                <select class="fc" style="padding:5px 8px;font-size:.76rem;background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.15);color:#fff;width:auto;min-width:106px"
                    onchange="changeStatus(${a.id},this.value)">
                    <option value="Новая"     ${a.status==='Новая'?'selected':''}>Новая</option>
                    <option value="В работе"  ${a.status==='В работе'?'selected':''}>В работе</option>
                    <option value="Выполнена" ${a.status==='Выполнена'?'selected':''}>Выполнена</option>
                    <option value="Отклонена" ${a.status==='Отклонена'?'selected':''}>Отклонена</option>
                </select>
            </td>
            <td>${abtns(a.id)}</td>
        </tr>
    `).join('') || '<tr><td colspan="8" style="text-align:center;color:rgba(255,255,255,.35);padding:28px">Заявок нет</td></tr>';
}
function changeStatus(id, s) {
    const apps = DB.get('applications', []);
    const a = apps.find(x => x.id === id);
    if (a) { a.status = s; DB.set('applications', apps); updateBadge(); toast('Статус #' + id + ': ' + s, 'ok'); }
}
function viewApp(id) {
    const a = DB.get('applications', []).find(x => x.id === id);
    if (!a) return;
    showModal('Заявка #' + a.id,
        '<b>Заявитель:</b> ' + a.name + '<br><b>Телефон:</b> ' + a.phone + '<br>' +
        '<b>Адрес:</b> ' + (a.address || '—') + '<br><b>Тип:</b> ' + a.type + '<br>' +
        '<b>Описание:</b> ' + (a.text || '—') + '<br><b>Дата:</b> ' + a.date + '<br><b>Статус:</b> ' + a.status);
}
function deleteApp(id) {
    if (!confirm('Удалить заявку #' + id + '?')) return;
    DB.set('applications', DB.get('applications', []).filter(x => x.id !== id));
    renderAdmApps(); renderAdmDash(); updateBadge();
    toast('Заявка #' + id + ' удалена', 'warn');
}
function sbadge(s) {
    const m = { 'Новая':'sb-new', 'В работе':'sb-proc', 'Выполнена':'sb-done', 'Отклонена':'sb-rej' };
    return '<span class="sb-badge ' + (m[s] || '') + '">' + s + '</span>';
}
function abtns(id) {
    return '<div class="abtns">' +
        '<button class="ab ab-v" onclick="viewApp(' + id + ')" title="Просмотр"><i class="fas fa-eye"></i></button>' +
        '<button class="ab ab-d" onclick="deleteApp(' + id + ')" title="Удалить"><i class="fas fa-trash"></i></button>' +
        '</div>';
}

/* --- News Admin --- */
// Текущие фото редактируемой новости
let editNewsPhotos = [];

function renderAdmNews() {
    const news = DB.get('news', []);
    document.getElementById('adm-news-body').innerHTML = news.map(n => `
        <tr>
            <td><b>#${n.id}</b></td>
            <td>${n.title}</td>
            <td style="font-family:var(--fm);font-size:.76rem">${fmtDate(n.date)}</td>
            <td><span class="nc-type ${n.type}" style="font-size:.68rem">${NTYPE[n.type]||n.type}</span></td>
            <td>${(n.photos||[]).length ? '<span style="color:#66bb6a;font-weight:700"><i class="fas fa-images"></i> ' + n.photos.length + '</span>' : '—'}</td>
            <td><div class="abtns">
                <button class="ab ab-e" onclick="editNews(${n.id})"><i class="fas fa-edit"></i></button>
                <button class="ab ab-d" onclick="deleteNews(${n.id})"><i class="fas fa-trash"></i></button>
            </div></td>
        </tr>
    `).join('') || '<tr><td colspan="6" style="text-align:center;color:rgba(255,255,255,.35);padding:24px">Новостей нет</td></tr>';
    const nd = document.getElementById('n-date');
    if (nd && !nd.value) nd.value = new Date().toISOString().split('T')[0];
}

function handlePhotoUpload(input) {
    const files = Array.from(input.files).slice(0, 5 - editNewsPhotos.length);
    if (!files.length) return;
    files.forEach(file => {
        if (file.size > 3 * 1024 * 1024) { toast('Фото слишком большое (макс. 3 МБ)', 'err'); return; }
        const r = new FileReader();
        r.onload = ev => {
            editNewsPhotos.push(ev.target.result);
            renderPhotoPreviews();
            toast('Фото добавлено', 'ok');
        };
        r.readAsDataURL(file);
    });
    input.value = '';
}
function renderPhotoPreviews() {
    const cont = document.getElementById('n-photo-previews');
    if (!cont) return;
    cont.innerHTML = editNewsPhotos.map((p, i) => `
        <div class="photo-preview-item">
            <img src="${p}" alt="">
            <button class="rm-photo" onclick="removePhoto(${i})"><i class="fas fa-times"></i></button>
        </div>
    `).join('');
    document.getElementById('n-photo-count').textContent = editNewsPhotos.length + '/5 фото';
}
function removePhoto(i) { editNewsPhotos.splice(i, 1); renderPhotoPreviews(); }

function saveNews(e) {
    e.preventDefault();
    const news = DB.get('news', []);
    const eid  = document.getElementById('n-eid').value;
    const obj  = {
        id:    eid ? parseInt(eid) : (news.length ? Math.max(...news.map(x => x.id)) + 1 : 1),
        title: document.getElementById('n-title').value,
        text:  document.getElementById('n-text').value,
        type:  document.getElementById('n-type').value,
        date:  document.getElementById('n-date').value,
        photos: [...editNewsPhotos],
    };
    if (eid) { const i = news.findIndex(x => x.id === parseInt(eid)); if (i !== -1) news[i] = obj; }
    else news.unshift(obj);
    DB.set('news', news);
    document.getElementById('n-eid').value = '';
    document.getElementById('news-form-ttl').innerHTML = '<i class="fas fa-plus"></i> Добавить новость';
    editNewsPhotos = [];
    renderPhotoPreviews();
    e.target.reset();
    document.getElementById('n-date').value = new Date().toISOString().split('T')[0];
    renderAdmNews(); renderNews();
    toast(eid ? 'Новость обновлена!' : 'Новость добавлена!', 'ok');
}
function editNews(id) {
    const n = DB.get('news', []).find(x => x.id === id);
    if (!n) return;
    document.getElementById('n-eid').value   = id;
    document.getElementById('n-title').value = n.title;
    document.getElementById('n-text').value  = n.text;
    document.getElementById('n-type').value  = n.type;
    document.getElementById('n-date').value  = n.date;
    editNewsPhotos = [...(n.photos || [])];
    renderPhotoPreviews();
    document.getElementById('news-form-ttl').innerHTML = '<i class="fas fa-edit"></i> Редактировать новость';
    document.getElementById('adm-news').scrollIntoView({ behavior:'smooth' });
}
function deleteNews(id) {
    if (!confirm('Удалить новость?')) return;
    DB.set('news', DB.get('news', []).filter(x => x.id !== id));
    renderAdmNews(); renderNews();
    toast('Новость удалена', 'warn');
}

/* --- Admin Staff Photos --- */
function renderAdmStaffPhotos() {
    const staffList = [
        { id:1, key:'staff_photo_director',  name:'Борисенко И. А.',   role:'Директор',          avatar:'director'  },
        { id:2, key:'staff_photo_engineer',  name:'Романов С. А.',     role:'Главный инженер',    avatar:'engineer'  },
        { id:3, key:'staff_photo_ideology',  name:'Тимощенко В. Н.',  role:'Зам. по идеологии', avatar:'ideology'  },
        { id:4, key:'staff_photo_energetic', name:'Страпко В. Н.',    role:'Главный энергетик',  avatar:'energetic' },
    ];
    const cont = document.getElementById('adm-staff-photos');
    if (!cont) return;
    cont.innerHTML = staffList.map(s => {
        const photo = DB.get(s.key, null);
        const imgHtml = photo
            ? `<img src="${photo}" style="width:80px;height:80px;object-fit:cover;border-radius:50%;border:3px solid var(--accent)">`
            : `<div style="width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,.1);border:3px solid rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:1.6rem">${STAFF_AVATARS[s.avatar] || '👤'}</div>`;
        return `
            <div style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);border-radius:12px;padding:20px;text-align:center">
                <div style="margin-bottom:12px">${imgHtml}</div>
                <div style="color:#fff;font-weight:700;font-size:.9rem;margin-bottom:2px">${s.name}</div>
                <div style="color:var(--accent);font-size:.72rem;text-transform:uppercase;letter-spacing:.04em;margin-bottom:12px">${s.role}</div>
                <div style="display:flex;flex-direction:column;gap:6px">
                    <button class="btn btn-a btn-sm btn-bl" onclick="uploadStaffPhoto(${s.id})">
                        <i class="fas fa-camera"></i> Загрузить фото
                    </button>
                    ${photo ? `<button class="btn btn-sm btn-bl" onclick="removeStaffPhoto('${s.key}')" style="background:rgba(229,57,53,.2);color:#ef5350">
                        <i class="fas fa-trash"></i> Удалить фото
                    </button>` : ''}
                </div>
            </div>
        `;
    }).join('');
}
function removeStaffPhoto(key) {
    DB.set(key, null);
    renderAdmStaffPhotos();
    renderStaffPhotos();
    toast('Фото удалено', 'warn');
}

/* --- Tariffs Admin --- */
function renderAdmTariffs() {
    const t = DB.get('tariffs_pop', []);
    document.getElementById('adm-tariffs-rows').innerHTML = t.map((r, i) => `
        <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr 36px;gap:8px;margin-bottom:8px;align-items:center">
            <input class="fc" value="${esc(r.service)}"  oninput="updTariff(${i},'service',this.value)" placeholder="Услуга">
            <input class="fc" value="${esc(r.unit)}"     oninput="updTariff(${i},'unit',this.value)"    placeholder="Ед.">
            <input class="fc" value="${esc(r.price)}"    oninput="updTariff(${i},'price',this.value)"   placeholder="Тариф">
            <input class="fc" value="${esc(r.subsidy)}"  oninput="updTariff(${i},'subsidy',this.value)" placeholder="Субс.">
            <button class="ab ab-d" onclick="delTariff(${i})"><i class="fas fa-trash"></i></button>
        </div>
    `).join('');
}
function updTariff(i, f, v) { const t = DB.get('tariffs_pop', []); if (t[i]) { t[i][f] = v; DB.set('tariffs_pop', t); renderTariffsPublic(); } }
function delTariff(i) { const t = DB.get('tariffs_pop', []); t.splice(i, 1); DB.set('tariffs_pop', t); renderAdmTariffs(); renderTariffsPublic(); toast('Строка удалена', 'warn'); }
function addTariff() { const t = DB.get('tariffs_pop', []); t.push({ service:'Новая услуга', unit:'1 м³', price:'0,00 руб.', subsidy:'—' }); DB.set('tariffs_pop', t); renderAdmTariffs(); renderTariffsPublic(); }

/* --- Quality Admin --- */
function renderAdmQuality() {
    const data = DB.get('quality', []);
    const dv   = DB.get('quality_date', '');
    document.getElementById('q-date-inp').value = dv;
    document.getElementById('adm-quality-rows').innerHTML = data.map((q, i) => `
        <div style="display:grid;grid-template-columns:36px 1.8fr 1fr 1fr 80px 56px;gap:8px;margin-bottom:8px;align-items:center">
            <input class="fc" value="${q.icon}" oninput="updQual(${i},'icon',this.value)" style="text-align:center;font-size:1.1rem;padding:8px 4px" maxlength="3">
            <input class="fc" value="${esc(q.name)}"  oninput="updQual(${i},'name',this.value)"  placeholder="Показатель">
            <input class="fc" value="${esc(q.value)}" oninput="updQual(${i},'value',this.value)" placeholder="Значение">
            <input class="fc" value="${esc(q.norm)}"  oninput="updQual(${i},'norm',this.value)"  placeholder="Норма">
            <input type="number" class="fc" value="${q.pct}" min="0" max="100" oninput="updQual(${i},'pct',parseInt(this.value)||0)">
            <select class="fc" style="padding:7px 4px" onchange="updQual(${i},'ok',this.value==='true')">
                <option value="true"  ${q.ok?'selected':''}>✓ OK</option>
                <option value="false" ${!q.ok?'selected':''}>⚠ Нет</option>
            </select>
        </div>
    `).join('');
}
function updQual(i, f, v) { const d = DB.get('quality', []); if (d[i]) { d[i][f] = v; DB.set('quality', d); } }
function saveQuality() { const dv = document.getElementById('q-date-inp').value; if (dv) DB.set('quality_date', dv); renderQuality(); toast('Данные о качестве воды сохранены!', 'ok'); }

/* --- Announcements Admin --- */
function renderAdmAnns() {
    const all = DB.get('announcements', []);
    document.getElementById('adm-anns-body').innerHTML = all.map(a => `
        <tr>
            <td><b>#${a.id}</b></td>
            <td>${a.title}</td>
            <td style="font-family:var(--fm);font-size:.76rem">${fmtDate(a.date)}</td>
            <td>${a.banner ? '<span class="sb-badge sb-done">Да</span>' : '<span class="sb-badge sb-rej">Нет</span>'}</td>
            <td><div class="abtns">
                <button class="ab ab-e" onclick="editAnn(${a.id})"><i class="fas fa-edit"></i></button>
                <button class="ab ab-d" onclick="deleteAnn(${a.id})"><i class="fas fa-trash"></i></button>
            </div></td>
        </tr>
    `).join('') || '<tr><td colspan="5" style="text-align:center;color:rgba(255,255,255,.35);padding:24px">Объявлений нет</td></tr>';
    const ad = document.getElementById('ann-date');
    if (ad && !ad.value) ad.value = new Date().toISOString().split('T')[0];
}
function saveAnn(e) {
    e.preventDefault();
    const all = DB.get('announcements', []);
    const eid = document.getElementById('ann-eid').value;
    const obj = { id: eid ? parseInt(eid) : (all.length ? Math.max(...all.map(x => x.id)) + 1 : 1), title: document.getElementById('ann-title').value, text: document.getElementById('ann-text').value, date: document.getElementById('ann-date').value, banner: document.getElementById('ann-banner').value === '1' };
    if (eid) { const i = all.findIndex(x => x.id === parseInt(eid)); if (i !== -1) all[i] = obj; } else all.unshift(obj);
    DB.set('announcements', all);
    document.getElementById('ann-eid').value = '';
    document.getElementById('ann-form-ttl').innerHTML = '<i class="fas fa-plus"></i> Добавить объявление';
    e.target.reset();
    document.getElementById('ann-date').value = new Date().toISOString().split('T')[0];
    renderAdmAnns(); renderAnns();
    toast(eid ? 'Объявление обновлено!' : 'Объявление добавлено!', 'ok');
}
function editAnn(id) {
    const a = DB.get('announcements', []).find(x => x.id === id);
    if (!a) return;
    document.getElementById('ann-eid').value    = id;
    document.getElementById('ann-title').value  = a.title;
    document.getElementById('ann-text').value   = a.text;
    document.getElementById('ann-date').value   = a.date;
    document.getElementById('ann-banner').value = a.banner ? '1' : '0';
    document.getElementById('ann-form-ttl').innerHTML = '<i class="fas fa-edit"></i> Редактировать';
}
function deleteAnn(id) {
    if (!confirm('Удалить объявление?')) return;
    DB.set('announcements', DB.get('announcements', []).filter(x => x.id !== id));
    renderAdmAnns(); renderAnns();
    toast('Объявление удалено', 'warn');
}

/* --- Settings --- */
function changePass() {
    const np = document.getElementById('new-pass').value;
    const cp = document.getElementById('conf-pass').value;
    if (!np || np.length < 6) { toast('Пароль должен быть не менее 6 символов', 'err'); return; }
    if (np !== cp) { toast('Пароли не совпадают', 'err'); return; }
    DB.set('adm_pass', np);
    document.getElementById('new-pass').value = '';
    document.getElementById('conf-pass').value = '';
    toast('Пароль успешно изменён!', 'ok');
}
function saveBanner() {
    const t = document.getElementById('banner-input').value;
    DB.set('banner_text', t);
    const el = document.getElementById('alert-txt');
    const bar = document.getElementById('alert-bar');
    if (t) { el.innerHTML = t; bar.classList.remove('gone'); }
    else bar.classList.add('gone');
    toast('Баннер обновлён!', 'ok');
}
function clearApps() {
    if (!confirm('Удалить ВСЕ заявки? Это нельзя отменить.')) return;
    DB.set('applications', []);
    renderAdmDash(); renderAdmApps(); updateBadge();
    toast('Все заявки удалены', 'warn');
}

/* ── Helpers ── */
function esc(s) { return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/'/g, "\\'").replace(/"/g, '&quot;'); }

/* ══════════════════════════════════════
   INIT
══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    const lang = DB.get('lang', 'ru');
    document.getElementById('lang-sel').value = lang;
    switchLang(lang);

    if (DB.get('acc', false)) {
        document.body.classList.add('acc-mode');
        document.getElementById('acc-btn').classList.add('on');
    }

    renderNews();
    renderAnns();
    renderQuality();
    renderTariffsPublic();
    renderStaffPhotos();
    updateBadge();

    const nd = document.getElementById('n-date');
    if (nd) nd.value = new Date().toISOString().split('T')[0];
    const ad = document.getElementById('ann-date');
    if (ad) ad.value = new Date().toISOString().split('T')[0];

    document.getElementById('modal-ov').addEventListener('click', e => {
        if (e.target === document.getElementById('modal-ov')) closeModal();
    });

    // Fade-up для секций которые уже видны
    document.querySelectorAll('.fu').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('in');
    });
});
