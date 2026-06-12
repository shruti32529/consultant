// Analytics functionality
let consultations = [];

document.addEventListener('DOMContentLoaded', () => {
    loadConsultations();
    initCharts();
});

async function loadConsultations() {
    try {
        const response = await fetch('/api/consultations/all', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();
        consultations = data || [];
        updateAnalytics();
    } catch (error) {
        console.error('Error loading consultations:', error);
    }
}

function updateAnalytics() {
    // Calculate statistics
    const total = consultations.length;
    const completed = consultations.filter(c => c.status === 'Completed').length;
    const paid = consultations.filter(c => c.paymentStatus === 'Paid').length;
    
    // Update completion rate
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    document.getElementById('completionRate').textContent = completionRate + '%';
    
    // Update collection rate
    const collectionRate = total > 0 ? Math.round((paid / total) * 100) : 0;
    document.getElementById('collectionRate').textContent = collectionRate + '%';
    
    // Update average time (placeholder)
    document.getElementById('avgTime').textContent = '30 min';
    
    // Update charts
    updateCharts();
}

function initCharts() {
    createStatusChart();
    createPriorityChart();
    createPaymentChart();
}

function createStatusChart() {
    const statusCounts = {
        'New': consultations.filter(c => c.status === 'New').length,
        'In Progress': consultations.filter(c => c.status === 'In Progress').length,
        'Completed': consultations.filter(c => c.status === 'Completed').length
    };
    
    const ctx = document.getElementById('statusChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(statusCounts),
            datasets: [{
                data: Object.values(statusCounts),
                backgroundColor: ['#667eea', '#fbbf24', '#10b981'],
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function createPriorityChart() {
    const priorityCounts = {
        'Normal': consultations.filter(c => c.priority === 'Normal').length,
        'High': consultations.filter(c => c.priority === 'High').length,
        'Urgent': consultations.filter(c => c.priority === 'Urgent').length
    };
    
    const ctx = document.getElementById('priorityChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(priorityCounts),
            datasets: [{
                label: 'Count',
                data: Object.values(priorityCounts),
                backgroundColor: ['#10b981', '#fbbf24', '#ef4444']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function createPaymentChart() {
    const paymentCounts = {
        'Unpaid': consultations.filter(c => c.paymentStatus === 'Unpaid').length,
        'Partial': consultations.filter(c => c.paymentStatus === 'Partial').length,
        'Paid': consultations.filter(c => c.paymentStatus === 'Paid').length
    };
    
    const ctx = document.getElementById('paymentChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(paymentCounts),
            datasets: [{
                data: Object.values(paymentCounts),
                backgroundColor: ['#fee2e2', '#fef3c7', '#d1fae5']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function updateCharts() {
    // Recreate charts with updated data
    document.getElementById('statusChart').parentElement.innerHTML = '<canvas id="statusChart"></canvas>';
    document.getElementById('priorityChart').parentElement.innerHTML = '<canvas id="priorityChart"></canvas>';
    document.getElementById('paymentChart').parentElement.innerHTML = '<canvas id="paymentChart"></canvas>';
    initCharts();
}

function exportToCSV() {
    if (consultations.length === 0) {
        alert('No consultations to export');
        return;
    }
    
    let csv = 'Client Name,Phone,Email,Consultation Date,Status,Priority,Payment Status\n';
    
    consultations.forEach(c => {
        csv += `"${c.clientName}","${c.phone}","${c.patientEmail || ''}","${c.consultationDate}","${c.status}","${c.priority}","${c.paymentStatus || 'Unknown'}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `consultations_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
}

function exportToPDF() {
    alert('PDF export coming soon! For now, use Print option.');
}

function printReport() {
    window.print();
}