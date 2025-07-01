document.addEventListener('DOMContentLoaded', async function() {
    
    // --- STATE & CORE FUNCTIONS ---
    let translations = {};
    let currentLang = 'en';

    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => { func.apply(this, args); }, delay);
        };
    };
    const debouncedGenerateCV = debounce(generateCV, 300);

    async function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('cvLang', lang);
        
        try {
            const response = await fetch(`./locales/${lang}.json`);
            translations = await response.json();
        } catch (error) {
            console.error(`Could not load translation file for ${lang}:`, error);
            const response = await fetch(`./locales/en.json`);
            translations = await response.json();
        }

        updateUIWithTranslations();
    }

    function updateUIWithTranslations() {
        const t = translations;
        // THIS IS THE FIX: It now targets the 'span' inside the element
        document.querySelectorAll('[data-i18n-key]').forEach(el => {
            const key = el.dataset.i18nKey;
            const target = el.tagName === 'H2' ? el.querySelector('span') : el;
            if (target && t[key]) {
                target.innerText = t[key];
            }
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            if (t[key]) el.placeholder = t[key];
        });
        // (The rest of the function is the same)
        generateCV();
    }

    // --- DYNAMIC CARD CREATION ---
    function addCard(type) {
        const container = document.getElementById(type);
        const card = document.createElement('div');
        card.className = 'dynamic-card is-open';
        let content = '', uniqueId = Date.now(), titleText = 'Untitled';
        const t = translations;

        const createTrixEditor = (id, inputClass) => `<input class="${inputClass}" id="${id}" type="hidden"><trix-editor input="${id}"></trix-editor>`;

        switch(type) {
            case 'workExperience':
                content = `<div class="form-card-body">
                        <div class="form-card-grid-2"><div class="form-group"><label>${t.cardJobTitle}</label><input type="text" class="card-title-input work-title"></div><div class="form-group"><label>${t.cardCompany}</label><input type="text" class="work-company"></div></div>
                        <div class="form-card-grid-2"><div class="form-group"><label>${t.cardStartDate}</label><input type="text" class="work-startDate"></div><div class="form-group"><label>${t.cardEndDate}</label><input type="text" class="work-endDate"></div></div>
                        <div class="form-group"><label>${t.cardDescription}</label>${createTrixEditor(`work-desc-${uniqueId}`, 'work-description')}</div></div>`;
                break;
            case 'education':
                 content = `<div class="form-card-body">
                        <div class="form-card-grid-2"><div class="form-group"><label>${t.cardDegree}</label><input type="text" class="card-title-input edu-degree"></div><div class="form-group"><label>${t.cardInstitution}</label><input type="text" class="edu-institution"></div></div>
                        <div class="form-group"><label>${t.cardDate}</label><input type="text" class="edu-date"></div></div>`;
                break;
            case 'certifications':
                 titleText = t.certifications || "Certification";
                 content = `<div class="form-card-body">
                        <div class="form-group"><label>${t.cardCertName}</label><input type="text" class="card-title-input cert-name"></div>
                        <div class="form-group"><label>${t.cardCertOrg}</label><input type="text" class="cert-org"></div>
                        <div class="form-group"><label>${t.cardDateObtained}</label><input type="text" class="cert-date"></div></div>`;
                break;
            case 'languages':
                titleText = t.languages || "Language";
                content = `<div class="form-card-body form-card-grid-2">
                        <div class="form-group"><label>${t.cardLanguage}</label><input type="text" class="card-title-input lang-name"></div>
                        <div class="form-group"><label>${t.cardProficiency}</label><input type="text" class="lang-prof" placeholder="${t.cardProficiencyPlaceholder}"></div></div>`;
                break;
        }

        card.innerHTML = `<div class="form-card-header"><div class="title">${titleText}</div><span class="chevron"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span></div>${content}`;
        container.appendChild(card);
        card.querySelector('.form-card-header').addEventListener('click', (e) => { if (!e.target.closest('button')) card.classList.toggle('is-open'); });
        const titleInput = card.querySelector('.card-title-input');
        if (titleInput) { titleInput.addEventListener('input', () => { card.querySelector('.form-card-header .title').textContent = titleInput.value || 'Untitled'; }); }
        card.querySelectorAll('input, select, trix-editor').forEach(el => el.addEventListener('input', debouncedGenerateCV));
        generateCV();
    }

    // --- DATA COLLECTION & CV GENERATION ---
    function collectData() { /* ... unchanged ... */ }
    function generateCV() { /* ... unchanged ... */ }

    // --- INITIAL SETUP & EVENT LISTENERS ---
    document.querySelectorAll('.editor-panel input, .editor-panel trix-editor, .editor-panel textarea, .editor-panel select').forEach(el => el.addEventListener('input', debouncedGenerateCV));
    document.getElementById('addWorkExperienceBtn').addEventListener('click', () => addCard('workExperience'));
    document.getElementById('addEducationBtn').addEventListener('click', () => addCard('education'));
    document.getElementById('addCertificationBtn').addEventListener('click', () => addCard('certifications'));
    document.getElementById('addLanguageBtn').addEventListener('click', () => addCard('languages'));
    document.getElementById('downloadPdfBtn').addEventListener('click', () => window.print());
    document.getElementById('lang-select').addEventListener('change', (e) => setLanguage(e.target.value));

    // Initialize the app
    async function init() {
        const savedLang = localStorage.getItem('cvLang') || 'en';
        document.getElementById('lang-select').value = savedLang;
        await setLanguage(savedLang);
        addWorkExperience();
    }

    init();
});
