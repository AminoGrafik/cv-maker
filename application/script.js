document.addEventListener('DOMContentLoaded', function() {
    
    // Function to add a new Work Experience card
    function addWorkExperience() {
        const container = document.getElementById('workExperience');
        const card = document.createElement('div');
        card.className = 'form-card is-open'; // Start open by default

        // Create the card's HTML content
        card.innerHTML = `
            <div class="form-card-header">
                <span class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                </span>
                <div class="title-container">
                    <div class="title">Untitled</div>
                    <div class="date-range">Start - End</div>
                </div>
                <span class="chevron">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </span>
            </div>
            <div class="form-card-body">
                <div class="form-card-grid-2">
                    <div class="form-group">
                        <label for="jobTitle">Job Title</label>
                        <input type="text" class="job-title-input" placeholder="e.g., Service Designer">
                    </div>
                    <div class="form-group">
                        <label for="company">Company/Employer</label>
                        <input type="text" placeholder="e.g., Acme Inc.">
                    </div>
                </div>
                 <div class="form-card-grid-2">
                    <div class="form-group">
                        <label for="startDate">Start Date</label>
                        <input type="text" class="start-date-input" placeholder="e.g., Jan 2020">
                    </div>
                    <div class="form-group">
                        <label for="endDate">End Date</label>
                        <input type="text" class="end-date-input" placeholder="e.g., Present">
                    </div>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <input type="hidden">
                    <trix-editor></trix-editor>
                </div>
            </div>
        `;

        container.appendChild(card);

        // --- Add Event Listeners for the new card ---
        const header = card.querySelector('.form-card-header');
        const titleInput = card.querySelector('.job-title-input');
        const startDateInput = card.querySelector('.start-date-input');
        const endDateInput = card.querySelector('.end-date-input');
        
        // Expand/Collapse functionality
        header.addEventListener('click', () => {
            card.classList.toggle('is-open');
            card.classList.toggle('is-closed');
        });

        // Update card header title as user types
        titleInput.addEventListener('input', () => {
            const titleElement = card.querySelector('.form-card-header .title');
            titleElement.textContent = titleInput.value || 'Untitled';
        });

        // Update card header date range as user types
        function updateDateRange() {
            const dateElement = card.querySelector('.form-card-header .date-range');
            const start = startDateInput.value || 'Start';
            const end = endDateInput.value || 'End';
            dateElement.textContent = `${start} - ${end}`;
        }
        startDateInput.addEventListener('input', updateDateRange);
        endDateInput.addEventListener('input', updateDateRange);
    }

    // --- Main Event Listeners ---
    document.getElementById('addWorkExperienceBtn').addEventListener('click', addWorkExperience);

    // Add one experience card by default to start
    addWorkExperience();
});
