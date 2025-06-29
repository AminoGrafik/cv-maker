document.addEventListener('DOMContentLoaded', function() {
    // --- STATE & COUNTERS ---
    let workExperienceCount = 0, educationCount = 0, certificationCount = 0,
        projectsCount = 0, languagesCount = 0, awardsCount = 0,
        publicationsCount = 0, volunteerCount = 0;

    // --- NEW: Debounce Utility ---
    // This function prevents a function from running too often.
    // It will wait for the user to stop typing for 300ms before updating the preview.
    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    };

    // --- DATA COLLECTION --- (Unchanged)
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
        projects: Array.from(document.querySelectorAll('#projects .dynamic-section')).map(s => ({
            name: s.querySelector('.proj-name').value,
            link: s.querySelector('.proj-link').value,
            description: s.querySelector('.proj-description').value,
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

    // --- CV PREVIEW GENERATION --- (Unchanged)
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

    // --- All 'generate...' functions are unchanged ---
    const generateHeader = (personal) => { /* ... */ };
    const generateSection = (title, content) => { /* ... */ };
    const generateWorkExperience = exps => { /* ... */ };
    const generateProjects = projs => { /* ... */ };
    const generateEducation = edus => { /* ... */ };
    const generateAwards = awds => { /* ... */ };
    const generatePublications = pubs => { /* ... */ };
    const generateVolunteer = vols => { /* ... */ };
    const generateCertifications = certs => { /* ... */ };
    const generateLanguages = langs => { /* ... */ };
    const generateSkills = skills => { /* ... */ };

    // --- DYNAMIC SECTION MANAGEMENT ---
    const addSection = (type) => {
        const container = document.getElementById(type);
        const div = document.createElement('div');
        div.className = 'dynamic-section';
        let count = 0, headerText = '', fields = '';

        const createTrixEditor = (id, inputClass) => `<input id="${id}" type="hidden" class="${inputClass}"><trix-editor input="${id}" class="trix-content"></trix-editor>`;

        switch(type) {
            // ... cases for all section types (unchanged)
        }

        div.innerHTML = `<div class="section-header"><h4>${headerText}</h4><button class="btn btn-danger btn-sm remove-btn">Remove</button></div>${fields}`;
        div.querySelector('.remove-btn').onclick = () => { div.remove(); generateCV(); };
        container.appendChild(div);
        
        // UPDATED: Apply the debounce function to the new fields
        div.querySelectorAll('input:not([type=hidden]), trix-editor').forEach(el => {
            el.addEventListener('input', debounce(generateCV, 300));
        });
        
        // We still call generateCV once immediately to show the new empty section
        generateCV();
    };
    
    // --- PDF EXPORT --- (Unchanged)
    const downloadPdf = () => { /* ... */ };

    // --- NOTIFICATIONS --- (Unchanged)
    const showNotification = (message, type) => { /* ... */ };

    // --- EVENT LISTENERS (THIS IS THE FIX) ---
    const debouncedGenerateCV = debounce(generateCV, 300);

    // UPDATED: Apply the debounce function to all existing fields
    document.querySelectorAll('.editor-panel input, .editor-panel textarea, .editor-panel trix-editor').forEach(el => {
        el.addEventListener('input', debouncedGenerateCV);
    });
    
    // The "Add" buttons still work instantly, only the typing is debounced.
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
