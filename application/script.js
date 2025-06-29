// Global Variables
let workExperienceCount = 0;
let educationCount = 0;
let certificationCount = 0;

// CV Data Management Class
class CVManager {
    constructor() {
        this.data = {
            personal: {
                photo: null // Will hold the image data
            },
            workExperience: [],
            education: [],
            certifications: [],
            skills: '',
            summary: ''
        };
    }

    // Collects all data from the form, including the new photo data
    collectData() {
        this.data.personal = {
            photo: document.getElementById('photoUpload').dataset.photoData || null,
            fullName: document.getElementById('fullName').value || '',
            jobTitle: document.getElementById('jobTitle').value || '',
            email: document.getElementById('email').value || '',
            phone: document.getElementById('phone').value || '',
            location: document.getElementById('location').value || '',
            linkedin: document.getElementById('linkedin').value || ''
        };

        this.data.summary = document.getElementById('summary').value || '';
        this.data.skills = document.getElementById('skills').value || '';

        // (The rest of the data collection is unchanged)
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
        this.data.education = [];
        document.querySelectorAll('#education .dynamic-section').forEach(section => {
            this.data.education.push({
                degree: section.querySelector('.edu-degree').value || '',
                institution: section.querySelector('.edu-institution').value || '',
                date: section.querySelector('.edu-date').value || '',
                location: section.querySelector('.edu-location').value || ''
            });
        });
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

// (Helper functions like createElement are unchanged)
function createElement(tag, className = '', innerHTML = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
}

function addDynamicEventListeners(container, callback) {
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
            <button class="btn btn-danger remove-btn btn-sm">Remove</button>
        </div>
        <input type="text" placeholder="Job Title" class="work-title">
        <input type="text" placeholder="Company Name" class="work-company">
        <input type="text" placeholder="Start - End Date" class="work-date">
        <input type="text" placeholder="Location" class="work-location">
        <textarea placeholder="Job description..." class="work-description"></textarea>`;
    container.appendChild(div);
    addDynamicEventListeners(div, generateCV);
    div.querySelector('.remove-btn').addEventListener('click', () => removeSection(div, generateCV));
}
function addEducation() {
    const container = document.getElementById('education');
    const div = createElement('div', 'dynamic-section');
    div.innerHTML = `
        <div class="section-header">
            <h4>Education ${++educationCount}</h4>
            <button class="btn btn-danger remove-btn btn-sm">Remove</button>
        </div>
        <input type="text" placeholder="Degree" class="edu-degree">
        <input type="text" placeholder="Institution" class="edu-institution">
        <input type="text" placeholder="Date" class="edu-date">
        <input type="text" placeholder="Location" class="edu-location">`;
    container.appendChild(div);
    addDynamicEventListeners(div, generateCV);
    div.querySelector('.remove-btn').addEventListener('click', () => removeSection(div, generateCV));
}
function addCertification() {
    const container = document.getElementById('certifications');
    const div = createElement('div', 'dynamic-section');
    div.innerHTML = `
        <div class="section-header">
            <h4>Certification ${++certificationCount}</h4>
            <button class="btn btn-danger remove-btn btn-sm">Remove</button>
        </div>
        <input type="text" placeholder="Certification Name" class="cert-name">
        <input type="text" placeholder="Issuing Organization" class="cert-org">
        <input type="text" placeholder="Date Obtained" class="cert-date">`;
    container.appendChild(div);
    addDynamicEventListeners(div, generateCV);
    div.querySelector('.remove-btn').addEventListener('click', () => removeSection(div, generateCV));
}
function removeSection(section, callback) {
    section.remove();
    if (callback) callback();
}


// --- THIS IS THE KEY FUNCTION THAT UPDATES THE PREVIEW ---
function generateCV() {
    const data = cvManager.collectData();
    const preview = document.getElementById('cvPreview');
    
    // It starts by generating the header, which now knows how to handle a photo
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

// --- THIS FUNCTION NOW BUILDS THE HEADER DIFFERENTLY IF A PHOTO EXISTS ---
function generateHeader(personal) {
    const contactInfo = [
        personal.email,
        personal.phone,
        personal.location,
        personal.linkedin ? `<a href="https://${personal.linkedin}" target="_blank">${personal.linkedin}</a>` : ''
    ].filter(item => item).join(' • ');

    // If personal.photo has data, create an <img> tag for it. Otherwise, create an empty container.
    const photoHTML = personal.photo 
        ? `<div class="cv-photo-container"><img src="${personal.photo}" alt="Profile Photo" class="cv-photo"></div>` 
        : '<div class="cv-photo-container"></div>';

    // Add the .has-photo class to the header if a photo exists, which triggers the CSS changes.
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

// (The rest of the generate... functions are mostly unchanged)
function generateSection(title, content) { /* ... */ }
function generateWorkExperience(experiences) { /* ... */ }
function generateEducation(education) { /* ... */ }
function generateSkills(skills) { /* ... */ }
function generateCertifications(certifications) { /* ... */ }
function formatDescription(description) { /* ... */ }

// Data Persistence Functions (Save/Load)
function saveData() { /* ... */ }
function loadData() { /* ... */ }

// This function now knows how to handle the 'photo' property in a saved file
function loadDataFromObject(data) {
    clearAllData();
    if (data.personal) {
        Object.keys(data.personal).forEach(key => {
            if (key === 'photo' && data.personal.photo) {
                // If photo data exists, store it and show the remove button
                document.getElementById('photoUpload').dataset.photoData = data.personal.photo;
                document.getElementById('removePhotoBtn').style.display = 'inline-block';
            } else {
                const element = document.getElementById(key);
                if (element) element.value = data.personal[key] || '';
            }
        });
    }
    // (The rest of the function is unchanged)
    document.getElementById('summary').value = data.summary || '';
    document.getElementById('skills').value = data.skills || '';
    if (data.workExperience) data.workExperience.forEach(exp => { addWorkExperience(); /* ... set values ... */ });
    if (data.education) data.education.forEach(edu => { addEducation(); /* ... set values ... */ });
    if (data.certifications) data.certifications.forEach(cert => { addCertification(); /* ... set values ... */ });
    
    generateCV(); // Regenerate the preview with the new data
}

// This function now also clears the photo
function clearAllData() {
    document.getElementById('workExperience').innerHTML = '';
    document.getElementById('education').innerHTML = '';
    document.getElementById('certifications').innerHTML = '';
    workExperienceCount = 0;
    educationCount = 0;
    certificationCount = 0;

    const photoInput = document.getElementById('photoUpload');
    photoInput.value = '';
    delete photoInput.dataset.photoData;
    document.getElementById('removePhotoBtn').style.display = 'none';
}

function downloadCV() { window.print(); }

function showNotification(message, type = 'info') { /* ... */ }

// --- THIS IS THE MOST IMPORTANT PART FOR THE UPLOAD ---
// It sets up all the button clicks and input changes.
document.addEventListener('DOMContentLoaded', function() {
    // Live updates for text fields
    ['fullName', 'jobTitle', 'email', 'phone', 'location', 'linkedin', 'summary', 'skills'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', generateCV);
    });

    // Event listeners for the photo buttons
    const photoInput = document.getElementById('photoUpload');
    const removePhotoBtn = document.getElementById('removePhotoBtn');

    // THIS CODE RUNS WHEN YOU SELECT A FILE
    photoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            // 1. Read the file and store its data
            photoInput.dataset.photoData = event.target.result;
            removePhotoBtn.style.display = 'inline-block';
            // 2. Immediately update the CV preview
            generateCV();
        };
        reader.readAsDataURL(file);
    });

    // This code runs when you click "Remove Photo"
    removePhotoBtn.addEventListener('click', function() {
        photoInput.value = '';
        delete photoInput.dataset.photoData;
        removePhotoBtn.style.display = 'none';
        generateCV();
    });

    // Event listeners for all other buttons
    document.getElementById('addWorkExperienceBtn')?.addEventListener('click', addWorkExperience);
    document.getElementById('addEducationBtn')?.addEventListener('click', addEducation);
    document.getElementById('addCertificationBtn')?.addEventListener('click', addCertification);
    document.getElementById('updatePreviewBtn')?.addEventListener('click', generateCV);
    document.getElementById('downloadPdfBtn')?.addEventListener('click', downloadCV);
    document.getElementById('saveDataBtn')?.addEventListener('click', saveData);
    document.getElementById('loadDataBtn')?.addEventListener('click', loadData);
    document.getElementById('printCvBtn')?.addEventListener('click', downloadCV);

    // Initial generation of the CV preview
    generateCV();
    
    showNotification('CV Maker ready!', 'success');
});

window.addEventListener('beforeunload', function(e) { /* ... */ });
