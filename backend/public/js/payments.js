// Payments functionality
let consultations = [];
let payments = JSON.parse(localStorage.getItem('payments')) || [];

document.addEventListener('DOMContentLoaded', () => {
    loadConsultations();
    loadPayments();
    loadPaymentStats();
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
        populateConsultationSelect();
    } catch (error) {
        console.error('Error loading consultations:', error);
    }
}

function populateConsultationSelect() {
    const select = document.getElementById('consultationSelect');
    select.innerHTML = '<option value="">Select a consultation</option>';
    
    consultations.forEach(c => {
        const option = document.createElement('option');
        option.value = c.id;
        option.textContent = `${c.clientName} - ₹${c.amount || 0} (${c.consultationDate})`;
        select.appendChild(option);
    });
}

function loadPayments() {
    const tableBody = document.getElementById('paymentTableBody');
    
    if (payments.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #64748b;">No payments recorded yet</td></tr>';
        return;
    }
    
    tableBody.innerHTML = payments.map(payment => {
        const consultation = consultations.find(c => c.id === payment.consultationId);
        const statusClass = payment.status === 'Paid' ? 'status-paid' : 
                           payment.status === 'Partial' ? 'status-partial' : 'status-unpaid';
        
        return `
            <tr>
                <td><strong>${consultation?.clientName || 'Unknown'}</strong></td>
                <td>₹${payment.amount.toFixed(2)}</td>
                <td><span class="payment-status ${statusClass}">${payment.status}</span></td>
                <td>${new Date(payment.date).toLocaleDateString()}</td>
                <td>
                    <div class="payment-actions">
                        <button class="action-btn" onclick="editPayment(${payment.id})">Edit</button>
                        <button class="action-btn" onclick="deletePayment(${payment.id})" style="color: #ef4444;">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function loadPaymentStats() {
    const totalConsultations = consultations.reduce((sum, c) => sum + (c.amount || 0), 0);
    const totalPaid = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
    const totalPartial = payments.filter(p => p.status === 'Partial').reduce((sum, p) => sum + p.amount, 0);
    const totalPending = totalConsultations - totalPaid - totalPartial;
    
    document.getElementById('totalRevenue').textContent = '₹' + totalConsultations.toFixed(2);
    document.getElementById('paidAmount').textContent = '₹' + totalPaid.toFixed(2);
    document.getElementById('pendingAmount').textContent = '₹' + totalPartial.toFixed(2);
    document.getElementById('outstandingAmount').textContent = '₹' + Math.max(0, totalPending).toFixed(2);
}

function openPaymentModal() {
    document.getElementById('paymentModal').classList.add('active');
    document.getElementById('paymentDate').valueAsDate = new Date();
}

function closePaymentModal() {
    document.getElementById('paymentModal').classList.remove('active');
    document.getElementById('paymentDate').value = '';
}

async function recordPayment() {
    const consultationId = document.getElementById('consultationSelect').value;
    const amount = parseFloat(document.getElementById('amountReceived').value);
    const method = document.getElementById('paymentMethod').value;
    const date = document.getElementById('paymentDate').value;
    const notes = document.getElementById('paymentNotes').value;
    
    if (!consultationId || !amount || !date) {
        alert('Please fill all required fields');
        return;
    }
    
    const payment = {
        id: Date.now(),
        consultationId: parseInt(consultationId),
        amount,
        method,
        date,
        notes,
        status: 'Paid',
        recordedAt: new Date().toISOString()
    };
    
    payments.push(payment);
    localStorage.setItem('payments', JSON.stringify(payments));
    
    closePaymentModal();
    loadPayments();
    loadPaymentStats();
    
    alert('Payment recorded successfully!');
}

function editPayment(paymentId) {
    alert('Edit payment feature coming soon!');
}

function deletePayment(paymentId) {
    if (confirm('Are you sure you want to delete this payment?')) {
        payments = payments.filter(p => p.id !== paymentId);
        localStorage.setItem('payments', JSON.stringify(payments));
        loadPayments();
        loadPaymentStats();
    }
}

// Add button listener for opening modal
document.addEventListener('DOMContentLoaded', () => {
    const addPaymentBtn = document.querySelector('[onclick*="openPaymentModal"]');
    if (addPaymentBtn) {
        addPaymentBtn.addEventListener('click', openPaymentModal);
    }
});

// Expose functions globally
window.openPaymentModal = openPaymentModal;
window.closePaymentModal = closePaymentModal;
window.recordPayment = recordPayment;
window.editPayment = editPayment;
window.deletePayment = deletePayment;