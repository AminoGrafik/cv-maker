document.addEventListener('DOMContentLoaded', function() {
    // --- STATE & COUNTERS ---
    let workExperienceCount = 0;
    let educationCount = 0;
    let certificationCount = 0;

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
    });

    // --- CV PREVIEW GENERATION ---
    const generateCV = () => {
        const data = collectData();
        const preview = document.getElementById('cvPreview');
        preview.innerHTML = `
            ${generateHeader(data.personal)}
            ${data.summary ? generateSection('Professional Summary', `<p>${data.summary.replace(/\n/g, '<br>')}</p>`) : ''}
            ${data.workExperience.length > 0 ? generateWorkExperience(data.workExperience) : ''}
            ${data.education.length > 0 ? generateEducation(data.education) : ''}
            ${data.skills ? generateSkills(data.skills) : ''}
            ${data.certifications.length > 0 ? generateCertifications(data.certifications) : ''}
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

        return `
            <div class="cv-header">
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

    const generateEducation = edus => generateSection('Education', edus.map(edu => `
        <div class="cv-item">
            <div class="cv-item-header">
                <span class="cv-item-title">${edu.degree}</span>
                <span class="cv-item-date">${edu.date}</span>
            </div>
            <div class="cv-item-company">${edu.institution}</div>
        </div>`).join(''));
        
    const generateSkills = skills => {
        const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
        return skillsArray.length > 0 ? generateSection('Skills', `<div class="skills-grid">${skillsArray.map(s => `<div class="skill-item">${s}</div>`).join('')}</div>`) : '';
    };

    const generateCertifications = certs => generateSection('Certifications', certs.map(cert => `
        <div class="cv-item">
            <div class="cv-item-header"><span class="cv-item-title">${cert.name}</span><span class="cv-item-date">${cert.date}</span></div>
            <div class="cv-item-company">${cert.org}</div>
        </div>`).join(''));

    const formatDescription = desc => `<ul>${desc.split('\n').filter(Boolean).map(line => `<li>${line.trim().replace(/^-|^\*|^\•/, '').trim()}</li>`).join('')}</ul>`;

    // --- DYNAMIC SECTION MANAGEMENT ---
    const addSection = (type) => {
        const container = document.getElementById(type);
        const div = document.createElement('div');
        div.className = 'dynamic-section';
        let count, fields;
        if (type === 'workExperience') {
            count = ++workExperienceCount;
            fields = `<h4>Experience ${count}</h4><input type="text" placeholder="Job Title" class="work-title"><input type="text" placeholder="Company" class="work-company"><input type="text" placeholder="Date (e.g., Jan 2020 - Present)" class="work-date"><textarea placeholder="Achievements..." class="work-description"></textarea>`;
        } else if (type === 'education') {
            count = ++educationCount;
            fields = `<h4>Education ${count}</h4><input type="text" placeholder="Degree or Major" class="edu-degree"><input type="text" placeholder="Institution Name" class="edu-institution"><input type="text" placeholder="Graduation Date" class="edu-date">`;
        } else { // certifications
            count = ++certificationCount;
            fields = `<h4>Certification ${count}</h4><input type="text" placeholder="Certification Name" class="cert-name"><input type="text" placeholder="Issuing Organization" class="cert-org"><input type="text" placeholder="Date Obtained" class="cert-date">`;
        }
        div.innerHTML = `<div class="section-header">${fields}</div><button class="btn btn-danger btn-sm remove-btn">Remove</button>`;
        div.querySelector('.remove-btn').onclick = () => { div.remove(); generateCV(); };
        container.appendChild(div);
        div.querySelectorAll('input, textarea').forEach(el => el.addEventListener('input', generateCV));
    };
    
    // --- PDF EXPORT ---
    const downloadPdf = () => {
        const { jsPDF } = window.jspdf;
        const cvElement = document.getElementById('cvPreview');
        const fullName = document.getElementById('fullName').value || 'cv';
        
        showNotification('Generating PDF...', 'info');

        html2canvas(cvElement, { scale: 2, logging: false }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const imgHeight = canvas.height * pdfWidth / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;
            
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdf.internal.pageSize.getHeight();
            
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdf.internal.pageSize.getHeight();
            }
            pdf.save(`${fullName.replace(/\s/g, '_')}_CV.pdf`);
        }).catch(err => {
            showNotification('Error generating PDF.', 'error');
            console.error(err);
        });
    };

    // --- NOTIFICATIONS ---
    const showNotification = (message, type) => {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `position:fixed; top:20px; right:20px; padding:15px; border-radius:8px; color:white; z-index:1001; background-color:${type === 'info' ? '#3498db' : type === 'error' ? '#e74c3c' : '#27ae60'};`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    };

    // --- EVENT LISTENERS ---
    document.querySelectorAll('.editor-panel input, .editor-panel textarea').forEach(el => el.addEventListener('input', generateCV));
    document.getElementById('addWorkExperienceBtn').addEventListener('click', () => addSection('workExperience'));
    document.getElementById('addEducationBtn').addEventListener('click', () => addSection('education'));
    document.getElementById('addCertificationBtn').addEventListener('click', () => addSection('certifications'));
    document.getElementById('downloadPdfBtn').addEventListener('click', downloadPdf);
    // (Save/Load functionality would be added here)

    // --- INITIALIZATION ---
    generateCV();
});
