// Global Variables
let workExperienceCount = 0;
let educationCount = 0;
let certificationCount = 0;

// CV Data Management Class
class CVManager {
    constructor() {
        this.data = {
            personal: {
                photo: null // --- NEW ---
            },
            workExperience: [],
            education: [],
            certifications: [],
            skills: '',
            summary: ''
        };
    }

    // --- UPDATED --- Collect all form data
    collectData() {
        // Collect personal info
        this.data.personal = {
            photo: document.getElementById('photoUpload').dataset.photoData || null, // --- NEW ---
            fullName: document.getElementById('fullName').value || '',
            jobTitle: document.getElementById('jobTitle').value || '',
            email: document.getElementById('email').value || '',
            phone: document.getElementById('phone').value || '',
            location: document.getElementById('location').value || '',
            linkedin: document.getElementById('linkedin').value || ''
        };

        this.data.summary = document.getElementById('summary').value || '';
        this.data.skills = document.getElementById('skills').value || '';

        // Collect work experience
        this.data.workExperience = [];
        document.querySelectorAll('#workExperience .dynamic-section').forEach(section => {
            this.data.workExperience.push({
                title: section.querySelector('.work-title').value || '',
                company: section.querySelector('.work-company').value || '',
                date: section.querySelector('.work-date').value || '',
                location: section.querySelector('.work-location').value || '',
                description: section.querySelector('.work-description').value || ''
            });
        });

        // Collect education
        this.data.education = [];
        document.querySelectorAll('#education .dynamic-section').forEach(section => {
            this.data.education.push({
                degree: section.querySelector('.edu-degree').value || '',
                institution: section.querySelector('.edu-institution').value || '',
                date: section.querySelector('.edu-date').value || '',
                location: section.querySelector('.edu-location').value || ''
            });
        });

        // Collect certifications
        this.data.certifications = [];
        document.querySelectorAll('#certifications .dynamic-section').forEach(section => {
            this.data.certifications.push({
                name: section.querySelector('.cert-name').value || '',
                org: section.querySelector('.cert-org').value || '',
                date: section.querySelector('.cert-date').value || ''
            });
        });

        return this.data;
    }
}

// Initialize CV Manager
const cvManager = new CVManager();

// DOM Manipulation Functions
function createElement(tag, className = '', innerHTML = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
}

function addEventListeners(container, callback) {
    container.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', callback);
    });
}

// Dynamic Section Management
function addWorkExperience() {
    const container = document.getElementById('workExperience');
    const div = createElement('div', 'dynamic-section');
    
    div.innerHTML = `
        <div class="section-header">
            <h4>Experience ${++workExperienceCount}</h4>
            <button class="btn btn-danger remove-btn">Remove</button>
        </div>
        <input type="text" placeholder="Job Title" class="work-title">
        <input type="text" placeholder="Company Name" class="work-company">
        <input type="text" placeholder="Start Date - End Date (e.g., Jan 2020 - Present)" class="work-date">
        <input type="text" placeholder="Location" class="work-location">
        <textarea placeholder="Job description and key achievements..." class="work-description"></textarea>
    `;
    
    container.appendChild(div);
    addEventListeners(div, generateCV);
    div.querySelector('.remove-btn').addEventListener('click', () => removeSection(div, generateCV));
}

function addEducation() {
    const container = document.getElementById('education');
    const div = createElement('div', 'dynamic-section');
    
    div.innerHTML = `
        <div class="section-header">
            <h4>Education ${++educationCount}</h4>
            <button class="btn btn-danger remove-btn">Remove</button>
        </div>
        <input type="text" placeholder="Degree (e.g., Bachelor of Arts)" class="edu-degree">
        <input type="text" placeholder="Institution Name" class="edu-institution">
        <input type="text" placeholder="Graduation Date (e.g., May 2018)" class="edu-date">
        <input type="text" placeholder="Location" class="edu-location">
    `;
    
    container.appendChild(div);
    addEventListeners(div, generateCV);
    div.querySelector('.remove-btn').addEventListener('click', () => removeSection(div, generateCV));
}

function addCertification() {
    const container = document.getElementById('certifications');
    const div = createElement('div', 'dynamic-section');
    
    div.innerHTML = `
        <div class="section-header">
            <h4>Certification ${++certificationCount}</h4>
            <button class="btn btn-danger remove-btn">Remove</button>
        </div>
        <input type="text" placeholder="Certification Name" class="cert-name">
        <input type="text" placeholder="Issuing Organization" class="cert-org">
        <input type="text" placeholder="Date Obtained (e.g., Dec 2020)" class="cert-date">
    `;
    
    container.appendChild(div);
    addEventListeners(div, generateCV);
    div.querySelector('.remove-btn').addEventListener('click', () => removeSection(div, generateCV));
}

function removeSection(section, callback) {
    section.remove();
    if (callback) callback();
}

// CV Generation Functions
function generateCV() {
    const data = cvManager.collectData();
    const preview = document.getElementById('cvPreview');
    
    let html = generateHeader(data.personal);
    
    if (data.summary) {
        html += generateSection('Professional Summary', `<p>${data.summary.replace(/\n/g, '<br>')}</p>`);
    }
    
    if (data.workExperience.length > 0) {
        html += generateWorkExperience(data.workExperience);
    }
    
    if (data.education.length > 0) {
        html += generateEducation(data.education);
    }
    
    if (data.skills) {
        html += generateSkills(data.skills);
    }
    
    if (data.certifications.length > 0) {
        html += generateCertifications(data.certifications);
    }
    
    preview.innerHTML = html;
}

// --- UPDATED --- Header generation with photo logic
function generateHeader(personal) {
    const contactInfo = [
        personal.email,
        personal.phone,
        personal.location,
        personal.linkedin ? `<a href="${personal.linkedin}" target="_blank">${personal.linkedin}</a>` : ''
    ].filter(item => item).join(' • ');

    const photoHTML = personal.photo 
        ? `<div class="cv-photo-container"><img src="${personal.photo}" alt="Profile Photo" class="cv-photo"></div>` 
        : '<div class="cv-photo-container"></div>';

    const headerClass = personal.photo ? 'cv-header has-photo' : 'cv-header';

    return `
        <div class="${headerClass}">
            ${photoHTML}
            <div class="cv-header-info">
                <div class="cv-name">${personal.fullName || 'Your Name'}</div>
                <div class="cv-title">${personal.jobTitle || 'Professional Title'}</div>
                <div class="cv-contact">${contactInfo || 'Contact Information'}</div>
            </div>
        </div>
    `;
}


function generateSection(title, content) {
    return `
        <div class="cv-section">
            <div class="cv-section-title">${title}</div>
            ${content}
        </div>
    `;
}

function generateWorkExperience(experiences) {
    const content = experiences
        .filter(exp => exp.title || exp.company)
        .map(exp => `
            <div class="cv-item">
                <div class="cv-item-header">
                    <span class="cv-item-title">${exp.title}</span>
                    <span class="cv-item-date">${exp.date}</span>
                </div>
                <div class="cv-item-company">${exp.company}${exp.location ? `, ${exp.location}` : ''}</div>
                ${exp.description ? `<div class="cv-item-description">${formatDescription(exp.description)}</div>` : ''}
            </div>
        `).join('');
    
    return generateSection('Work Experience', content);
}

function generateEducation(education) {
    const content = education
        .filter(edu => edu.degree || edu.institution)
        .map(edu => `
            <div class="cv-item">
                <div class="cv-item-header">
                    <span class="cv-item-title">${edu.degree}</span>
                    <span class="cv-item-date">${edu.date}</span>
                </div>
                <div class="cv-item-company">${edu.institution}${edu.location ? `, ${edu.location}` : ''}</div>
            </div>
        `).join('');
    
    return generateSection('Education', content);
}

function generateSkills(skills) {
    const skillsArray = skills.split(',').map(s => s.trim()).filter(s => s);
    if (skillsArray.length === 0) return '';
    
    const content = `
        <div class="skills-grid">
            ${skillsArray.map(skill => `<div class="skill-item">${skill}</div>`).join('')}
        </div>
    `;
    
    return generateSection('Skills', content);
}

function generateCertifications(certifications) {
    const content = certifications
        .filter(cert => cert.name || cert.org)
        .map(cert => `
            <div class="cv-item">
                <div class="cv-item-header">
                    <span class="cv-item-title">${cert.name}</span>
                    <span class="cv-item-date">${cert.date}</span>
                </div>
                ${cert.org ? `<div class="cv-item-company">${cert.org}</div>` : ''}
            </div>
        `).join('');
    
    return generateSection('Certifications', content);
}

function formatDescription(description) {
    // Convert line breaks to HTML and format bullet points
    return '<ul>' + description
        .split('\n')
        .map(line => line.trim())
        .filter(line => line)
        .map(line => {
            if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
                return `<li>${line.substring(1).trim()}</li>`;
            }
            return `<li>${line}</li>`;
        })
        .join('') + '</ul>';
}

// Data Persistence Functions
function saveData() {
    const data = cvManager.collectData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = createElement('a');
    
    a.href = url;
    a.download = `cv-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('CV data saved successfully!', 'success');
}

function loadData() {
    const input = createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                loadDataFromObject(data);
                showNotification('CV data loaded successfully!', 'success');
            } catch (error) {
                showNotification('Error loading file: Invalid format', 'error');
                console.error('Load error:', error);
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

// --- UPDATED --- Load data function to handle photo
function loadDataFromObject(data) {
    // Clear existing dynamic sections and photo
    clearAllData();
    
    // Load personal information
    if (data.personal) {
        Object.keys(data.personal).forEach(key => {
            if (key === 'photo' && data.personal.photo) {
                document.getElementById('photoUpload').dataset.photoData = data.personal.photo;
                document.getElementById('removePhotoBtn').style.display = 'inline-block';
            } else {
                const element = document.getElementById(key);
                if (element) element.value = data.personal[key] || '';
            }
        });
    }
    
    // Load summary and skills
    document.getElementById('summary').value = data.summary || '';
    document.getElementById('skills').value = data.skills || '';
    
    // Load work experience
    if (data.workExperience && data.workExperience.length > 0) {
        data.workExperience.forEach(exp => {
            addWorkExperience();
            const section = document.querySelector('#workExperience .dynamic-section:last-child');
            section.querySelector('.work-title').value = exp.title || '';
            section.querySelector('.work-company').value = exp.company || '';
            section.querySelector('.work-date').value = exp.date || '';
            section.querySelector('.work-location').value = exp.location || '';
            section.querySelector('.work-description').value = exp.description || '';
        });
    }
    
    // Load education
    if (data.education && data.education.length > 0) {
        data.education.forEach(edu => {
            addEducation();
            const section = document.querySelector('#education .dynamic-section:last-child');
            section.querySelector('.edu-degree').value = edu.degree || '';
            section.querySelector('.edu-institution').value = edu.institution || '';
            section.querySelector('.edu-date').value = edu.date || '';
            section.querySelector('.edu-location').value = edu.location || '';
        });
    }
    
    // Load certifications
    if (data.certifications && data.certifications.length > 0) {
        data.certifications.forEach(cert => {
            addCertification();
            const section = document.querySelector('#certifications .dynamic-section:last-child');
            section.querySelector('.cert-name').value = cert.name || '';
            section.querySelector('.cert-org').value = cert.org || '';
            section.querySelector('.cert-date').value = cert.date || '';
        });
    }
    
    generateCV();
}

// --- UPDATED --- Renamed function to be more accurate
function clearAllData() {
    document.getElementById('workExperience').innerHTML = '';
    document.getElementById('education').innerHTML = '';
    document.getElementById('certifications').innerHTML = '';
    workExperienceCount = 0;
    educationCount = 0;
    certificationCount = 0;

    // --- NEW --- Clear photo data
    const photoInput = document.getElementById('photoUpload');
    photoInput.value = ''; // Reset file input
    delete photoInput.dataset.photoData;
    document.getElementById('removePhotoBtn').style.display = 'none';
}


// PDF Download Function
function downloadCV() {
    window.print();
}

// Notification System (omitted for brevity, no changes)
function showNotification(message, type = 'info') { /* ... no changes ... */ }

// --- UPDATED --- Initialize the application with modern event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners to personal information fields for live updates
    ['fullName', 'jobTitle', 'email', 'phone', 'location', 'linkedin', 'summary', 'skills'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', generateCV);
        }
    });

    // --- NEW --- Event listener for photo upload
    const photoInput = document.getElementById('photoUpload');
    const removePhotoBtn = document.getElementById('removePhotoBtn');

    photoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            photoInput.dataset.photoData = event.target.result;
            removePhotoBtn.style.display = 'inline-block';
            generateCV();
        };
        reader.readAsDataURL(file);
    });

    removePhotoBtn.addEventListener('click', function() {
        photoInput.value = ''; // Reset file input
        delete photoInput.dataset.photoData;
        removePhotoBtn.style.display = 'none';
        generateCV();
    });

    // --- NEW --- Refactored button clicks from HTML onclick
    document.querySelector('.editor-panel').addEventListener('click', (e) => {
        if (e.target.matches('button')) {
            const text = e.target.textContent;
            if (text.includes('Add Experience')) addWorkExperience();
            if (text.includes('Add Education')) addEducation();
            if (text.includes('Add Certification')) addCertification();
            if (text.includes('Update Preview')) generateCV();
            if (text.includes('Download PDF')) downloadCV();
            if (text.includes('Save Data')) saveData();
            if (text.includes('Load Data')) loadData();
        }
    });

    document.querySelector('.preview-header .btn').addEventListener('click', () => window.print());

    // Generate initial CV
    generateCV();
    
    showNotification('CV Maker ready!', 'success');
});

// Handle window beforeunload to warn about unsaved changes (omitted for brevity, no changes)
window.addEventListener('beforeunload', function(e) { /* ... no changes ... */ });
