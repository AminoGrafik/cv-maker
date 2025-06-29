document.addEventListener('DOMContentLoaded', function() {
    // --- STATE & DOM ELEMENTS ---
    let workExperienceCount = 0;
    let educationCount = 0;
    let certificationCount = 0;
    const photoInput = document.getElementById('photoUpload');
    const removePhotoBtn = document.getElementById('removePhotoBtn');

    // --- DATA MANAGEMENT ---
    const collectData = () => ({
        personal: {
            photo: photoInput.dataset.photoData || null,
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
            location: s.querySelector('.work-location').value,
            description: s.querySelector('.work-description').value,
        })),
        education: Array.from(document.querySelectorAll('#education .dynamic-section')).map(s => ({
            degree: s.querySelector('.edu-degree').value,
            institution: s.querySelector('.edu-institution').value,
            date: s.querySelector('.edu-date').value,
            location: s.querySelector('.edu-location').value,
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
        let linkedInUrl = personal.linkedin;
        if (linkedInUrl && !linkedInUrl.toLowerCase().startsWith('http')) {
            linkedInUrl = `https://${linkedInUrl}`;
        }
        const linkedInHtml = linkedInUrl ? `<a href="${linkedInUrl}" target="_blank">${personal.linkedin}</a>` : '';
        const contactInfo = [personal.email, personal.phone, personal.location, linkedInHtml].filter(Boolean).join(' • ');
        const photoHTML = personal.photo ? `<div class="cv-photo-container"><img src="${personal.photo}" class="cv-photo" alt="Profile"></div>` : '';
        return `
            <div class="cv-header ${personal.photo ? 'has-photo' : ''}">
                ${photoHTML}
                <div class="cv-header-info">
                    <div class="cv-name">${personal.fullName || 'Your Name'}</div>
                    <div class="cv-title">${personal.jobTitle || 'Professional Title'}</div>
                    <div class="cv-contact">${contactInfo}</div>
                </div>
            </div>
        `;
    };

    const generateSection = (title, content) => `<div class="cv-section"><div class="cv-section-title">${title}</div>${content}</div>`;
    
    const generateWorkExperience = exps => generateSection('Work Experience', exps.map(exp => `
        <div class="cv-item">
            <div class="cv-item-header">
                <span class="cv-item-title">${exp.title}</span>
                <span class="cv-item-date">${exp.date}</span>
            </div>
            <div class="cv-item-company">${exp.company}${exp.location ? `, ${exp.location}` : ''}</div>
            ${exp.description ? `<div class="cv-item-description">${formatDescription(exp.description)}</div>` : ''}
        </div>`).join(''));

    const generateEducation = edus => generateSection('Education', edus.map(edu => `
        <div class="cv-item">
            <div class="cv-item-header">
                <span class="cv-item-title">${edu.degree}</span>
                <span class="cv-item-date">${edu.date}</span>
            </div>
            <div class="cv-item-company">${edu.institution}${edu.location ? `, ${edu.location}` : ''}</div>
        </div>`).join(''));
        
    const generateSkills = skills => {
        const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
        return skillsArray.length > 0 ? generateSection('Skills', `<div class="skills-grid">${skillsArray.map(s => `<div class="skill-item">${s}</div>`).join('')}</div>`) : '';
    };

    const generateCertifications = certs => generateSection('Certifications', certs.map(cert => `
        <div class="cv-item">
            <div class="cv-item-header">
                <span class="cv-item-title">${cert.name}</span>
                <span class="cv-item-date">${cert.date}</span>
            </div>
            <div class="cv-item-company">${cert.org}</div>
        </div>`).join(''));

    const formatDescription = desc => `<ul>${desc.split('\n').filter(Boolean).map(line => `<li>${line.trim().replace(/^-|^\*|^\•/, '').trim()}</li>`).join('')}</ul>`;

    // --- DYNAMIC SECTION ADD/REMOVE ---
    const addSection = (type) => {
        const container = document.getElementById(type);
        const div = document.createElement('div');
        div.className = 'dynamic-section';
        let html = '';
        if (type === 'workExperience') {
            html = `<h4>Experience ${++workExperienceCount}</h4><input type="text" placeholder="Job Title" class="work-title"><input type="text" placeholder="Company" class="work-company"><input type="text" placeholder="Date" class="work-date"><input type="text" placeholder="Location" class="work-location"><textarea placeholder="Description..." class="work-description"></textarea>`;
        } else if (type === 'education') {
            html = `<h4>Education ${++educationCount}</h4><input type="text" placeholder="Degree" class="edu-degree"><input type="text" placeholder="Institution" class="edu-institution"><input type="text" placeholder="Date" class="edu-date"><input type="text" placeholder="Location" class="edu-location">`;
        } else if (type === 'certifications') {
            html = `<h4>Certification ${++certificationCount}</h4><input type="text" placeholder="Name" class="cert-name"><input type="text" placeholder="Organization" class="cert-org"><input type="text" placeholder="Date" class="cert-date">`;
        }
        div.innerHTML = `<div class="section-header">${html}</div><button class="btn btn-danger btn-sm remove-btn">Remove</button>`;
        div.querySelector('.remove-btn').onclick = () => { div.remove(); generateCV(); };
        container.appendChild(div);
        div.querySelectorAll('input, textarea').forEach(el => el.addEventListener('input', generateCV));
    };
    
    // --- PDF EXPORT ---
    const downloadPdf = () => {
        const { jsPDF } = window.jspdf;
        const cvElement = document.getElementById('cvPreview');
        const fullName = document.getElementById('fullName').value || 'cv';
        
        showNotification('Generating ATS-Friendly PDF...', 'info');
        cvElement.classList.add('export-mode');

        html2canvas(cvElement, { scale: 2, useCORS: true, logging: false }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const imgHeight = canvas.height * pdfWidth / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;
            
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pageHeight;
            
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            pdf.save(`${fullName.replace(/\s/g, '_')}_CV.pdf`);
        }).catch(err => {
            showNotification('Error generating PDF.', 'error');
            console.error(err);
        }).finally(() => {
            cvElement.classList.remove('export-mode');
        });
    };

    // --- NOTIFICATIONS ---
    const showNotification = (message, type) => {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    };

    // --- EVENT LISTENERS ---
    document.querySelectorAll('.editor-panel input, .editor-panel textarea').forEach(el => el.addEventListener('input', generateCV));
    
    photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            photoInput.dataset.photoData = event.target.result;
            removePhotoBtn.style.display = 'inline-block';
            generateCV();
        };
        reader.readAsDataURL(file);
    });

    removePhotoBtn.addEventListener('click', () => {
        photoInput.value = '';
        delete photoInput.dataset.photoData;
        removePhotoBtn.style.display = 'none';
        generateCV();
    });

    document.getElementById('addWorkExperienceBtn').addEventListener('click', () => addSection('workExperience'));
    document.getElementById('addEducationBtn').addEventListener('click', () => addSection('education'));
    document.getElementById('addCertificationBtn').addEventListener('click', () => addSection('certifications'));
    document.getElementById('downloadPdfBtn').addEventListener('click', downloadPdf);
    document.getElementById('printCvBtn').addEventListener('click', () => window.print());
    
    // (Save/Load functionality would be added here)

    // Initial call
    generateCV();
});
