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
            if (!response.ok) throw new Error('Network response was not ok');
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
            case 'awards':
                 titleText = t.awards || "Award";
                 content = `<div class="form-card-body">
                        <div class="form-group"><label>${t.cardAwardName}</label><input type="text" class="card-title-input award-name"></div>
                        <div class="form-group"><label>${t.cardDateObtained}</label><input type="text" class="award-date"></div></div>`;
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

        const removeBtn = `<button class="btn-remove-card" aria-label="Remove"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>`;
        card.innerHTML = `<div class="form-card-header"><div class="title">${titleText}</div>${removeBtn}<span class="chevron"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span></div>${content}`;
        container.appendChild(card);
        
        card.querySelector('.btn-remove-card').addEventListener('click', () => { card.remove(); generateCV(); });
        card.querySelector('.form-card-header').addEventListener('click', (e) => { if (!e.target.closest('button')) card.classList.toggle('is-open'); });
        const titleInput = card.querySelector('.card-title-input');
        if (titleInput) { titleInput.addEventListener('input', () => { card.querySelector('.form-card-header .title').textContent = titleInput.value || 'Untitled'; }); }
        card.querySelectorAll('input, select, trix-editor').forEach(el => el.addEventListener('input', debouncedGenerateCV));
        generateCV();
    }

    // --- DATA COLLECTION & CV GENERATION ---
    function collectData() {
        const getCardData = (containerId, fields) => Array.from(document.querySelectorAll(`#${containerId} .dynamic-card`)).map(card => {
            const entry = {};
            for (const field in fields) entry[field] = card.querySelector(fields[field])?.value || '';
            return entry;
        });
        return {
            personal: { fullName: document.getElementById('fullName').value, jobTitle: document.getElementById('jobTitle').value, email: document.getElementById('email').value, phone: document.getElementById('phone').value, location: document.getElementById('location').value },
            summary: document.getElementById('summary').value,
            skills: document.getElementById('skills').value,
            experience: getCardData('workExperience', { title: '.work-title', company: '.work-company', startDate: '.work-startDate', endDate: '.work-endDate', description: '.work-description' }),
            education: getCardData('education', { degree: '.edu-degree', institution: '.edu-institution', date: '.edu-date' }),
            awards: getCardData('awards', { name: '.award-name', date: '.award-date' }),
            certifications: getCardData('certifications', { name: '.cert-name', org: '.cert-org', date: '.cert-date' }),
            languages: getCardData('languages', { name: '.lang-name', proficiency: '.lang-prof' })
        };
    }

    function generateCV() {
        const data = collectData();
        const preview = document.getElementById('cvPreview');
        const t = translations;
        const section = (titleKey, content) => content && content.length > 0 ? `<div class="cv-section"><div class="cv-section-title">${t[titleKey]}</div>${content}</div>` : '';
        
        const sectionsInOrder = Array.from(document.querySelectorAll('#editor-panel .form-section[data-section-key]')).map(el => el.dataset.sectionKey);
        
        const sectionHTML = {
            summary: section('professionalSummary', data.summary),
            experience: section('experience', data.experience.map(exp => `<div class="cv-item"><div class="cv-item-header"><span>${exp.title}</span><span>${exp.startDate} - ${exp.endDate}</span></div><div class="cv-item-company">${exp.company}</div><div class="cv-item-description">${exp.description}</div></div>`).join('')),
            education: section('education', data.education.map(edu => `<div class="cv-item"><div class="cv-item-header"><span>${edu.degree}</span><span>${edu.date}</span></div><div class="cv-item-company">${edu.institution}</div></div>`).join('')),
            awards: section('awards', data.awards.map(awd => `<div class="cv-item"><div class="cv-item-header"><span>${awd.name}</span><span>${awd.date}</span></div></div>`).join('')),
            certifications: section('certifications', data.certifications.map(cert => `<div class="cv-item"><div class="cv-item-header"><span>${cert.name}</span><span>${cert.date}</span></div><div class="cv-item-company">${cert.org}</div></div>`).join('')),
            skills: section('skills', `<div class="skills-grid">${data.skills.split(',').map(s=>s.trim()).filter(Boolean).map(skill => `<div class="skill-item">${skill}</div>`).join('')}</div>`),
            languages: section('languages', data.languages.length > 0 ? `<div class="skills-grid">${data.languages.map(lang => `<div class="skill-item">${lang.name}${lang.proficiency ? ` (${lang.proficiency})` : ''}</div>`).join('')}</div>` : '')
        };
        
        const headerHTML = `<div class="cv-header"><div class="cv-name">${data.personal.fullName}</div><div class="cv-title">${data.personal.jobTitle}</div><div class="cv-contact">${[data.personal.location, data.personal.phone, data.personal.email].filter(Boolean).join(' • ')}</div></div>`;

        preview.innerHTML = headerHTML + sectionsInOrder.map(key => sectionHTML[key]).filter(Boolean).join('');
    }

    // --- SECTION REORDERING ---
    function moveSection(button, direction) {
        const section = button.closest('.form-section');
        if (direction === 'up') {
            const prevSection = section.previousElementSibling;
            if (prevSection && prevSection.matches('.form-section')) {
                prevSection.before(section);
            }
        } else {
            const nextSection = section.nextElementSibling;
            if (nextSection && nextSection.matches('.form-section')) {
                nextSection.after(section);
            }
        }
        generateCV();
    }
    
    // --- EXPORT FUNCTIONS ---
    const downloadPng = () => {
        const cvElement = document.getElementById('cvPreview');
        const fullName = document.getElementById('fullName').value || 'cv';
        
        showNotification('Generating PNG...', 'info');

        const options = {
            scale: 3,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        };

        html2canvas(cvElement, options).then(canvas => {
            const link = document.createElement('a');
            link.download = `${fullName.replace(/\s/g, '_')}_CV.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        }).catch(err => {
            showNotification('Error generating PNG.', 'error');
            console.error(err);
        });
    };

    const downloadPdf = () => {
        window.print();
    };

    // --- NOTIFICATIONS ---
    const showNotification = (message, type) => {
        const notification = document.createElement('div');
        notification.style.cssText = `position:fixed; top:20px; right:20px; padding:15px; border-radius:8px; color:white; z-index:1001; background-color:${type === 'info' ? '#3498db' : type === 'error' ? '#e74c3c' : '#27ae60'};`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    };

    // --- INITIAL SETUP & EVENT LISTENERS ---
    document.querySelectorAll('.editor-panel input, .editor-panel trix-editor, .editor-panel textarea, .editor-panel select').forEach(el => el.addEventListener('input', debouncedGenerateCV));
    document.getElementById('addWorkExperienceBtn').addEventListener('click', () => addCard('workExperience'));
    document.getElementById('addEducationBtn').addEventListener('click', () => addCard('education'));
    document.getElementById('addAwardBtn').addEventListener('click', () => addCard('awards'));
    document.getElementById('addCertificationBtn').addEventListener('click', () => addCard('certifications'));
    document.getElementById('addLanguageBtn').addEventListener('click', () => addCard('languages'));
    document.getElementById('downloadPdfBtn').addEventListener('click', downloadPdf);
    document.getElementById('downloadPngBtn').addEventListener('click', downloadPng);
    document.getElementById('lang-select').addEventListener('change', (e) => setLanguage(e.target.value));
    
    document.getElementById('editor-panel').addEventListener('click', (e) => {
        if (e.target.matches('.btn-reorder.up')) {
            moveSection(e.target, 'up');
        } else if (e.target.matches('.btn-reorder.down')) {
            moveSection(e.target, 'down');
        }
    });

    // Initialize the app
    async function init() {
        const savedLang = localStorage.getItem('cvLang') || 'en';
        document.getElementById('lang-select').value = savedLang;
        await setLanguage(savedLang);
        addWorkExperience();
    }

    init();
});
