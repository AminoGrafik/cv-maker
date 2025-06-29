document.addEventListener('DOMContentLoaded', function() {
    
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

    const debouncedGenerateCV = debounce(generateCV, 400);

    // --- TEMPLATE FOR CREATING A DYNAMIC CARD ---
    function createCard(type, content) {
        const container = document.getElementById(type);
        const card = document.createElement('div');
        card.className = 'form-card is-open';

        // Set content and add to the page
        card.innerHTML = content;
        container.appendChild(card);

        // --- Add Event Listeners for the new card ---
        const header = card.querySelector('.form-card-header');
        const titleInput = card.querySelector('.card-title-input');
        
        // Expand/Collapse functionality
        header.addEventListener('click', (e) => {
            // Don't collapse if a button was clicked
            if (e.target.closest('button')) return;
            card.classList.toggle('is-open');
            card.classList.toggle('is-closed');
        });

        // Update card header title as user types
        if (titleInput) {
            titleInput.addEventListener('input', () => {
                const titleElement = card.querySelector('.form-card-header .title');
                titleElement.textContent = titleInput.value || 'Untitled';
            });
        }
        
        // Add listeners to all inputs within the new card
        card.querySelectorAll('input, trix-editor').forEach(el => {
            el.addEventListener('input', debouncedGenerateCV);
        });
    }

    // --- DEDICATED FUNCTION FOR EACH SECTION TYPE ---
    function addWorkExperience() {
        const content = `
            <div class="form-card-header">
                <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg></span>
                <div class="title">Untitled</div>
                <span class="chevron"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
            </div>
            <div class="form-card-body">
                <div class="form-card-grid-2">
                    <div class="form-group"><label>Job Title</label><input type="text" class="card-title-input work-title" placeholder="e.g., Service Designer"></div>
                    <div class="form-group"><label>Company/Employer</label><input type="text" class="work-company" placeholder="e.g., Acme Inc."></div>
                </div>
                <div class="form-card-grid-2">
                    <div class="form-group"><label>Start Date</label><input type="text" class="work-start-date" placeholder="e.g., Jan 2020"></div>
                    <div class="form-group"><label>End Date</label><input type="text" class="work-end-date" placeholder="e.g., Present"></div>
                </div>
                <div class="form-group"><label>Description</label><input class="work-description" type="hidden"><trix-editor input="work-description"></trix-editor></div>
            </div>`;
        createCard('workExperience', content);
    }
    
    function addProject() {
        const content = `
            <div class="form-card-header">
                 <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg></span>
                <div class="title">Untitled</div>
                <span class="chevron"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
            </div>
            <div class="form-card-body">
                <div class="form-group"><label>Project Name</label><input type="text" class="card-title-input project-name"></div>
                <div class="form-group"><label>Project Link</label><input type="text" class="project-link"></div>
                <div class="form-group"><label>Description</label><input class="project-description" type="hidden"><trix-editor input="project-description"></trix-editor></div>
            </div>`;
        createCard('projects', content);
    }
    
    function addEducation() {
        const content = `
            <div class="form-card-header">
                <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg></span>
                <div class="title">Untitled</div>
                <span class="chevron"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
            </div>
            <div class="form-card-body">
                <div class="form-group"><label>Degree or Major</label><input type="text" class="card-title-input edu-degree"></div>
                <div class="form-group"><label>Institution</label><input type="text" class="edu-institution"></div>
                <div class="form-group"><label>Graduation Date</label><input type="text" class="edu-date"></div>
            </div>`;
        createCard('education', content);
    }

    // --- DATA COLLECTION & CV GENERATION ---
    function collectData() {
        // This function will need to be rewritten to collect from the new card structure
        // For now, let's just get the personal details to show the preview works.
        return {
            personal: {
                fullName: document.getElementById('fullName').value,
                jobTitle: document.getElementById('jobTitle').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                location: document.getElementById('location').value,
            },
            summary: document.getElementById('summary').value,
            // ... collect other data later
        };
    }

    function generateCV() {
        const data = collectData();
        const preview = document.getElementById('cvPreview');

        // Simple preview for now, will be expanded
        preview.innerHTML = `
            <div style="text-align: right; margin-bottom: 24px;">
                <p>${data.personal.fullName || 'Matthew Smith'}</p>
                <p style="font-size: 14px; color: #6b7280;">${data.personal.jobTitle || 'Service Designer'}</p>
            </div>
             <div style="text-align: right; font-size: 14px; color: #6b7280;">
                <p>${data.personal.location || 'Your City, ST 123456'}</p>
                <p>${data.personal.phone || '(123) 456-7890'}</p>
                <p>${data.personal.email || 'matthew@smith.com'}</p>
            </div>
            <hr style="margin: 16px 0;">
            <h3 style="font-size: 16px; margin-bottom: 8px;">Short Bio</h3>
            <div>${data.summary || ''}</div>
        `;
    }

    // --- Main Event Listeners ---
    document.getElementById('addWorkExperienceBtn').addEventListener('click', addWorkExperience);
    document.getElementById('addProjectBtn').addEventListener('click', addProject);
    document.getElementById('addEducationBtn').addEventListener('click', addEducation);
    
    // Add listeners to static fields
    document.querySelectorAll('.editor-panel input, .editor-panel trix-editor').forEach(el => {
        el.addEventListener('input', debouncedGenerateCV);
    });

    // Add one of each card to start
    addWorkExperience();
    addProject();
    addEducation();
    
    // Initial CV generation
    generateCV();
});
