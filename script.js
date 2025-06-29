// Global Variables
let workExperienceCount = 0;
let educationCount = 0;
let certificationCount = 0;

// CV Data Management Class
class CVManager {
    constructor() {
        this.data = {
            personal: {},
            workExperience: [],
            education: [],
            certifications: [],
            skills: '',
            summary: ''
        };
    }

    // Collect all form data
    collectData() {
        this.data.personal = {
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
            <button class="btn btn-danger" onclick="removeSection(this, generateCV)">Remove</button>
        </div>
        <input type="text" placeholder="Job Title" class="work-title">
        <input type="text" placeholder="Company Name" class="work-company">
        <input type="text" placeholder="Start Date - End Date (e.g., Jan 2020 - Present)" class="work-date">
        <input type="text" placeholder="Location" class="work-location">
        <textarea placeholder="Job description and key achievements..." class="work-description"></textarea>
    `;
    
    container.appendChild(div);
    addEventListeners(div, generateCV);
}

function addEducation() {
    const container = document.getElementById('education');
    const div = createElement('div', 'dynamic-section');
    
    div.innerHTML = `
        <div class="section-header">
            <h4>Education ${++educationCount}</h4>
            <button class="btn btn-danger" onclick="removeSection(this, generateCV)">Remove</button>
        </div>
        <input type="text" placeholder="Degree (e.g., Bachelor of Arts)" class="edu-degree">
        <input type="text" placeholder="Institution Name" class="edu-institution">
        <input type="text" placeholder="Graduation Date (e.g., May 2018)" class="edu-date">
        <input type="text" placeholder="Location" class="edu-location">
    `;
    
    container.appendChild(div);
    addEventListeners(div, generateCV);
}

function addCertification() {
    const container = document.getElementById('certifications');
    const div = createElement('div', 'dynamic-section');
    
    div.innerHTML = `
        <div class="section-header">
            <h4>Certification ${++certificationCount}</h4>
            <button class="btn btn-danger" onclick="removeSection(this, generateCV)">Remove</button>
        </div>
        <input type="text" placeholder="Certification Name" class="cert-name">
        <input type="text" placeholder="Issuing Organization" class="cert-org">
        <input type="text" placeholder="Date Obtained (e.g., Dec 2020)" class="cert-date">
    `;
    
    container.appendChild(div);
    addEventListeners(div, generateCV);
}

function removeSection(button, callback) {
    button.closest('.dynamic-section').remove();
    if (callback) callback();
}

// CV Generation Functions
function generateCV() {
    const data = cvManager.collectData();
    const preview = document.getElementById('cvPreview');
    
    let html = generateHeader(data.personal);
    
    if (data.summary) {
        html += generateSection('Professional Summary', `<p>${data.summary}</p>`);
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

function generateHeader(personal) {
    const contactInfo = [
        personal.email,
        personal.phone,
        personal.location,
        personal.linkedin
    ].filter(item => item);
    
    return `
        <div class="cv-header">
            <div class="cv-name">${personal.fullName || 'Your Name'}</div>
            <div class="cv-title">${personal.jobTitle || 'Professional Title'}</div>
            <div class="cv-contact">
                ${contactInfo.join(' • ')}
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
    return description
        .split('\n')
        .map(line => line.trim())
        .filter(line => line)
        .map(line => {
            if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
                return `<div>• ${line.substring(1).trim()}</div>`;
            }
            return `<div>${line}</div>`;
        })
        .join('');
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

function loadDataFromObject(data) {
    // Clear existing dynamic sections
    clearDynamicSections();
    
    // Load personal information
    if (data.personal) {
        Object.keys(data.personal).forEach(key => {
            const element = document.getElementById(key);
            if (element) element.value = data.personal[key] || '';
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

function clearDynamicSections() {
    document.getElementById('workExperience').innerHTML = '';
    document.getElementById('education').innerHTML = '';
    document.getElementById('certifications').innerHTML = '';
    workExperienceCount = 0;
    educationCount = 0;
    certificationCount = 0;
}

// PDF Download Function
function downloadCV() {
    // Create a new window with the CV content for printing
    const printWindow = window.open('', '_blank');
    const cvContent = document.getElementById('cvPreview').innerHTML;
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>CV Download</title>
            <style>
                body { 
                    font-family: 'Times New Roman', serif; 
                    margin: 0; 
                    padding: 20px; 
                    line-height: 1.6; 
                    color: #333; 
                }
                .cv-header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #333; }
                .cv-name { font-size: 2em; font-weight: bold; color: #2c3e50; margin-bottom: 10px; }
                .cv-title { font-size: 1.2em; color: #7f8c8d; margin-bottom: 15px; }
                .cv-contact { display: flex; justify-content: center; flex-wrap: wrap; gap: 20px; font-size: 0.9em; }
                .cv-section { margin-bottom: 25px; }
                .cv-section-title { font-size: 1.1em; font-weight: bold; color: #2c3e50; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; }
                .cv-item { margin-bottom: 15px; }
                .cv-item-header { display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 5px; align-items: baseline; }
                .cv-item-title { color: #2c3e50; }
                .cv-item-date { color: #7f8c8d; font-style: italic; font-size: 0.9em; }
                .cv-item-company { color: #3498db; margin-bottom: 5px; font-weight: 500; }
                .cv-item-description { margin-left: 0; color: #555; font-size: 0.95em; }
                .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; }
                .skill-item { background: #ecf0f1; padding: 8px 12px; border-radius: 4px; text-align: center; font-size: 0.9em; color: #2c3e50; }
                @media print {
                    body { padding: 0; }
                    .cv-contact { flex-direction: row; justify-content: center; }
                }
            </style>
        </head>
        <body>
            ${cvContent}
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    // Trigger print dialog
    setTimeout(() => {
        printWindow.print();
    }, 250);
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = createElement('div', `notification notification-${type}`);
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        font-weight: 500;
        animation: slideIn 0.3s ease;
    `;
    
    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners to personal information fields
    ['fullName', 'jobTitle', 'email', 'phone', 'location', 'linkedin', 'summary', 'skills'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', generateCV);
        }
    });
    
    // Generate initial CV
    generateCV();
    
    // Show welcome notification
    showNotification('CV Maker loaded successfully! Start by filling in your information.', 'success');
});

// Handle window beforeunload to warn about unsaved changes
window.addEventListener('beforeunload', function(e) {
    const data = cvManager.collectData();
    const hasData = data.personal.fullName || data.personal.email || data.summary || 
                   data.workExperience.length > 0 || data.education.length > 0;
    
    if (hasData) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
    }
});
