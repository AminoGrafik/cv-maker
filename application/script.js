document.addEventListener('DOMContentLoaded', function() {
    
    // --- UTILITIES ---
    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => { func.apply(this, args); }, delay);
        };
    };
    const debouncedGenerateCV = debounce(generateCV, 300);

    // --- TEMPLATE FOR CREATING DYNAMIC CARDS ---
    function addCard(type) {
        const container = document.getElementById(type);
        const card = document.createElement('div');
        card.className = 'form-card is-open';
        let content = '', uniqueId = Date.now();
        let icon = '', titleText = 'Untitled';

        const chevron = `<span class="chevron"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span>`;

        switch(type) {
            case 'workExperience':
                icon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`;
                content = `
                    <div class="form-card-body">
                        <div class="form-card-grid-2">
                            <div class="form-group"><label>Job Title</label><input type="text" class="card-title-input work-title"></div>
                            <div class="form-group"><label>Company</label><input type="text" class="work-company"></div>
                        </div>
                        <div class="form-card-grid-2">
                            <div class="form-group"><label>Start Date</label><input type="text" class="work-startDate"></div>
                            <div class="form-group"><label>End Date</label><input type="text" class="work-endDate"></div>
                        </div>
                        <div class="form-group"><label>Description</label><div class="trix-editor-wrapper"><input class="work-description" id="work-desc-${uniqueId}" type="hidden"><trix-editor input="work-desc-${uniqueId}"></trix-editor></div></div>
                    </div>`;
                break;
            case 'projects':
                icon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`;
                content = `
                    <div class="form-card-body">
                        <div class="form-group"><label>Project Name</label><input type="text" class="card-title-input project-name"></div>
                        <div class="form-group"><label>Project Link</label><input type="text" class="project-link"></div>
                        <div class="form-group"><label>Description</label><div class="trix-editor-wrapper"><input class="project-description" id="proj-desc-${uniqueId}" type="hidden"><trix-editor input="proj-desc-${uniqueId}"></trix-editor></div></div>
                    </div>`;
                break;
            case 'education':
                 icon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`;
                 content = `
                    <div class="form-card-body">
                        <div class="form-card-grid-2">
                            <div class="form-group"><label>Degree or Major</label><input type="text" class="card-title-input edu-degree"></div>
                            <div class="form-group"><label>Institution</label><input type="text" class="edu-institution"></div>
                        </div>
                        <div class="form-group"><label>Date</label><input type="text" class="edu-date"></div>
                    </div>`;
                break;
            case 'certifications':
                 icon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.78l1.21 1.22a1 1 0 0 0 1.42 0l1.21-1.22a4 4 0 0 1 4.78 4.78l-1.22 1.21a1 1 0 0 0 0 1.42l1.22 1.21a4 4 0 0 1-4.78 4.78l-1.21-1.22a1 1 0 0 0-1.42 0l-1.21 1.22a4 4 0 0 1-4.78-4.78l1.22-1.21a1 1 0 0 0 0-1.42z"/><path d="m9 12 2 2 4-4"/></svg>`;
                 content = `
                    <div class="form-card-body">
                        <div class="form-group"><label>Certification Name</label><input type="text" class="card-title-input cert-name"></div>
                        <div class="form-group"><label>Issuing Organization</label><input type="text" class="cert-org"></div>
                        <div class="form-group"><label>Date Obtained</label><input type="text" class="cert-date"></div>
                    </div>`;
                break;
        }

        card.innerHTML = `<div class="form-card-header"><span class="icon">${icon}</span><div class="title">${titleText}</div>${chevron}</div>${content}`;
        container.appendChild(card);

        card.querySelector('.form-card-header').addEventListener('click', (e) => {
            if (e.target.closest('button')) return;
            card.classList.toggle('is-open');
            card.classList.toggle('is-closed');
        });

        const titleInput = card.querySelector('.card-title-input');
        if (titleInput) {
            titleInput.addEventListener('input', () => {
                card.querySelector('.form-card-header .title').textContent = titleInput.value || 'Untitled';
            });
        }
        
        card.querySelectorAll('input, trix-editor').forEach(el => el.addEventListener('input', debouncedGenerateCV));
        generateCV();
    }

    // --- DATA COLLECTION & CV GENERATION ---
    function collectData() {
        const getCardData = (containerId, fields) => Array.from(document.querySelectorAll(`#${containerId} .form-card`)).map(card => {
            const entry = {};
            for (const field in fields) entry[field] = card.querySelector(fields[field])?.value || '';
            return entry;
        });

        return {
            personal: { fullName: document.getElementById('fullName').value, jobTitle: document.getElementById('jobTitle').value, email: document.getElementById('email').value, phone: document.getElementById('phone').value, location: document.getElementById('location').value },
            summary: document.getElementById('summary').value,
            skills: document.getElementById('skills').value,
            experience: getCardData('workExperience', { title: '.work-title', company: '.work-company', startDate: '.work-startDate', endDate: '.work-endDate', description: '.work-description' }),
            projects: getCardData('projects', { name: '.project-name', link: '.project-link', description: '.project-description' }),
            education: getCardData('education', { degree: '.edu-degree', institution: '.edu-institution', date: '.edu-date' }),
            certifications: getCardData('certifications', { name: '.cert-name', org: '.cert-org', date: '.cert-date' }),
            languages: getCardData('languages', { name: '.lang-name', proficiency: '.lang-prof' })
        };
    }

    function generateCV() {
        const data = collectData();
        const preview = document.getElementById('cvPreview');
        const section = (title, content) => content && content.length > 0 ? `<div class="cv-section"><div class="cv-section-title">${title}</div>${content}</div>` : '';
        
        const headerHTML = `<div class="cv-header"><div class="cv-name">${data.personal.fullName}</div><div class="cv-title">${data.personal.jobTitle}</div><div class="cv-contact">${[data.personal.location, data.personal.phone, data.personal.email].filter(Boolean).join(' • ')}</div></div>`;
        const summaryHTML = section('PROFESSIONAL SUMMARY', data.summary);
        const experienceHTML = section('Experience', data.experience.map(exp => `<div class="cv-item"><div class="cv-item-header"><span>${exp.title}</span><span>${exp.startDate} - ${exp.endDate}</span></div><div class="cv-item-company">${exp.company}</div><div class="cv-item-description">${exp.description}</div></div>`).join(''));
        const projectsHTML = section('Projects', data.projects.map(proj => `<div class="cv-item"><div class="cv-item-header"><span>${proj.name}</span></div><div class="cv-item-description">${proj.description}</div></div>`).join(''));
        const educationHTML = section('Education', data.education.map(edu => `<div class="cv-item"><div class="cv-item-header"><span>${edu.degree}</span><span>${edu.date}</span></div><div class="cv-item-company">${edu.institution}</div></div>`).join(''));
        const certificationsHTML = section('Certifications', data.certifications.map(cert => `<div class="cv-item"><div class="cv-item-header"><span>${cert.name}</span><span>${cert.date}</span></div><div class="cv-item-company">${cert.org}</div></div>`).join(''));
        const skillsHTML = section('Skills', `<div class="skills-grid">${data.skills.split(',').map(s=>s.trim()).filter(Boolean).map(skill => `<div class="skill-item">${skill}</div>`).join('')}</div>`);
        const languagesHTML = section('Languages', data.languages.length > 0 ? section('Languages', `<div class="skills-grid">${data.languages.map(lang => `<div class="skill-item">${lang.name}${lang.proficiency ? ` (${lang.proficiency})` : ''}</div>`).join('')}</div>`) : '');

        preview.innerHTML = [headerHTML, summaryHTML, experienceHTML, projectsHTML, educationHTML, certificationsHTML, skillsHTML, languagesHTML].filter(Boolean).join('');
    }

    // --- INITIAL SETUP & EVENT LISTENERS ---
    document.querySelectorAll('.editor-panel input, .editor-panel trix-editor, .editor-panel textarea').forEach(el => el.addEventListener('input', debouncedGenerateCV));
    document.getElementById('addWorkExperienceBtn').addEventListener('click', () => addCard('workExperience'));
    document.getElementById('addProjectBtn').addEventListener('click', () => addCard('projects'));
    document.getElementById('addEducationBtn').addEventListener('click', () => addCard('education'));
    document.getElementById('addCertificationBtn').addEventListener('click', () => addCard('certifications'));
    document.getElementById('addLanguageBtn').addEventListener('click', () => addCard('languages'));
    document.getElementById('downloadPdfBtn').addEventListener('click', () => window.print());

    addWorkExperience();
    generateCV();
});
