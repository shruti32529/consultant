const token = localStorage.getItem("token");
let consultations = [];

if (!token) {
    window.location.href = "login.html";
}

async function loadConsultations() {
    try {
        const response = await fetch("/api/consultation/all", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            logout();
            return;
        }

        consultations = await response.json();
        renderConsultations();
    } catch (error) {
        alert("Unable to load consultations");
    }
}

function renderConsultations() {
    const search = document.getElementById("search").value.toLowerCase();
    const sortBy = document.getElementById("sortBy").value;
    const statusFilter = document.getElementById("statusFilter").value;
    const priorityFilter = document.getElementById("priorityFilter").value;
    const paymentFilter = document.getElementById("paymentFilter").value;
    const fromDate = document.getElementById("fromDate").value;
    const toDate = document.getElementById("toDate").value;
    const table = document.getElementById("consultationTable");
    const emptyState = document.getElementById("emptyState");

    const filtered = consultations
        .filter((item) => {
            const text = [
                item.clientName,
                item.phone,
                item.patientEmail,
                item.address,
                item.notes,
                item.diagnosis,
                item.prescription,
                item.status,
                item.priority,
                item.paymentStatus
            ].join(" ").toLowerCase();
            const matchesSearch = text.includes(search);
            const matchesStatus = !statusFilter || item.status === statusFilter;
            const matchesPriority = !priorityFilter || item.priority === priorityFilter;
            const matchesPayment = !paymentFilter || item.paymentStatus === paymentFilter;
            const matchesFrom = !fromDate || item.consultationDate >= fromDate;
            const matchesTo = !toDate || item.consultationDate <= toDate;

            return matchesSearch && matchesStatus && matchesPriority && matchesPayment && matchesFrom && matchesTo;
        })
        .sort((a, b) => {
            if (sortBy === "oldest") {
                return new Date(a.createdAt) - new Date(b.createdAt);
            }

            if (sortBy === "name") {
                return a.clientName.localeCompare(b.clientName);
            }

            if (sortBy === "followUp") {
                return dateValue(a.followUpDate) - dateValue(b.followUpDate);
            }

            return new Date(b.createdAt) - new Date(a.createdAt);
        });

    updateStats(filtered);
    table.innerHTML = "";
    emptyState.style.display = filtered.length ? "none" : "block";

    filtered.forEach((item) => {
        table.innerHTML += `
            <tr>
                <td>
                    <strong>${escapeHtml(item.clientName)}</strong>
                    <div style="font-size: 12px; color: #64748b; margin-top: 4px;">${patientMeta(item)}</div>
                </td>
                <td>${escapeHtml(item.phone)}</td>
                <td>${formatDate(item.consultationDate)}</td>
                <td>${renderBadge(item.status || "New", "status")}</td>
                <td>${renderBadge(item.priority || "Normal", "priority")}</td>
                <td>${item.followUpDate ? formatDate(item.followUpDate) : "Not Set"}</td>
                <td>
                    ${renderBadge(item.paymentStatus || "Unpaid", "payment")}
                    <div style="font-size: 12px; color: #64748b; margin-top: 4px;">${formatMoney(item.fee || 0)}</div>
                </td>
                <td>${renderFileLink(item.recording)}</td>
                <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px;">
                    ${clinicalSummary(item).replace(/<br>/g, " | ")}
                </td>
                <td>
                    <div class="row-actions">
                        <button class="action-btn" onclick="openEditModal(${item.id})">Edit</button>
                        <button class="action-btn" onclick="printConsultation(${item.id})">Print</button>
                        ${item.status !== "Completed" ? `<button class="action-btn" onclick="quickUpdate(${item.id}, { status: 'Completed' })">Done</button>` : ""}
                        ${item.paymentStatus !== "Paid" ? `<button class="action-btn" onclick="quickUpdate(${item.id}, { paymentStatus: 'Paid' })">Mark Paid</button>` : ""}
                        <button class="action-btn danger" onclick="deleteConsultation(${item.id})">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    });
}

function updateStats(items) {
    const today = new Date().toISOString().slice(0, 10);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    document.getElementById("totalCount").textContent = consultations.length;
    document.getElementById("todayCount").textContent = consultations
        .filter((item) => item.consultationDate === today)
        .length;
    document.getElementById("weekCount").textContent = consultations
        .filter((item) => new Date(item.consultationDate) >= weekAgo)
        .length;
    document.getElementById("followUpCount").textContent = consultations
        .filter((item) => item.followUpDate && item.followUpDate >= today && item.status !== "Completed")
        .length;
    document.getElementById("unpaidCount").textContent = consultations
        .filter((item) => item.paymentStatus !== "Paid")
        .length;
}

function openEditModal(id) {
    const item = consultations.find((consultation) => consultation.id === id);

    if (!item) {
        return;
    }

    document.getElementById("editId").value = item.id;
    document.getElementById("editClientName").value = item.clientName;
    document.getElementById("editPhone").value = item.phone;
    document.getElementById("editPatientEmail").value = item.patientEmail || "";
    document.getElementById("editAge").value = item.age || "";
    document.getElementById("editGender").value = item.gender || "Not Specified";
    document.getElementById("editAddress").value = item.address || "";
    document.getElementById("editDate").value = item.consultationDate;
    document.getElementById("editStatus").value = item.status || "New";
    document.getElementById("editPriority").value = item.priority || "Normal";
    document.getElementById("editFollowUpDate").value = item.followUpDate || "";
    document.getElementById("editNotes").value = item.notes || "";
    document.getElementById("editDiagnosis").value = item.diagnosis || "";
    document.getElementById("editPrescription").value = item.prescription || "";
    document.getElementById("editFee").value = item.fee || 0;
    document.getElementById("editPaymentStatus").value = item.paymentStatus || "Unpaid";
    document.getElementById("editModal").classList.add("active");
}

function closeEditModal() {
    document.getElementById("editModal").classList.remove("active");
}

async function saveEdit() {
    const id = document.getElementById("editId").value;
    const payload = {
        clientName: document.getElementById("editClientName").value.trim(),
        phone: document.getElementById("editPhone").value.trim(),
        patientEmail: document.getElementById("editPatientEmail").value.trim(),
        age: document.getElementById("editAge").value || null,
        gender: document.getElementById("editGender").value,
        address: document.getElementById("editAddress").value.trim(),
        consultationDate: document.getElementById("editDate").value,
        status: document.getElementById("editStatus").value,
        priority: document.getElementById("editPriority").value,
        followUpDate: document.getElementById("editFollowUpDate").value || null,
        notes: document.getElementById("editNotes").value.trim(),
        diagnosis: document.getElementById("editDiagnosis").value.trim(),
        prescription: document.getElementById("editPrescription").value.trim(),
        fee: document.getElementById("editFee").value || 0,
        paymentStatus: document.getElementById("editPaymentStatus").value
    };

    if (!payload.clientName || !payload.phone || !payload.consultationDate) {
        alert("Client name, phone, and date are required");
        return;
    }

    const response = await fetch(`/api/consultation/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
        alert(data.message || data.error || "Unable to update consultation");
        return;
    }

    closeEditModal();
    await loadConsultations();
}

async function deleteConsultation(id) {
    const confirmDelete = confirm("Delete consultation?");

    if (!confirmDelete) {
        return;
    }

    const response = await fetch(`/api/consultation/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const data = await response.json();
        alert(data.message || data.error || "Unable to delete consultation");
        return;
    }

    await loadConsultations();
}

async function quickUpdate(id, updates) {
    const response = await fetch(`/api/consultation/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
    });

    if (!response.ok) {
        const data = await response.json();
        alert(data.message || data.error || "Unable to update consultation");
        return;
    }

    await loadConsultations();
}

function clearFilters() {
    document.getElementById("search").value = "";
    document.getElementById("sortBy").value = "latest";
    document.getElementById("statusFilter").value = "";
    document.getElementById("priorityFilter").value = "";
    document.getElementById("paymentFilter").value = "";
    document.getElementById("fromDate").value = "";
    document.getElementById("toDate").value = "";
    renderConsultations();
}

function renderFileLink(fileName) {
    if (!fileName) {
        return "No File";
    }

    return `<a href="/uploads/${encodeURIComponent(fileName)}" target="_blank">View File</a>`;
}

function renderBadge(value, type) {
    if (type === "status") {
        const statusClass = `status-${value.toLowerCase().replace(/\s+/g, "-")}`;
        return `<span class="status-badge ${statusClass}">${escapeHtml(value)}</span>`;
    } else if (type === "priority") {
        const priorityClass = `priority-${value.toLowerCase().replace(/\s+/g, "-")}`;
        return `<span class="priority-badge ${priorityClass}">${escapeHtml(value)}</span>`;
    } else if (type === "payment") {
        const paymentClass = `payment-${value.toLowerCase().replace(/\s+/g, "-")}`;
        return `<span class="payment-badge ${paymentClass}">${escapeHtml(value)}</span>`;
    }
    return escapeHtml(value);
}

function patientMeta(item) {
    const parts = [];

    if (item.age) {
        parts.push(`${item.age} yrs`);
    }

    if (item.gender && item.gender !== "Not Specified") {
        parts.push(item.gender);
    }

    if (item.patientEmail) {
        parts.push(item.patientEmail);
    }

    return escapeHtml(parts.join(" | "));
}

function clinicalSummary(item) {
    const diagnosis = item.diagnosis ? `<strong>Dx:</strong> ${escapeHtml(item.diagnosis)}` : "";
    const prescription = item.prescription ? `<strong>Rx:</strong> ${escapeHtml(item.prescription)}` : "";
    const notes = item.notes ? `<strong>Notes:</strong> ${escapeHtml(item.notes)}` : "";

    return [diagnosis, prescription, notes].filter(Boolean).join("<br>") || "No notes";
}

function printConsultation(id) {
    const item = consultations.find((consultation) => consultation.id === id);

    if (!item) {
        return;
    }

    const report = window.open("", "_blank");
    report.document.write(`
        <html>
        <head>
            <title>Consultation Report</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 32px; color: #111827; }
                h1 { margin-bottom: 4px; }
                table { width: 100%; border-collapse: collapse; margin-top: 18px; }
                td { padding: 10px; border: 1px solid #d1d5db; vertical-align: top; }
                td:first-child { width: 180px; font-weight: 700; background: #f9fafb; }
            </style>
        </head>
        <body>
            <h1>Consultation Report</h1>
            <p>${formatDate(item.consultationDate)}</p>
            <table>
                ${reportRow("Client", item.clientName)}
                ${reportRow("Phone", item.phone)}
                ${reportRow("Email", item.patientEmail || "")}
                ${reportRow("Age / Gender", `${item.age || ""} ${item.gender || ""}`)}
                ${reportRow("Address", item.address || "")}
                ${reportRow("Status", item.status || "New")}
                ${reportRow("Priority", item.priority || "Normal")}
                ${reportRow("Follow-up", item.followUpDate || "")}
                ${reportRow("Diagnosis", item.diagnosis || "")}
                ${reportRow("Prescription", item.prescription || "")}
                ${reportRow("Notes", item.notes || "")}
                ${reportRow("Fee", formatMoney(item.fee || 0))}
                ${reportRow("Payment", item.paymentStatus || "Unpaid")}
            </table>
        </body>
        </html>
    `);
    report.document.close();
    report.print();
}

function reportRow(label, value) {
    return `<tr><td>${escapeHtml(label)}</td><td>${escapeHtml(value || "-")}</td></tr>`;
}

function exportCsv() {
    const header = [
        "Client",
        "Phone",
        "Email",
        "Age",
        "Gender",
        "Address",
        "Date",
        "Status",
        "Priority",
        "Follow Up",
        "Diagnosis",
        "Prescription",
        "Notes",
        "Fee",
        "Payment",
        "File"
    ];

    const rows = consultations.map((item) => [
        item.clientName,
        item.phone,
        item.patientEmail || "",
        item.age || "",
        item.gender || "",
        item.address || "",
        item.consultationDate,
        item.status || "New",
        item.priority || "Normal",
        item.followUpDate || "",
        item.diagnosis || "",
        item.prescription || "",
        item.notes || "",
        item.fee || 0,
        item.paymentStatus || "Unpaid",
        item.recording || ""
    ]);

    const csv = [header, ...rows]
        .map((row) => row.map(csvCell).join(","))
        .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "consultations.csv";
    link.click();
    URL.revokeObjectURL(url);
}

function csvCell(value) {
    return `"${String(value).replace(/"/g, '""')}"`;
}

function dateValue(date) {
    if (!date) {
        return Number.MAX_SAFE_INTEGER;
    }

    return new Date(date).getTime();
}

function formatMoney(value) {
    return `Rs. ${Number(value || 0).toFixed(2)}`;
}

function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

loadConsultations();
