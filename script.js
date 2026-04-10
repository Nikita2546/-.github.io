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
    if (DB.get('init_v4', false)) return;
    DB.set('applications', [
        { id:1, name:'Иванов И.И.',      phone:'+375 29 123-45-67', address:'ул. Ленина, 12',     type:'Поверка/замена счётчика',   text:'Истёк срок поверки водомера.',              date:'02.04.2026', status:'Выполнена' },
        { id:2, name:'Петрова А.С.',     phone:'+375 29 234-56-78', address:'ул. Советская, 5',   type:'Жалоба на качество воды',   text:'Небольшое помутнение воды утром.',          date:'03.04.2026', status:'Выполнена' },
        { id:3, name:'Сидоров П.В.',     phone:'+375 44 345-67-89', address:'ул. Доватора, 18',   type:'Аварийная ситуация',         text:'Течь на водопроводе во дворе дома.',        date:'05.04.2026', status:'Выполнена' },
        { id:4, name:'Козлова Н.А.',     phone:'+375 33 456-78-90', address:'пр. Победы, 33',     type:'Подключение к водопроводу',  text:'Новый частный дом, нужно подключение.',    date:'07.04.2026', status:'В работе'  },
        { id:5, name:'Захаров В.С.',     phone:'+375 29 567-89-01', address:'ул. Калинина, 7',    type:'Выдача справки/документа',   text:'Справка об отсутствии задолженности.',     date:'08.04.2026', status:'Выполнена' },
        { id:6, name:'Мартынова О.В.',   phone:'+375 44 612-33-90', address:'ул. Пушкина, 14',    type:'Поверка/замена счётчика',   text:'Счётчик не крутится, показания стоят.',    date:'09.04.2026', status:'Новая'    },
        { id:7, name:'Кириченко А.Н.',   phone:'+375 29 771-55-12', address:'ул. Советская, 21',  type:'Жалоба на качество воды',   text:'Запах хлора из крана сильнее обычного.',   date:'09.04.2026', status:'Новая'    },
    ]);
    DB.set('news', [
        { id:1,
          title:'⚠️ Плановое отключение воды 14 апреля',
          text:'Уважаемые жители! 14 апреля 2026 года с 09:00 до 15:00 будет произведено плановое отключение холодного водоснабжения по адресам: ул. Калинина д. 1–19 (нечётные), пер. Лесной д. 2–8.\n\nПричина: замена запорной арматуры на магистральном водопроводе Ø200 мм. Просьба заблаговременно запастись водой.\n\nАварийная служба работает круглосуточно: 8 (02340) 9-82-17.',
          type:'emergency', date:'2026-04-08',
          photos:[
            'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80'
          ] },
        { id:2,
          title:'Профилактика насосных станций: апрель 2026',
          text:'В период с 7 по 18 апреля специалисты КПУП «Речицаводоканал» проводят плановое техническое обслуживание насосных станций №1, №3 и №5.\n\nНа станции №3 (ул. Калинина) заменены сальниковые уплотнения насосов и выполнена ревизия обратных клапанов. На станции №1 отрегулированы частотные преобразователи.\n\nРаботы ведутся в ночное время (23:00–05:00). Кратковременные снижения давления в сети в этот период являются плановыми.',
          type:'work', date:'2026-04-07',
          photos:[
            'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&q=80',
            'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80'
          ] },
        { id:3,
          title:'Итоги мониторинга качества воды за март 2026',
          text:'По итогам мониторинга за март 2026 года вода в г. Речица полностью соответствует санитарным нормам СТБ 1188-99. Проведено 512 анализов по 32 показателям — ни одного превышения.\n\nОстаточный хлор: 0,33 мг/л (норма 0,3–0,5). Железо общее: 0,22 мг/л (норма ≤0,3). Нитраты: 7,9 мг/л (норма ≤45). Все показатели в норме.\n\nЗаписаться на индивидуальный анализ воды в лаборатории: +375 (29) 108-76-29.',
          type:'quality', date:'2026-04-02',
          photos:[
            'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80',
            'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&q=80'
          ] },
        { id:4,
          title:'Замена труб на ул. Советской завершена',
          text:'С 24 по 30 марта 2026 года на участке ул. Советской (д. 12–34) заменено 220 метров водопроводных труб. Старые стальные трубы заменены на полиэтиленовые HDPE диаметром 110 мм со сроком службы более 50 лет.\n\nТрубопровод прошёл гидравлические испытания давлением 1,0 МПа и хлорирование. Водоснабжение всех 14 абонентских домов восстановлено в полном объёме.\n\nБлагодарим жителей за понимание.',
          type:'work', date:'2026-04-01',
          photos:[
            'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
            'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'
          ] },
        { id:5,
          title:'Тарифы на водоснабжение с 1 апреля 2026 года',
          text:'Решением Речицкого районного исполнительного комитета с 1 апреля 2026 года действуют следующие тарифы:\n\n• Холодное водоснабжение: 0,68 руб./м³ (субсидируемый 0,45 руб./м³ в пределах нормы)\n• Водоотведение: 0,54 руб./м³ (субсидируемый 0,36 руб./м³)\n• Норма: 5,0 м³ на человека в месяц.\n\nОплата: ЕРИП → «ЖКХ» → «Речицаводоканал», касса абонентского отдела (пн–пт 08:00–17:00) или e-mail.',
          type:'general', date:'2026-04-01',
          photos:[
            'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80'
          ] },
        { id:6,
          title:'Подготовка к летнему сезону: промывка сетей',
          text:'В апреле предприятие проводит плановую гидропневматическую промывку 42 км водопроводных сетей в жилых кварталах центральной части города.\n\nРаботы выполняются без отключения водоснабжения. Если заметили кратковременное помутнение воды — откройте кран холодной воды на 2–3 минуты, вода посветлеет.\n\nГрафик промывки: стенд в абонентском отделе, кабинет 101.',
          type:'general', date:'2026-03-28',
          photos:[
            'https://images.unsplash.com/photo-1602621585560-06b40b87f97b?w=800&q=80',
            'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80'
          ] },
    ]);
    DB.set('announcements', [
        { id:1, title:'Отключение 14 апреля', text:'ул. Калинина д. 1–19, пер. Лесной д. 2–8, с 09:00 до 15:00. Просьба запастись водой заранее.', date:'2026-04-14', banner:true },
    ]);
    DB.set('quality', [
        { name:'Цветность',         value:'3 град.',       norm:'≤20',      pct:15, ok:true,  icon:'🎨' },
        { name:'Мутность',          value:'0,7 ЕМФ',       norm:'≤2,6',     pct:27, ok:true,  icon:'🌫️' },
        { name:'pH',                value:'7,3',            norm:'6,0–9,0',  pct:38, ok:true,  icon:'🧪' },
        { name:'Жёсткость',         value:'4,6 мг-экв/л',  norm:'≤7,0',     pct:66, ok:true,  icon:'💎' },
        { name:'Железо (общее)',    value:'0,22 мг/л',     norm:'≤0,3',     pct:73, ok:true,  icon:'⚙️' },
        { name:'Нитраты',           value:'7,9 мг/л',      norm:'≤45',      pct:18, ok:true,  icon:'🌿' },
        { name:'Марганец',          value:'0,06 мг/л',     norm:'≤0,1',     pct:60, ok:true,  icon:'🔩' },
        { name:'Остаточный хлор',   value:'0,33 мг/л',     norm:'0,3–0,5',  pct:66, ok:true,  icon:'💧' },
    ]);
    DB.set('tariffs_pop', [
        { service:'Холодное водоснабжение',          unit:'1 м³',      price:'0,68 руб.', subsidy:'0,45 руб.' },
        { service:'Водоотведение (канализация)',      unit:'1 м³',      price:'0,54 руб.', subsidy:'0,36 руб.' },
        { service:'Вода из колонки (сверх нормы)',    unit:'1 м³',      price:'0,72 руб.', subsidy:'—' },
        { service:'Норма потребления (без счётчика)', unit:'чел./мес.', price:'5,0 м³',   subsidy:'—' },
    ]);
    DB.set('quality_date', 'март 2026');
    DB.set('adm_pass', 'admin123');
    DB.set('banner_text', '⚡ Плановое отключение воды: <strong>15 февраля с 09:00 до 14:00</strong> — ул. Ленина, д. 5–23.');
    // Фото руководства — пустые по умолчанию (ключ 'staff_photo_N')
    DB.set('init_v4', true);
}
initDB();

/* ── Переводы ── */
const LANG = {
    ru: {
        // Навигация
        nav_title:       'КПУП "Речицаводоканал"',
        nav_subtitle:    'Водоснабжение и водоотведение г. Речица',
        nav_home:        'Главная',
        nav_services:    'Услуги',
        nav_tariffs:     'Тарифы',
        nav_quality:     'Качество воды',
        nav_about:       'О предприятии',
        nav_staff:       'Сотрудники',
        nav_news:        'Новости',
        nav_apply:       'Заявка',
        nav_contacts:    'Контакты',
        // Hero
        hero_title:      'Чистая вода — <span>основа жизни</span> Речицы',
        hero_text:       'Коммунальное предприятие «Речицаводоканал» обеспечивает надёжное водоснабжение и водоотведение более чем для 80 000 жителей города и района с 1967 года.',
        hero_btn1:       'Подать заявку',
        hero_btn2:       'Позвонить',
        hero_badge:      'Официальный сайт',
        // Счётчики
        hero_stat1_num:  '80K+', hero_stat1_lbl: 'Жителей',
        hero_stat2_num:  '300+', hero_stat2_lbl: 'км сетей',
        hero_stat3_num:  '57',   hero_stat3_lbl: 'лет работы',
        hero_stat4_num:  '24/7', hero_stat4_lbl: 'Аварийная',
        // Услуги
        services_tag:    'Услуги',
        services_title:  'Что мы предоставляем',
        services_desc:   'Полный спектр услуг в сфере водоснабжения и водоотведения для жителей Речицы',
        svc1_title:      'Консультации',
        svc1_text:       'Помощь в расчёте платежей, подключении счётчиков и разъяснении нормативов.',
        svc2_title:      'Аварийная служба',
        svc2_text:       'Круглосуточно! Устранение протечек и аварий на водопроводных и канализационных сетях.',
        svc3_title:      'Подключение дома',
        svc3_text:       'Оформим техусловия и подключим ваш дом к водопроводу и канализации.',
        svc4_title:      'Справки и документы',
        svc4_text:       'Справка об отсутствии задолженности, технические условия и другие документы.',
        svc5_title:      'Поверка счётчиков',
        svc5_text:       'Метрологическая поверка и замена водомеров у вас дома без очередей.',
        svc6_title:      'Анализ воды',
        svc6_text:       'Выезд специалиста-лаборанта для проверки качества воды в вашем доме.',
        svc7_title:      'Оплата и задолженность',
        svc7_text:       'Проверить задолженность и оплатить услуги через ЕРИП, кассу или по e-mail.',
        svc8_title:      'Водоотведение',
        svc8_text:       'Прочистка засоров, гидропромывка, откачка септиков и обслуживание сетей.',
        svc_more:        'Подробнее',
        // Тарифы
        tariffs_tag:     'Тарифы',
        tariffs_title:   'Тарифы на услуги',
        tariffs_desc:    'Актуальные тарифы на водоснабжение и водоотведение для населения и организаций г. Речица',
        tab_pop:         'Население',
        tab_org:         'Организации',
        tab_conn:        'Подключение и услуги',
        tbl_service:     'Услуга',
        tbl_unit:        'Единица',
        tbl_price:       'Тариф (полный)',
        tbl_subsidy:     'Субсидируемый',
        tariff_note_pop: '<i class="fas fa-info-circle"></i> Субсидируемый тариф — в пределах нормы потребления для населения. Сверх нормы — полный тариф. Тарифы установлены решением Речицкого райисполкома.',
        // Качество воды
        quality_tag:     'Лаборатория',
        quality_title:   'Качество воды',
        quality_desc:    'Ежемесячный мониторинг показателей качества питьевой воды в Речице',
        quality_updated: 'Данные обновлены:',
        quality_std:     'Соответствует СТБ 1188-99',
        lab1_title:      'Производственная лаборатория',
        lab1_text:       'Аккредитованная лаборатория. Ежемесячно проводится более 500 анализов по 32 показателям.',
        lab1_btn:        'Записаться',
        lab2_title:      'Санитарный паспорт',
        lab2_text:       'Санитарный паспорт на питьевую воду обновляется ежеквартально. Подтверждает соответствие нормам.',
        lab2_btn:        'Сведения',
        lab3_title:      'Источники водоснабжения',
        lab3_text:       'Речица снабжается из 12 артезианских скважин глубиной 120–180 м. Подземный горизонт обеспечивает высокую защищённость.',
        lab3_btn:        'Подробнее',
        // О предприятии
        about_tag:       'О предприятии',
        about_h3:        'КПУП «Речицаводоканал» — надёжный поставщик воды с 1967 года',
        about_p1:        'Коммунальное производственное унитарное предприятие «Речицаводоканал» является основным оператором системы водоснабжения и канализации в Речице и прилегающих районах.',
        about_p2:        'Мы обеспечиваем бесперебойную подачу качественной питьевой воды, своевременный приём и очистку сточных вод, содержание и развитие инфраструктуры в интересах 80 000+ жителей.',
        feat1_title:     'Лауреат «Лучшее ЖКХ Беларуси-2025»',
        feat1_text:      'Победитель республиканского конкурса, номинация «Водоснабжение»',
        feat2_title:     'Сертификат ISO 9001:2015',
        feat2_text:      'Система менеджмента качества подтверждена международным стандартом',
        feat3_title:     'Экологическая программа 2024–2026',
        feat3_text:      'Снижение энергопотребления на 18%, потерь воды — на 15%',
        stat1_lbl:       'км водопровода',
        stat2_lbl:       'м³/сут. мощность',
        stat3_lbl:       'насосных станций',
        stat4_lbl:       'жителей в зоне',
        stat5_lbl:       'арт. скважин',
        stat6_lbl:       'сотрудников',
        // Сотрудники
        staff_tag:       'Коллектив',
        staff_title:     'Руководство и отделы',
        staff_desc:      'Нажмите на аватар в панели администратора, чтобы загрузить фото сотрудника',
        staff_photo_hint:'Фото руководства загружается через панель администратора',
        s1_name: 'Борисенко И. А.', s1_role: 'Директор',
        s2_name: 'Романов С. А.',   s2_role: 'Главный инженер',
        s3_name: 'Тимощенко В. Н.', s3_role: 'Зам. по идеологии',
        s4_name: 'Страпко В. Н.',   s4_role: 'Главный энергетик',
        s5_name: 'Абон. отдел',     s5_role: 'Физические лица',
        s6_name: 'Абон. отдел',     s6_role: 'Юридические лица',
        s7_name: 'Аварийная служба',s7_role: 'Круглосуточно 24/7',
        s8_name: 'Лаборатория',     s8_role: 'Контроль качества',
        // Новости
        news_tag:        'Новости',
        news_title:      'Новости Речицы',
        news_desc:       'Нажмите «Подробнее» чтобы прочитать полный текст и посмотреть все фото',
        read_more:       'Подробнее',
        // Заявка
        apply_tag:       'Обращения',
        apply_title:     'Подать заявку',
        apply_desc:      'Отправьте заявку онлайн — мы свяжемся с вами в рабочее время',
        apply_name:      'Имя *',
        apply_phone:     'Телефон *',
        apply_addr:      'Адрес',
        apply_type:      'Тип обращения *',
        apply_text:      'Описание',
        apply_btn:       'Отправить заявку',
        apply_type_ph:   '— Выберите —',
        apply_opt1:      'Аварийная ситуация',
        apply_opt2:      'Подключение к водопроводу',
        apply_opt3:      'Подключение к канализации',
        apply_opt4:      'Поверка/замена счётчика',
        apply_opt5:      'Жалоба на качество воды',
        apply_opt6:      'Выдача справки/документа',
        apply_opt7:      'Вопрос о задолженности',
        apply_opt8:      'Другое',
        ai1_title:       'Аварийная служба — 24/7',
        ai1_text:        'При прорыве трубы, засоре, отсутствии воды:',
        ai2_title:       'График работы',
        ai2_text:        'Пн–Пт: 08:00–17:00<br>Перерыв: 13:00–14:00<br>Сб–Вс: выходной',
        ai3_title:       'Срок обработки',
        ai3_text:        'Заявки рассматриваются в течение 3 рабочих дней. Аварийные — в течение 2 часов.',
        ai4_title:       'Личный приём',
        ai4_text:        'ул. Доватора, 22, г. Речица<br>Кабинет 101 (абонентный отдел)',
        // Контакты
        contacts_tag:    'Контакты',
        contacts_title:  'Свяжитесь с нами',
        emerg_title:     'Аварийная диспетчерская служба',
        emerg_text:      'Прорыв трубы, затопление, отсутствие воды — звоните немедленно!',
        ct1_title:       'Адрес',
        ct1_text:        '247500, г. Речица,<br>ул. Доватора, д. 22<br>Кабинет 101',
        ct2_title:       'Телефоны',
        ct2_text:        'Директор: <a href="tel:80234098213">9-82-13</a><br>Гл. инженер: <a href="tel:80234098211">9-82-11</a><br>Абон. отдел: <a href="tel:80234098228">9-82-28</a>',
        ct3_title:       'Email',
        ct3_text:        '<a href="mailto:info-rechitsa@gomelvodokanal.by">info-rechitsa@<br>gomelvodokanal.by</a>',
        ct4_title:       'График работы',
        ct4_text:        'Пн–Пт: 08:00–17:00<br>Перерыв: 13:00–14:00<br>Сб–Вс: выходной',
        ct5_title:       'Лаборатория',
        ct5_text:        '<a href="tel:+375291087629">+375 (29) 108-76-29</a><br>Пн–Пт: 08:00–16:00',
        ct6_title:       'Веб-сайт',
        ct6_text:        '<a href="https://gomelvodokanal.by" target="_blank">gomelvodokanal.by</a><br>УНП: 400163027',
        // Футер
        footer_about:    'Обеспечиваем надёжное водоснабжение и водоотведение г. Речица и Речицкого района с 1967 года.',
        footer_services: 'Услуги',
        footer_info:     'Информация',
        footer_contacts: 'Контакты',
        footer_copy:     '© 2026 КПУП «Речицаводоканал». Все права защищены.',
        footer_since:    'Служим Речице с 1967 года',
        // Поиск
        search_ph:       'Поиск по сайту...',
        // Мобильное меню
        mob_emerg:       'Аварийная: 9-82-17',
        footer_logo:     'КПУП "Речицаводоканал"',
        footer_emerg:    'Аварийная: 8 (02340) 9-82-17',
        fl_svc1: 'Консультации',  fl_svc2: 'Аварийная служба', fl_svc3: 'Подключение',
        fl_svc4: 'Анализ воды',   fl_svc5: 'Поверка счётчиков',
        fl_inf1: 'Тарифы',        fl_inf2: 'Качество воды',    fl_inf3: 'О предприятии',
        fl_inf4: 'Новости',       fl_inf5: 'Подать заявку',
        fl_ct1:  'ул. Доватора, 22, Речица',
        fl_ct2:  'Авар.: 8 (02340) 9-82-17',
        fl_ct3:  'Абон.: 8 (02340) 9-82-28',
        fl_ct4:  'Написать email',
        footer_up: 'Наверх ↑',
        mob_home: 'Главная',   mob_svc: 'Услуги',      mob_tar: 'Тарифы',
        mob_qual: 'Качество воды', mob_about: 'О предприятии', mob_staff: 'Руководство',
        mob_news: 'Новости',   mob_apply: 'Подать заявку', mob_ct: 'Контакты',
    },

    be: {
        // Навігацыя
        nav_title:       'КПУП "Рэчыцавадаканал"',
        nav_subtitle:    'Водазабеспячэнне і водаадвядзенне г. Рэчыца',
        nav_home:        'Галоўная',
        nav_services:    'Паслугі',
        nav_tariffs:     'Тарыфы',
        nav_quality:     'Якасць вады',
        nav_about:       'Аб прадпрыемстве',
        nav_staff:       'Супрацоўнікі',
        nav_news:        'Навіны',
        nav_apply:       'Заяўка',
        nav_contacts:    'Кантакты',
        // Герой
        hero_title:      'Чыстая вада — <span>аснова жыцця</span> Рэчыцы',
        hero_text:       'Камунальнае прадпрыемства «Рэчыцавадаканал» забяспечвае надзейнае водазабеспячэнне і водаадвядзенне для больш чым 80 000 жыхароў горада і раёна з 1967 года.',
        hero_btn1:       'Падаць заяўку',
        hero_btn2:       'Патэлефанаваць',
        hero_badge:      'Афіцыйны сайт',
        // Лічыльнікі
        hero_stat1_num:  '80K+', hero_stat1_lbl: 'Жыхароў',
        hero_stat2_num:  '300+', hero_stat2_lbl: 'км сетак',
        hero_stat3_num:  '57',   hero_stat3_lbl: 'гадоў працы',
        hero_stat4_num:  '24/7', hero_stat4_lbl: 'Аварыйная',
        // Паслугі
        services_tag:    'Паслугі',
        services_title:  'Што мы прадастаўляем',
        services_desc:   'Поўны спектр паслуг у сферы водазабеспячэння і водаадвядзення для жыхароў Рэчыцы',
        svc1_title:      'Кансультацыі',
        svc1_text:       'Дапамога ў разліку плацяжоў, падключэнні лічыльнікаў і тлумачэнні нарматываў.',
        svc2_title:      'Аварыйная служба',
        svc2_text:       'Цалавараванна! Ліквідацыя уцечак і аварый на водаправодных і каналізацыйных сетках.',
        svc3_title:      'Падключэнне дома',
        svc3_text:       'Аформім тэхумовы і падключым ваш дом да водаправода і каналізацыі.',
        svc4_title:      'Даведкі і дакументы',
        svc4_text:       'Даведка аб адсутнасці запазычанасці, тэхнічныя ўмовы і іншыя дакументы.',
        svc5_title:      'Праверка лічыльнікаў',
        svc5_text:       'Метралагічная праверка і замена вадамераў у вас дома без чэргаў.',
        svc6_title:      'Аналіз вады',
        svc6_text:       'Выезд спецыяліста-лабаранта для праверкі якасці вады ў вашым доме.',
        svc7_title:      'Аплата і запазычанасць',
        svc7_text:       'Праверыць запазычанасць і аплаціць паслугі праз ЕРЫП, касу або па e-mail.',
        svc8_title:      'Водаадвядзенне',
        svc8_text:       'Прачыстка засмечванняў, гідрапрамыўка, адпампоўка септыкаў і абслугоўванне сетак.',
        svc_more:        'Падрабязней',
        // Тарыфы
        tariffs_tag:     'Тарыфы',
        tariffs_title:   'Тарыфы на паслугі',
        tariffs_desc:    'Актуальныя тарыфы на водазабеспячэнне і водаадвядзенне для насельніцтва і арганізацый г. Рэчыца',
        tab_pop:         'Насельніцтва',
        tab_org:         'Арганізацыі',
        tab_conn:        'Падключэнне і паслугі',
        tbl_service:     'Паслуга',
        tbl_unit:        'Адзінка',
        tbl_price:       'Тарыф (поўны)',
        tbl_subsidy:     'Субсідуемы',
        tariff_note_pop: '<i class="fas fa-info-circle"></i> Субсідуемы тарыф — у межах нормы спажывання для насельніцтва. Звыш нормы — поўны тарыф. Тарыфы ўстаноўлены рашэннем Рэчыцкага райвыканкама.',
        // Якасць вады
        quality_tag:     'Лабараторыя',
        quality_title:   'Якасць вады',
        quality_desc:    'Штомесячны маніторынг паказчыкаў якасці пітной вады ў Рэчыцы',
        quality_updated: 'Дадзеныя абноўлены:',
        quality_std:     'Адпавядае СТБ 1188-99',
        lab1_title:      'Вытворчая лабараторыя',
        lab1_text:       'Акрэдытаваная лабараторыя. Штомесяц праводзіцца больш за 500 аналізаў па 32 паказчыках.',
        lab1_btn:        'Запісацца',
        lab2_title:      'Санітарны пашпарт',
        lab2_text:       'Санітарны пашпарт на пітную ваду абнаўляецца штоквартальна. Пацвярджае адпаведнасць нормам.',
        lab2_btn:        'Звесткі',
        lab3_title:      'Крыніцы водазабеспячэння',
        lab3_text:       'Рэчыца забяспечваецца з 12 артэзіянскіх свідравін глыбінёй 120–180 м. Падземны гарызонт забяспечвае высокую абароненасць.',
        lab3_btn:        'Падрабязней',
        // Аб прадпрыемстве
        about_tag:       'Аб прадпрыемстве',
        about_h3:        'КПУП «Рэчыцавадаканал» — надзейны пастаўшчык вады з 1967 года',
        about_p1:        'Камунальнае вытворчае ўнітарнае прадпрыемства «Рэчыцавадаканал» з\'яўляецца асноўным аператарам сістэмы водазабеспячэння і каналізацыі ў Рэчыцы і прылеглых раёнах.',
        about_p2:        'Мы забяспечваем бесперабойную падачу якаснай пітной вады, своечасовы прыём і ачыстку сцёкавых вод, утрыманне і развіццё інфраструктуры ў інтарэсах 80 000+ жыхароў.',
        feat1_title:     'Лаўрэат «Лепшае ЖКГ Беларусі-2025»',
        feat1_text:      'Пераможца рэспубліканскага конкурсу, намінацыя «Водазабеспячэнне»',
        feat2_title:     'Сертыфікат ISO 9001:2015',
        feat2_text:      'Сістэма менеджменту якасці пацверджана міжнародным стандартам',
        feat3_title:     'Экалагічная праграма 2024–2026',
        feat3_text:      'Зніжэнне энергаспажывання на 18%, страт вады — на 15%',
        stat1_lbl:       'км водаправода',
        stat2_lbl:       'м³/сут. магутнасць',
        stat3_lbl:       'насосных станцый',
        stat4_lbl:       'жыхароў у зоне',
        stat5_lbl:       'арт. свідравін',
        stat6_lbl:       'супрацоўнікаў',
        // Супрацоўнікі
        staff_tag:       'Калектыў',
        staff_title:     'Кіраўніцтва і аддзелы',
        staff_desc:      'Фота загружаецца праз панэль адміністратара',
        staff_photo_hint:'Фота кіраўніцтва загружаецца праз панэль адміністратара',
        s1_name: 'Барысенка І. А.', s1_role: 'Дырэктар',
        s2_name: 'Раманаў С. А.',   s2_role: 'Галоўны інжынер',
        s3_name: 'Цімашчэнка В. М.',s3_role: 'Нам. па ідэалогіі',
        s4_name: 'Страпко В. М.',   s4_role: 'Галоўны энергетык',
        s5_name: 'Абан. аддзел',    s5_role: 'Фізічныя асобы',
        s6_name: 'Абан. аддзел',    s6_role: 'Юрыдычныя асобы',
        s7_name: 'Аварыйная служба',s7_role: 'Цалавараванна 24/7',
        s8_name: 'Лабараторыя',     s8_role: 'Кантроль якасці',
        // Навіны
        news_tag:        'Навіны',
        news_title:      'Навіны Рэчыцы',
        news_desc:       'Націсніце «Падрабязней» каб прачытаць поўны тэкст і паглядзець усе фота',
        read_more:       'Падрабязней',
        // Заяўка
        apply_tag:       'Звароты',
        apply_title:     'Падаць заяўку',
        apply_desc:      'Дашліце заяўку анлайн — мы звяжамся з вамі ў працоўны час',
        apply_name:      'Імя *',
        apply_phone:     'Тэлефон *',
        apply_addr:      'Адрас',
        apply_type:      'Від звароту *',
        apply_text:      'Апісанне',
        apply_btn:       'Адправіць заяўку',
        apply_type_ph:   '— Выберыце —',
        apply_opt1:      'Аварыйная сітуацыя',
        apply_opt2:      'Падключэнне да водаправода',
        apply_opt3:      'Падключэнне да каналізацыі',
        apply_opt4:      'Праверка/замена лічыльніка',
        apply_opt5:      'Скарга на якасць вады',
        apply_opt6:      'Выдача даведкі/дакумента',
        apply_opt7:      'Пытанне пра запазычанасць',
        apply_opt8:      'Іншае',
        ai1_title:       'Аварыйная служба — 24/7',
        ai1_text:        'Пры разрыве трубы, засмечванні, адсутнасці вады:',
        ai2_title:       'Графік працы',
        ai2_text:        'Пн–Пт: 08:00–17:00<br>Перапынак: 13:00–14:00<br>Сб–Нд: выходны',
        ai3_title:       'Тэрмін апрацоўкі',
        ai3_text:        'Заяўкі разглядаюцца на працягу 3 працоўных дзён. Аварыйныя — на працягу 2 гадзін.',
        ai4_title:       'Асабісты прыём',
        ai4_text:        'вул. Даватара, 22, г. Рэчыца<br>Кабінет 101 (абанентны аддзел)',
        // Кантакты
        contacts_tag:    'Кантакты',
        contacts_title:  'Звяжыцеся з намі',
        emerg_title:     'Аварыйная дыспетчарская служба',
        emerg_text:      'Разрыў трубы, падтапленне, адсутнасць вады — тэлефануйце неадкладна!',
        ct1_title:       'Адрас',
        ct1_text:        '247500, г. Рэчыца,<br>вул. Даватара, д. 22<br>Кабінет 101',
        ct2_title:       'Тэлефоны',
        ct2_text:        'Дырэктар: <a href="tel:80234098213">9-82-13</a><br>Гал. інжынер: <a href="tel:80234098211">9-82-11</a><br>Абан. аддзел: <a href="tel:80234098228">9-82-28</a>',
        ct3_title:       'Электронная пошта',
        ct3_text:        '<a href="mailto:info-rechitsa@gomelvodokanal.by">info-rechitsa@<br>gomelvodokanal.by</a>',
        ct4_title:       'Графік працы',
        ct4_text:        'Пн–Пт: 08:00–17:00<br>Перапынак: 13:00–14:00<br>Сб–Нд: выходны',
        ct5_title:       'Лабараторыя',
        ct5_text:        '<a href="tel:+375291087629">+375 (29) 108-76-29</a><br>Пн–Пт: 08:00–16:00',
        ct6_title:       'Вэб-сайт',
        ct6_text:        '<a href="https://gomelvodokanal.by" target="_blank">gomelvodokanal.by</a><br>УНП: 400163027',
        // Футар
        footer_about:    'Забяспечваем надзейнае водазабеспячэнне і водаадвядзенне г. Рэчыца і Рэчыцкага раёна з 1967 года.',
        footer_services: 'Паслугі',
        footer_info:     'Інфармацыя',
        footer_contacts: 'Кантакты',
        footer_copy:     '© 2026 КПУП «Рэчыцавадаканал». Усе правы абаронены.',
        footer_since:    'Служым Рэчыцы з 1967 года',
        // Пошук
        search_ph:       'Пошук па сайце...',
        // Мабільнае меню
        mob_emerg:       'Аварыйная: 9-82-17',
        footer_logo:     'КПУП "Рэчыцавадаканал"',
        footer_emerg:    'Аварыйная: 8 (02340) 9-82-17',
        fl_svc1: 'Кансультацыі',  fl_svc2: 'Аварыйная служба', fl_svc3: 'Падключэнне',
        fl_svc4: 'Аналіз вады',   fl_svc5: 'Праверка лічыльнікаў',
        fl_inf1: 'Тарыфы',        fl_inf2: 'Якасць вады',      fl_inf3: 'Аб прадпрыемстве',
        fl_inf4: 'Навіны',        fl_inf5: 'Падаць заяўку',
        fl_ct1:  'вул. Даватара, 22, Рэчыца',
        fl_ct2:  'Авар.: 8 (02340) 9-82-17',
        fl_ct3:  'Абан.: 8 (02340) 9-82-28',
        fl_ct4:  'Напісаць email',
        footer_up: 'Наверх ↑',
        mob_home: 'Галоўная',  mob_svc: 'Паслугі',     mob_tar: 'Тарыфы',
        mob_qual: 'Якасць вады', mob_about: 'Аб прадпрыемстве', mob_staff: 'Кіраўніцтва',
        mob_news: 'Навіны',    mob_apply: 'Падаць заяўку', mob_ct: 'Кантакты',
    }
};
function switchLang(lang) {
    const L = LANG[lang] || LANG.ru;
    document.getElementById('html-root').lang = lang;

    // 1. data-key elements
    document.querySelectorAll('[data-key]').forEach(el => {
        const k = el.getAttribute('data-key');
        if (L[k] !== undefined) el.innerHTML = L[k];
    });

    // 2. Search placeholder
    const sp = document.getElementById('site-search');
    if (sp) sp.placeholder = L.search_ph || '';

    // 3. Mobile menu emergency link
    const me = document.querySelector('.mob-link.emerg');
    if (me) me.innerHTML = '<i class="fas fa-phone-alt"></i> ' + (L.mob_emerg || '');

    // 4. Hero
    const hb = document.querySelector('.hero-badge');
    if (hb) hb.innerHTML = '<i class="fas fa-award"></i> ' + (L.hero_badge || '');
    const hl = document.querySelector('.hero-lead');
    if (hl) hl.innerHTML = L.hero_text || '';
    [1,2,3,4].forEach(i => {
        const n = document.querySelector('.hs-num-' + i);
        const lb = document.querySelector('.hs-lbl-' + i);
        if (n) n.textContent = L['hero_stat' + i + '_num'] || '';
        if (lb) lb.textContent = L['hero_stat' + i + '_lbl'] || '';
    });

    // 5. Services section
    _setTag('#services .sh-tag', '<i class="fas fa-concierge-bell"></i> ' + L.services_tag);
    _setEl('#services .sh-title', L.services_title);
    _setEl('#services .sh-desc', L.services_desc);
    document.querySelectorAll('.svc-card').forEach(card => {
        const k = card.getAttribute('data-svc');
        if (!k) return;
        const h = card.querySelector('.svc-h');
        const t = card.querySelector('.svc-t');
        const m = card.querySelector('.svc-more');
        if (h) h.textContent = L['svc' + k + '_title'] || '';
        if (t) t.textContent = L['svc' + k + '_text'] || '';
        if (m) m.innerHTML = (L.svc_more || '') + ' <i class="fas fa-arrow-right"></i>';
    });

    // 6. Tariffs
    _setTag('#tariffs .sh-tag', '<i class="fas fa-tag"></i> ' + L.tariffs_tag);
    _setEl('#tariffs .sh-title', L.tariffs_title);
    _setEl('#tariffs .sh-desc', L.tariffs_desc);
    _setEl('#tab-pop', L.tab_pop); _setEl('#tab-org', L.tab_org); _setEl('#tab-conn', L.tab_conn);
    document.querySelectorAll('.tbl-col-service').forEach(e => e.textContent = L.tbl_service || '');
    document.querySelectorAll('.tbl-col-unit').forEach(e => e.textContent = L.tbl_unit || '');
    document.querySelectorAll('.tbl-col-price').forEach(e => e.textContent = L.tbl_price || '');
    document.querySelectorAll('.tbl-col-subsidy').forEach(e => e.textContent = L.tbl_subsidy || '');
    const tn = document.getElementById('tariff-note-pop');
    if (tn) tn.innerHTML = L.tariff_note_pop || '';

    // 7. Quality
    _setTag('#quality .sh-tag', '<i class="fas fa-flask"></i> ' + L.quality_tag);
    _setEl('#quality .sh-title', L.quality_title);
    _setEl('#quality .sh-desc', L.quality_desc);
    _setEl('#quality-updated-label', L.quality_updated);
    _setEl('#quality-std-label', L.quality_std);
    _setEl('#lab1-title', L.lab1_title); _setEl('#lab1-text', L.lab1_text); _setEl('#lab1-btn', L.lab1_btn);
    _setEl('#lab2-title', L.lab2_title); _setEl('#lab2-text', L.lab2_text); _setEl('#lab2-btn', L.lab2_btn);
    _setEl('#lab3-title', L.lab3_title); _setEl('#lab3-text', L.lab3_text); _setEl('#lab3-btn', L.lab3_btn);

    // 8. About
    _setTag('#about .sh-tag', '<i class="fas fa-building"></i> ' + L.about_tag);
    _setEl('#about-h3', L.about_h3); _setEl('#about-p1', L.about_p1); _setEl('#about-p2', L.about_p2);
    _setEl('#feat1-title', L.feat1_title); _setEl('#feat1-text', L.feat1_text);
    _setEl('#feat2-title', L.feat2_title); _setEl('#feat2-text', L.feat2_text);
    _setEl('#feat3-title', L.feat3_title); _setEl('#feat3-text', L.feat3_text);
    [1,2,3,4,5,6].forEach(i => _setEl('#stat' + i + '-lbl', L['stat' + i + '_lbl']));

    // 9. Staff
    _setTag('#staff .sh-tag', '<i class="fas fa-users"></i> ' + L.staff_tag);
    _setEl('#staff .sh-title', L.staff_title);
    [1,2,3,4,5,6,7,8].forEach(i => {
        _setEl('#s' + i + '-name', L['s' + i + '_name']);
        _setEl('#s' + i + '-role', L['s' + i + '_role']);
    });

    // 10. News
    _setTag('#news .sh-tag', '<i class="fas fa-newspaper"></i> ' + L.news_tag);
    _setEl('#news .sh-title', L.news_title);
    _setEl('#news .sh-desc', L.news_desc);

    // 11. Apply
    _setTag('#apply .sh-tag', '<i class="fas fa-file-alt"></i> ' + L.apply_tag);
    _setEl('#apply .sh-title', L.apply_title);
    _setEl('#apply .sh-desc', L.apply_desc);
    _setLbl('#lbl-name', L.apply_name); _setLbl('#lbl-phone', L.apply_phone);
    _setLbl('#lbl-addr', L.apply_addr); _setLbl('#lbl-type', L.apply_type);
    _setLbl('#lbl-text', L.apply_text);
    const apBtn = document.querySelector('#apply-form button[type="submit"]');
    if (apBtn) apBtn.innerHTML = '<i class="fas fa-paper-plane"></i> ' + (L.apply_btn || '');
    const apSel = document.getElementById('ap-type');
    if (apSel) {
        const opts = apSel.querySelectorAll('option');
        ['apply_type_ph','apply_opt1','apply_opt2','apply_opt3','apply_opt4','apply_opt5','apply_opt6','apply_opt7','apply_opt8']
            .forEach((k, i) => { if (opts[i] && L[k]) opts[i].textContent = L[k]; });
    }
    _setEl('#ai1-title', L.ai1_title); _setEl('#ai1-text', L.ai1_text);
    _setEl('#ai2-title', L.ai2_title); _setEl('#ai2-text', L.ai2_text);
    _setEl('#ai3-title', L.ai3_title); _setEl('#ai3-text', L.ai3_text);
    _setEl('#ai4-title', L.ai4_title); _setEl('#ai4-text', L.ai4_text);

    // 12. Contacts
    _setTag('#contacts .sh-tag', '<i class="fas fa-phone-alt"></i> ' + L.contacts_tag);
    _setEl('#contacts .sh-title', L.contacts_title);
    _setEl('#emerg-title', L.emerg_title); _setEl('#emerg-text', L.emerg_text);
    [1,2,3,4,5,6].forEach(i => {
        _setEl('#ct' + i + '-title', L['ct' + i + '_title']);
        _setEl('#ct' + i + '-text', L['ct' + i + '_text']);
    });

    // 13. Footer
    _setEl('#footer-about', L.footer_about);
    _setEl('#footer-col-services', L.footer_services);
    _setEl('#footer-col-info', L.footer_info);
    _setEl('#footer-col-contacts', L.footer_contacts);
    _setEl('#footer-copy', L.footer_copy);
    _setEl('#footer-since', L.footer_since);
    _setEl('#footer-logo-title', L.footer_logo);
    _setEl('#footer-emerg-txt', L.footer_emerg);
    _setEl('#fl-svc1', L.fl_svc1); _setEl('#fl-svc2', L.fl_svc2); _setEl('#fl-svc3', L.fl_svc3);
    _setEl('#fl-svc4', L.fl_svc4); _setEl('#fl-svc5', L.fl_svc5);
    _setEl('#fl-inf1', L.fl_inf1); _setEl('#fl-inf2', L.fl_inf2); _setEl('#fl-inf3', L.fl_inf3);
    _setEl('#fl-inf4', L.fl_inf4); _setEl('#fl-inf5', L.fl_inf5);
    _setEl('#fl-ct1', L.fl_ct1);  _setEl('#fl-ct2', L.fl_ct2);
    _setEl('#fl-ct3', L.fl_ct3);  _setEl('#fl-ct4', L.fl_ct4);
    _setEl('#footer-up', L.footer_up);
    // Mobile nav links
    _setEl('#mnl-home',  L.mob_home);  _setEl('#mnl-svc',   L.mob_svc);
    _setEl('#mnl-tar',   L.mob_tar);   _setEl('#mnl-qual',  L.mob_qual);
    _setEl('#mnl-about', L.mob_about); _setEl('#mnl-staff', L.mob_staff);
    _setEl('#mnl-news',  L.mob_news);  _setEl('#mnl-apply', L.mob_apply);
    _setEl('#mnl-ct',    L.mob_ct);

    DB.set('lang', lang);
    renderNews();
}

// Helpers
function _setEl(sel, val) {
    if (!val) return;
    const el = typeof sel === 'string' ? document.querySelector(sel) : sel;
    if (el) el.innerHTML = val;
}
function _setTag(sel, val) { _setEl(sel, val); }
function _setLbl(sel, val) {
    if (!val) return;
    const el = document.querySelector(sel);
    if (el) el.textContent = val;
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
    // Загрузка фото доступна только через панель администратора
    toast('Загрузка фото — только через панель администратора', 'warn');
    openAdmin();
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

    const sorted = [...all].sort((a,b) => new Date(b.date) - new Date(a.date));
    cont.innerHTML = sorted.slice(0, 6).map(n => {
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

/* ══════════════════════════════════════
   ПОИСК ПО САЙТУ (полноценный)
══════════════════════════════════════ */
(function() {
    // Индекс поиска — все тексты страницы
    const SEARCH_INDEX = [
        { section:'#hero',     keywords:['главная','главная страница','водоканал','речица','вода','водоснабжение','предприятие','1967','галоўная','вадаканал','рэчыца','вада','водазабеспячэнне'] },
        { section:'#services', keywords:['услуги','консультации','аварийная','служба','подключение','дом','справка','документ','поверка','счётчик','анализ','водоотведение','канализация','паслугі','кансультацыі','аварыйная','падключэнне','даведка','дакумент','праверка','лічыльнік','аналіз','водаадвядзенне','каналізацыя'] },
        { section:'#tariffs',  keywords:['тарифы','тариф','цена','стоимость','оплата','норма','субсидия','население','организации','подключение','тарыфы','тарыф','цана','кошт','аплата','норма','субсідыя','насельніцтва','арганізацыі'] },
        { section:'#quality',  keywords:['качество','вода','лаборатория','анализ','нитраты','железо','хлор','норма','сантин','стб','якасць','вада','лабараторыя','аналіз','нітраты','жалеза','хлор','норма'] },
        { section:'#about',    keywords:['о предприятии','предприятие','история','iso','сертификат','экология','аб прадпрыемстве','прадпрыемства','гісторыя','сертыфікат','экалогія'] },
        { section:'#staff',    keywords:['сотрудники','директор','борисенко','инженер','романов','тимощенко','идеология','страпко','энергетик','руководство','администрация','супрацоўнікі','дырэктар','барысенка','інжынер','раманаў','цімашчэнка','ідэалогія','страпко','энергетык','кіраўніцтва'] },
        { section:'#news',     keywords:['новости','новость','объявление','информация','навіны','навіна','абʼяўленне','інфармацыя'] },
        { section:'#apply',    keywords:['заявка','обращение','отправить','форма','заяўка','зварот','адправіць','форма','подать','падаць'] },
        { section:'#contacts', keywords:['контакты','адрес','телефон','email','почта','карта','доватора','кантакты','адрас','тэлефон','пошта','карта','даватара'] },
        // Конкретные телефоны и адреса
        { section:'#contacts', keywords:['9-82-17','9-82-13','9-82-11','9-82-28','аварийная','доватора','247500'] },
        { section:'#services', keywords:['9-82-17','аварийная служба','круглосуточно'] },
    ];

    function doSearch() {
        const input = document.getElementById('site-search');
        const q = input ? input.value.trim().toLowerCase() : '';
        if (!q || q.length < 2) {
            toast('Введите запрос (минимум 2 символа)', 'warn');
            return;
        }

        // Ищем по индексу
        let found = SEARCH_INDEX.find(item =>
            item.keywords.some(kw => kw.includes(q) || q.includes(kw.substring(0, Math.min(kw.length, q.length + 2))))
        );

        // Если не нашли в индексе — ищем по реальному тексту страницы
        if (!found) {
            const sections = document.querySelectorAll('section[id], footer');
            let bestSection = null, bestScore = 0;
            sections.forEach(sec => {
                const text = sec.innerText.toLowerCase();
                let score = 0;
                q.split(' ').forEach(word => { if (word.length > 2 && text.includes(word)) score++; });
                if (text.includes(q)) score += 5;
                if (score > bestScore) { bestScore = score; bestSection = sec; }
            });
            if (bestSection) found = { section: '#' + bestSection.id };
        }

        if (found) {
            const target = document.querySelector(found.section);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Подсветка на секунду
                target.style.outline = '3px solid var(--accent)';
                target.style.outlineOffset = '4px';
                setTimeout(() => { target.style.outline = ''; target.style.outlineOffset = ''; }, 2000);
                const lang = DB.get('lang', 'ru');
                toast(lang === 'be' ? 'Знойдзена! Перайшлі да раздзела' : 'Найдено! Переходим к разделу', 'ok');
                if (input) input.value = '';
                return;
            }
        }

        // Проверяем новости
        const news = DB.get('news', []);
        const found_news = news.find(n =>
            n.title.toLowerCase().includes(q) || n.text.toLowerCase().includes(q)
        );
        if (found_news) {
            const target = document.querySelector('#news');
            if (target) target.scrollIntoView({ behavior:'smooth', block:'start' });
            setTimeout(() => openNewsModal(found_news.id), 600);
            const lang = DB.get('lang', 'ru');
            toast(lang === 'be' ? 'Знойдзена ў навінах!' : 'Найдено в новостях!', 'ok');
            if (input) input.value = '';
            return;
        }

        const lang = DB.get('lang', 'ru');
        toast(lang === 'be' ? 'Нічога не знойдзена па запыце «' + q + '»' : 'Ничего не найдено по запросу «' + q + '»', 'warn');
    }

    document.addEventListener('DOMContentLoaded', () => {
        const searchBtn = document.getElementById('search-btn');
        const searchInput = document.getElementById('site-search');
        if (searchBtn) searchBtn.addEventListener('click', doSearch);
        if (searchInput) {
            searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
            // Живые подсказки при вводе 3+ символов
            searchInput.addEventListener('input', function() {
                const q = this.value.trim().toLowerCase();
                if (q.length >= 3) {
                    // Предпросмотр через 400мс
                    clearTimeout(this._searchTimer);
                    this._searchTimer = setTimeout(doSearch, 800);
                }
            });
        }
    });
})();
