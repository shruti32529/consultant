// Templates functionality
let templates = JSON.parse(localStorage.getItem('consultationTemplates')) || [];

document.addEventListener('DOMContentLoaded', () => {
    loadTemplates();
});

function loadTemplates() {
    const grid = document.getElementById('templatesGrid');
    
    if (templates.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #64748b;">No templates created yet. Click the button above to create one!</p>';
        return;
    }
    
    grid.innerHTML = templates.map(template => `
        <div class="template-card">
            <div class="template-header">
                <h3>${template.name}</h3>
                <span class="template-icon">${getCategoryIcon(template.category)}</span>
            </div>
            <p class="template-description">${template.description || 'No description provided'}</p>
            <div class="category-badges">
                <span class="category-badge">${template.category}</span>
                ${template.duration ? `<span class="category-badge">⏱️ ${template.duration} min</span>` : ''}
            </div>
            <div class="template-actions" style="margin-top: 16px;">
                <button class="template-btn use" onclick="useTemplate(${template.id})">Use Template</button>
                <button class="template-btn edit" onclick="editTemplate(${template.id})">Edit</button>
                <button class="template-btn delete" onclick="deleteTemplate(${template.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function getCategoryIcon(category) {
    const icons = {
        'General': '🏥',
        'Dental': '🦷',
        'Vision': '👁️',
        'Followup': '📋',
        'Emergency': '🚨',
        'Other': '📝'
    };
    return icons[category] || '📋';
}

function openTemplateModal() {
    document.getElementById('templateModal').classList.add('active');
    document.getElementById('templateName').value = '';
    document.getElementById('templateDescription').value = '';
    document.getElementById('templateNotes').value = '';
    document.getElementById('templateCategory').value = 'General';
    document.getElementById('templateDuration').value = '30';
}

function closeTemplateModal() {
    document.getElementById('templateModal').classList.remove('active');
}

function saveTemplate() {
    const name = document.getElementById('templateName').value.trim();
    const description = document.getElementById('templateDescription').value.trim();
    const notes = document.getElementById('templateNotes').value.trim();
    const category = document.getElementById('templateCategory').value;
    const duration = document.getElementById('templateDuration').value;
    
    if (!name) {
        alert('Template name is required');
        return;
    }
    
    const template = {
        id: Date.now(),
        name,
        description,
        notes,
        category,
        duration: parseInt(duration) || null,
        createdAt: new Date().toISOString()
    };
    
    templates.push(template);
    localStorage.setItem('consultationTemplates', JSON.stringify(templates));
    
    closeTemplateModal();
    loadTemplates();
    alert('Template created successfully!');
}

function useTemplate(templateId) {
    const template = templates.find(t => t.id === templateId);
    if (template) {
        // Store template data in session storage for use in add-consultation page
        sessionStorage.setItem('selectedTemplate', JSON.stringify(template));
        window.location.href = 'add-consultation.html';
    }
}

function editTemplate(templateId) {
    const template = templates.find(t => t.id === templateId);
    if (template) {
        document.getElementById('templateName').value = template.name;
        document.getElementById('templateDescription').value = template.description || '';
        document.getElementById('templateNotes').value = template.notes || '';
        document.getElementById('templateCategory').value = template.category;
        document.getElementById('templateDuration').value = template.duration || '30';
        
        document.getElementById('templateModal').classList.add('active');
        
        // Change save button to update button
        const form = document.querySelector('.template-modal form');
        form.onsubmit = (e) => {
            e.preventDefault();
            updateTemplate(templateId);
        };
    }
}

function updateTemplate(templateId) {
    const name = document.getElementById('templateName').value.trim();
    const description = document.getElementById('templateDescription').value.trim();
    const notes = document.getElementById('templateNotes').value.trim();
    const category = document.getElementById('templateCategory').value;
    const duration = document.getElementById('templateDuration').value;
    
    if (!name) {
        alert('Template name is required');
        return;
    }
    
    const templateIndex = templates.findIndex(t => t.id === templateId);
    if (templateIndex > -1) {
        templates[templateIndex] = {
            ...templates[templateIndex],
            name,
            description,
            notes,
            category,
            duration: parseInt(duration) || null,
            updatedAt: new Date().toISOString()
        };
        
        localStorage.setItem('consultationTemplates', JSON.stringify(templates));
        closeTemplateModal();
        loadTemplates();
        alert('Template updated successfully!');
        
        // Reset form submit handler
        const form = document.querySelector('.template-modal form');
        form.onsubmit = (e) => {
            e.preventDefault();
            saveTemplate();
        };
    }
}

function deleteTemplate(templateId) {
    if (confirm('Are you sure you want to delete this template?')) {
        templates = templates.filter(t => t.id !== templateId);
        localStorage.setItem('consultationTemplates', JSON.stringify(templates));
        loadTemplates();
        alert('Template deleted successfully!');
    }
}

// Expose functions globally
window.openTemplateModal = openTemplateModal;
window.closeTemplateModal = closeTemplateModal;
window.saveTemplate = saveTemplate;
window.useTemplate = useTemplate;
window.editTemplate = editTemplate;
window.deleteTemplate = deleteTemplate;