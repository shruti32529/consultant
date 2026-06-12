async function addConsultation() {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    const formData = new FormData();
    const recording = document.getElementById("recording").files[0];
    const clientName = document.getElementById("clientName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const consultationDate = document.getElementById("date").value;

    if (!clientName || !phone || !consultationDate) {
        alert("Client name, phone, and date are required");
        return;
    }

    formData.append("clientName", clientName);
    formData.append("phone", phone);
    formData.append("patientEmail", document.getElementById("patientEmail").value.trim());
    formData.append("age", document.getElementById("age").value);
    formData.append("gender", document.getElementById("gender").value);
    formData.append("address", document.getElementById("address").value.trim());
    formData.append("consultationDate", consultationDate);
    formData.append("notes", document.getElementById("notes").value.trim());
    formData.append("status", document.getElementById("status").value);
    formData.append("priority", document.getElementById("priority").value);
    formData.append("followUpDate", document.getElementById("followUpDate").value);
    formData.append("diagnosis", document.getElementById("diagnosis").value.trim());
    formData.append("prescription", document.getElementById("prescription").value.trim());
    formData.append("fee", document.getElementById("fee").value || "0");
    formData.append("paymentStatus", document.getElementById("paymentStatus").value);

    if (recording) {
        formData.append("recording", recording);
    }

    try {
        const response = await fetch("/api/consultation/add", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message || "Consultation saved");
            window.location.href = "dashboard.html";
        } else {
            alert(data.message || data.error || "Failed to add consultation");
        }
    } catch (error) {
        alert("Server error. Please try again.");
    }
}

// Template functionality
function fillTemplateData() {
    const selectedTemplate = sessionStorage.getItem('selectedTemplate');
    if (selectedTemplate) {
        const template = JSON.parse(selectedTemplate);
        document.getElementById('notes').value = template.notes || '';
        document.getElementById('prescription').value = template.notes || '';
        if (template.duration) {
            // Can use duration for timing purposes
        }
        sessionStorage.removeItem('selectedTemplate');
        alert('Template loaded successfully!');
    } else {
        alert('Please select a template from the Templates page');
    }
}
