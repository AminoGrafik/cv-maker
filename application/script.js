document.addEventListener('DOMContentLoaded', function() {
    // --- STATE & COUNTERS ---
    let workExperienceCount = 0;
    let educationCount = 0;
    let certificationCount = 0;
    let projectsCount = 0; // New counter
    let languagesCount = 0; // New counter

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
            title: s.querySelector('.work-title').value,
            company: s.querySelector('.work-company').value,
            date: s.querySelector('.work-date').value,
            description: s.querySelector('.work-description').value,
        })),
        // New data collection for Projects
        projects: Array.from(document.querySelectorAll('#projects .dynamic-section')).map(s => ({
            name: s.querySelector('.proj-name').value,
            link: s.querySelector('.proj-link').value,
            description: s.querySelector('.proj-description').value,
        })),
        education: Array.from(document.querySelectorAll('#education .dynamic-section')).map(s => ({
            degree: s.querySelector('.edu-degree').value,
            institution: s.querySelector('.edu-institution').value,
            date: s.querySelector('.edu-date').value,
        })),
        certifications: Array.from(document.querySelectorAll('#certifications .dynamic-section')).map(s => ({
            name: s.querySelector('.cert-name').value,
            org: s.querySelector('.cert-org').value,
            date: s.querySelector('.cert-date').value,
        })),
        // New data collection for Languages
        languages: Array.from(document.querySelectorAll('#languages .dynamic-section')).map(s => ({
            name: s.querySelector('.lang-name').value,
            proficiency: s.querySelector('.lang-prof').value,
        })),
    });

    // --- CV PREVIEW GENERATION ---
    const generateCV = () => {
        const data = collectData();
        const preview = document.getElementById('cvPreview');
        preview.innerHTML = `
            ${generateHeader(data.personal)}
            ${data.summary ? generateSection('Professional Summary', `<p>${data.summary.replace(/\n/g, '<br>')}</p>`) : ''}
            ${data.workExperience.length > 0 ? generateWorkExperience(data.workExperience) : ''}
            ${data.projects.length > 0 ? generateProjects(data.projects) : ''}
            ${data.education.length > 0 ? generateEducation(data.education) : ''}
            ${data.certifications.length > 0 ? generateCertifications(data.certifications) : ''}
            ${data.languages.length > 0 ? generateLanguages(data.languages) : ''}
            ${data.skills ? generateSkills(data.skills) : ''}
        `;
    };

    const generateHeader = (personal) => {
        const username = personal.linkedin.trim();
        let linkedInHtml = '';
        if (username) {
            const fullUrl = `https://www.linkedin.com/in/${username}`;
            const displayUrl = `in/${username}`;
            linkedInHtml = `<a href="${fullUrl}" target="_blank">${displayUrl}</a>`;
        }
        const contactInfo = [personal.email, personal.phone, personal.location, linkedInHtml].filter(Boolean).join(' • ');
        return `<div class="cv-header">
                    <div class="cv-name">${personal.fullName || 'Your Name'}</div>
                    <div class="cv-title">${personal.jobTitle || 'Professional Title'}</div>
                    <div class="cv-contact">${contactInfo}</div>
                </div>`;
    };

    const generateSection = (title, content) => `<div class="cv-section"><div class="cv-section-title">${title}</div>${content}</div>`;
    
    const generateWorkExperience = exps => generateSection('Work Experience', exps.map(exp => `
        <div class="cv-item">
            <div class="cv-item-header">
                <span class="cv-item-title">${exp.title}</span>
                <span class="cv-item-date">${exp.date}</span>
            </div>
            <div class="cv-item-company">${exp.company}</div>
            ${exp.description ? `<div class="cv-item-description">${formatDescription(exp.description)}</div>` : ''}
        </div>`).join(''));
    
    // New function to generate Projects preview
    const generateProjects = projs => generateSection('Projects', projs.map(proj => `
        <div class="cv-item">
            <div class="cv-item-header">
                <span class="cv-item-title">${proj.name}</span>
                ${proj.link ? `<a href="${proj.link}" target="_blank" class="cv-item-date">View Project</a>` : ''}
            </div>
            ${proj.description ? `<div class="cv-item-description">${formatDescription(proj.description)}</div>` : ''}
        </div>`).join(''));

    const generateEducation = edus => generateSection('Education', edus.map(edu => `
        <div class="cv-item">
            <div class="cv-item-header">
                <span class="cv-item-title">${edu.degree}</span>
                <span class="cv-item-date">${edu.date}</span>
            </div>
            <div class="cv-item-company">${edu.institution}</div>
        </div>`).join(''));
        
    const generateCertifications = certs => generateSection('Certifications', certs.map(cert => `
        <div class="cv-item">
            <div class="cv-item-header"><span class="cv-item-title">${cert.name}</span><span class="cv-item-date">${cert.date}</span></div>
            <div class="cv-item-company">${cert.org}</div>
        </div>`).join(''));

    // New function to generate Languages preview
    const generateLanguages = langs => generateSection('Languages', `<div class="skills-grid">${langs.map(lang => `
        <div class="skill-item">${lang.name} <span style="color: #555;">(${lang.proficiency || 'Proficient'})</span></div>`).join('')}</div>`);

    const generateSkills = skills => {
        const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
        return skillsArray.length > 0 ? generateSection('Skills', `<div class="skills-grid">${skillsArray.map(s => `<div class="skill-item">${s}</div>`).join('')}</div>`) : '';
    };

    const formatDescription = desc => `<ul>${desc.split('\n').filter(Boolean).map(line => `<li>${line.trim().replace(/^-|^\*|^\•/, '').trim()}</li>`).join('')}</ul>`;

    // --- DYNAMIC SECTION MANAGEMENT ---
    const addSection = (type) => {
        const container = document.getElementById(type);
        const div = document.createElement('div');
        div.className = 'dynamic-section';

        let count, headerText, fields;

        if (type === 'workExperience') {
            count = ++workExperienceCount;
            headerText = `Experience ${count}`;
            fields = `<input type="text" placeholder="Job Title" class="work-title">
                      <input type="text" placeholder="Company" class="work-company">
                      <input type="text" placeholder="Date (e.g., Jan 2020 - Present)" class="work-date">
                      <textarea placeholder="Achievements..." class="work-description"></textarea>`;
        } else if (type === 'projects') { // New 'projects' type
            count = ++projectsCount;
            headerText = `Project ${count}`;
            fields = `<input type="text" placeholder="Project Name" class="proj-name">
                      <input type="url" placeholder="Project Link (e.g., https://github.com/...)" class="proj-link">
                      <textarea placeholder="Description of the project..." class="proj-description"></textarea>`;
        } else if (type === 'education') {
            count = ++educationCount;
            headerText = `Education ${count}`;
            fields = `<input type="text" placeholder="Degree or Major" class="edu-degree">
                      <input type="text" placeholder="Institution Name" class="edu-institution">
                      <input type="text" placeholder="Graduation Date" class="edu-date">`;
        } else if (type === 'certifications') {
            count = ++certificationCount;
            headerText = `Certification ${count}`;
            fields = `<input type="text" placeholder="Certification Name" class="cert-name">
                      <input type="text" placeholder="Issuing Organization" class="cert-org">
                      <input type="text" placeholder="Date Obtained" class="cert-date">`;
        } else { // New 'languages' type
            count = ++languagesCount;
            headerText = `Language ${count}`;
            fields = `<input type="text" placeholder="Language (e.g., Spanish)" class="lang-name">
                      <input type="text" placeholder="Proficiency (e.g., Native, Fluent)" class="lang-prof">`;
        }

        div.innerHTML = `
            <div class="section-header">
                <h4>${headerText}</h4>
                <button class="btn btn-danger btn-sm remove-btn">Remove</button>
            </div>
            ${fields}
        `;

        div.querySelector('.remove-btn').onclick = () => { div.remove(); generateCV(); };
        container.appendChild(div);
        div.querySelectorAll('input, textarea').forEach(el => el.addEventListener('input', generateCV));
        generateCV();
    };
    
    // --- PDF EXPORT ---
    const downloadPdf = () => {
        // ... (This function remains unchanged from the last version)
    };

    // --- NOTIFICATIONS ---
    const showNotification = (message, type) => {
        // ... (This function remains unchanged)
    };

    // --- EVENT LISTENERS ---
    document.querySelectorAll('.editor-panel input, .editor-panel textarea').forEach(el => el.addEventListener('input', generateCV));
    document.getElementById('addWorkExperienceBtn').addEventListener('click', () => addSection('workExperience'));
    document.getElementById('addProjectBtn').addEventListener('click', () => addSection('projects')); // New listener
    document.getElementById('addEducationBtn').addEventListener('click', () => addSection('education'));
    document.getElementById('addCertificationBtn').addEventListener('click', () => addSection('certifications'));
    document.getElementById('addLanguageBtn').addEventListener('click', () => addSection('languages')); // New listener
    document.getElementById('downloadPdfBtn').addEventListener('click', downloadPdf);
    
    // --- INITIALIZATION ---
    generateCV();
});
