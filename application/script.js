document.addEventListener('DOMContentLoaded', function() {
    // --- STATE & COUNTERS ---
    let workExperienceCount = 0, educationCount = 0, certificationCount = 0,
        projectsCount = 0, languagesCount = 0, awardsCount = 0,
        publicationsCount = 0, volunteerCount = 0;

    // --- DEBOUNCE UTILITY ---
    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    };

    // --- DATA COLLECTION ---
    const collectData = () => ({
        personal: {
            fullName: document.getElementById('fullName').value,
            jobTitle: document.getElementById('jobTitle').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            location: document.getElementById('location').value,
            linkedin: document.getElementById('linkedin').value,
        },
        summary: document.getElementById('summary').value,
        skills: document.getElementById('skills').value,
        workExperience: Array.from(document.querySelectorAll('#workExperience .dynamic-section')).map(s => ({
            title: s.querySelector('.work-title').value, company: s.querySelector('.work-company').value, date: s.querySelector('.work-date').value, description: s.querySelector('.work-description').value,
        })),
        projects: Array.from(document.querySelectorAll('#projects .dynamic-section')).map(s => ({
            name: s.querySelector('.proj-name').value, link: s.querySelector('.proj-link').value, description: s.querySelector('.proj-description').value,
        })),
        education: Array.from(document.querySelectorAll('#education .dynamic-section')).map(s => ({
            degree: s.querySelector('.edu-degree').value, institution: s.querySelector('.edu-institution').value, date: s.querySelector('.edu-date').value,
        })),
        awards: Array.from(document.querySelectorAll('#awards .dynamic-section')).map(s => ({
            name: s.querySelector('.award-name').value, date: s.querySelector('.award-date').value,
        })),
        publications: Array.from(document.querySelectorAll('#publications .dynamic-section')).map(s => ({
            title: s.querySelector('.pub-title').value, journal: s.querySelector('.pub-journal').value, date: s.querySelector('.pub-date').value,
        })),
        volunteer: Array.from(document.querySelectorAll('#volunteer .dynamic-section')).map(s => ({
            role: s.querySelector('.vol-role').value, org: s.querySelector('.vol-org').value, date: s.querySelector('.vol-date').value, description: s.querySelector('.vol-description').value,
        })),
        certifications: Array.from(document.querySelectorAll('#certifications .dynamic-section')).map(s => ({
            name: s.querySelector('.cert-name').value, org: s.querySelector('.cert-org').value, date: s.querySelector('.cert-date').value,
        })),
        languages: Array.from(document.querySelectorAll('#languages .dynamic-section')).map(s => ({
            name: s.querySelector('.lang-name').value, proficiency: s.querySelector('.lang-prof').value,
        })),
    });

    // --- CV PREVIEW GENERATION ---
    const generateCV = () => {
        const data = collectData();
        const preview = document.getElementById('cvPreview');
        preview.innerHTML = `
            ${generateHeader(data.personal)}
            ${data.summary ? generateSection('Professional Summary', data.summary) : ''}
            ${data.workExperience.length > 0 ? generateWorkExperience(data.workExperience) : ''}
            ${data.projects.length > 0 ? generateProjects(data.projects) : ''}
            ${data.education.length > 0 ? generateEducation(data.education) : ''}
            ${data.awards.length > 0 ? generateAwards(data.awards) : ''}
            ${data.publications.length > 0 ? generatePublications(data.publications) : ''}
            ${data.volunteer.length > 0 ? generateVolunteer(data.volunteer) : ''}
            ${data.certifications.length > 0 ? generateCertifications(data.certifications) : ''}
            ${data.languages.length > 0 ? generateLanguages(data.languages) : ''}
            ${data.skills ? generateSkills(data.skills) : ''}
        `;
    };

    const generateHeader = (personal) => {
        const username = personal.linkedin.trim();
        let linkedInHtml = username ? `<a href="https://www.linkedin.com/in/${username}" target="_blank" rel="noopener noreferrer">in/${username}</a>` : '';
        const contactInfo = [personal.email, personal.phone, personal.location, linkedInHtml].filter(Boolean).join(' • ');
        return `<div class="cv-header"><div class="cv-name">${personal.fullName||'Your Name'}</div><div class="cv-title">${personal.jobTitle||'Professional Title'}</div><div class="cv-contact">${contactInfo}</div></div>`;
    };

    const generateSection = (title, content) => `<div class="cv-section"><div class="cv-section-title">${title}</div>${content}</div>`;
    
    const generateWorkExperience = exps => generateSection('Work Experience', exps.map(exp => `<div class="cv-item"><div class="cv-item-header"><span class="cv-item-title">${exp.title}</span><span class="cv-item-date">${exp.date}</span></div><div class="cv-item-company">${exp.company}</div><div class="cv-item-description">${exp.description}</div></div>`).join(''));
    
    // UPDATED: generateProjects function
    const generateProjects = projs => generateSection('Projects', projs.map(proj => {
        let projectLink = '';
        if (proj.link) {
            const trimmedLink = proj.link.trim();
            // Automatically add protocol if missing for a valid external link
            const fullUrl = trimmedLink.startsWith('http') ? trimmedLink : `//${trimmedLink}`;
            projectLink = `<a href="${fullUrl}" target="_blank" rel="noopener noreferrer" class="cv-item-date">View Project</a>`;
        }
        return `<div class="cv-item">
                    <div class="cv-item-header">
                        <span class="cv-item-title">${proj.name}</span>
                        ${projectLink}
                    </div>
                    <div class="cv-item-description">${proj.description}</div>
                </div>`;
    }).join(''));

    const generateEducation = edus => generateSection('Education', edus.map(edu => `<div class="cv-item"><div class="cv-item-header"><span class="cv-item-title">${edu.degree}</span><span class="cv-item-date">${edu.date}</span></div><div class="cv-item-company">${edu.institution}</div></div>`).join(''));
        
    const generateAwards = awds => generateSection('Awards and Honors', awds.map(awd => `<div class="cv-item"><div class="cv-item-header"><span class="cv-item-title">${awd.name}</span><span class="cv-item-date">${awd.date}</span></div></div>`).join(''));

    const generatePublications = pubs => generateSection('Publications', pubs.map(pub => `<div class="cv-item"><div class="cv-item-header"><span class="cv-item-title">${pub.title}</span><span class="cv-item-date">${pub.date}</span></div><div class="cv-item-company">${pub.journal}</div></div>`).join(''));

    const generateVolunteer = vols => generateSection('Volunteer Experience', vols.map(vol => `<div class="cv-item"><div class="cv-item-header"><span class="cv-item-title">${vol.role}</span><span class="cv-item-date">${vol.date}</span></div><div class="cv-item-company">${vol.org}</div><div class="cv-item-description">${vol.description}</div></div>`).join(''));

    const generateCertifications = certs => generateSection('Certifications', certs.map(cert => `<div class="cv-item"><div class="cv-item-header"><span class="cv-item-title">${cert.name}</span><span class="cv-item-date">${cert.date}</span></div><div class="cv-item-company">${cert.org}</div></div>`).join(''));

    const generateLanguages = langs => generateSection('Languages', `<div class="skills-grid">${langs.map(lang => `<div class="skill-item">${lang.name} <span style="color: #555;">(${lang.proficiency || 'Proficient'})</span></div>`).join('')}</div>`);

    const generateSkills = skills => {
        const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
        return skillsArray.length > 0 ? generateSection('Skills', `<div class="skills-grid">${skillsArray.map(s => `<div class="skill-item">${s}</div>`).join('')}</div>`) : '';
    };

    // --- DYNAMIC SECTION MANAGEMENT ---
    const addSection = (type) => {
        const container = document.getElementById(type);
        const div = document.createElement('div');
        div.className = 'dynamic-section';
        let count = 0, headerText = '', fields = '';

        const createTrixEditor = (id, inputClass) => `<input id="${id}" type="hidden" class="${inputClass}"><trix-editor input="${id}" class="trix-content"></trix-editor>`;

        switch(type) {
            case 'workExperience':
                count = ++workExperienceCount; headerText = `Experience ${count}`;
                fields = `<input type="text" placeholder="Job Title" class="work-title"><input type="text" placeholder="Company" class="work-company"><input type="text" placeholder="Date" class="work-date">${createTrixEditor(`work-desc-${count}`, 'work-description')}`;
                break;
            case 'projects':
                count = ++projectsCount; headerText = `Project ${count}`;
                // UPDATED: Input type is now 'text' for more flexibility
                fields = `<input type="text" placeholder="Project Name" class="proj-name"><input type="text" placeholder="Project Link (e.g., myproject.com)" class="proj-link">${createTrixEditor(`proj-desc-${count}`, 'proj-description')}`;
                break;
            case 'education':
                count = ++educationCount; headerText = `Education ${count}`;
                fields = `<input type="text" placeholder="Degree" class="edu-degree"><input type="text" placeholder="Institution" class="edu-institution"><input type="text" placeholder="Date" class="edu-date">`;
                break;
            case 'awards':
                count = ++awardsCount; headerText = `Award ${count}`;
                fields = `<input type="text" placeholder="Award Name (e.g., Dean's List)" class="award-name"><input type="text" placeholder="Date" class="award-date">`;
                break;
            case 'publications':
                count = ++publicationsCount; headerText = `Publication ${count}`;
                fields = `<input type="text" placeholder="Title of Publication" class="pub-title"><input type="text" placeholder="Journal or Conference" class="pub-journal"><input type="text" placeholder="Date" class="pub-date">`;
                break;
            case 'volunteer':
                count = ++volunteerCount; headerText = `Volunteer Role ${count}`;
                fields = `<input type="text" placeholder="Role (e.g., Event Coordinator)" class="vol-role"><input type="text" placeholder="Organization" class="vol-org"><input type="text" placeholder="Date" class="vol-date">${createTrixEditor(`vol-desc-${count}`, 'vol-description')}`;
                break;
            case 'certifications':
                count = ++certificationCount; headerText = `Certification ${count}`;
                fields = `<input type="text" placeholder="Certification Name" class="cert-name"><input type="text" placeholder="Issuing Organization" class="cert-org"><input type="text" placeholder="Date" class="cert-date">`;
                break;
            case 'languages':
                count = ++languagesCount; headerText = `Language ${count}`;
                fields = `<input type="text" placeholder="Language" class="lang-name"><input type="text" placeholder="Proficiency (e.g., Native)" class="lang-prof">`;
                break;
        }

        div.innerHTML = `<div class="section-header"><h4>${headerText}</h4><button class="btn btn-danger btn-sm remove-btn">Remove</button></div>${fields}`;
        div.querySelector('.remove-btn').onclick = () => { div.remove(); generateCV(); };
        container.appendChild(div);
        
        div.querySelectorAll('input:not([type=hidden]), trix-editor').forEach(el => {
            el.addEventListener('input', debouncedGenerateCV);
        });
        
        generateCV();
    };
    
    const debouncedGenerateCV = debounce(generateCV, 300);
    
    // --- PDF EXPORT, NOTIFICATIONS, OTHER FUNCTIONS ---
    // (These are all correct and unchanged)
    const downloadPdf = () => { /* ... */ };
    const showNotification = (message, type) => { /* ... */ };

    // --- EVENT LISTENERS ---
    document.querySelectorAll('.editor-panel input, .editor-panel textarea, .editor-panel trix-editor').forEach(el => {
        el.addEventListener('input', debouncedGenerateCV);
    });
    
    document.getElementById('addWorkExperienceBtn').addEventListener('click', () => addSection('workExperience'));
    document.getElementById('addProjectBtn').addEventListener('click', () => addSection('projects'));
    document.getElementById('addEducationBtn').addEventListener('click', () => addSection('education'));
    document.getElementById('addAwardBtn').addEventListener('click', () => addSection('awards'));
    document.getElementById('addPublicationBtn').addEventListener('click', () => addSection('publications'));
    document.getElementById('addVolunteerBtn').addEventListener('click', () => addSection('volunteer'));
    document.getElementById('addCertificationBtn').addEventListener('click', () => addSection('certifications'));
    document.getElementById('addLanguageBtn').addEventListener('click', () => addSection('languages'));
    document.getElementById('downloadPdfBtn').addEventListener('click', downloadPdf);
    
    // --- INITIALIZATION ---
    generateCV();
});
