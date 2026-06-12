// Settings functionality
document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
    loadSettings();
    setDefaultDate();
});

function loadUserProfile() {
    const userName = localStorage.getItem('userName') || 'User';
    const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
    const joinDate = localStorage.getItem('joinDate') || new Date().toLocaleDateString();
    
    document.getElementById('userName').textContent = userName;
    document.getElementById('userEmail').textContent = userEmail;
    document.getElementById('joinDate').textContent = joinDate;
    
    // Generate avatar with first letter
    const avatar = document.getElementById('userAvatar');
    avatar.textContent = userName.charAt(0).toUpperCase();
}

function loadSettings() {
    // Load theme
    const theme = localStorage.getItem('theme') || 'light';
    document.getElementById('themeSelect').value = theme;
    
    // Load date format
    const dateFormat = localStorage.getItem('dateFormat') || 'DD/MM/YYYY';
    document.getElementById('dateFormatSelect').value = dateFormat;
    
    // Load notification settings
    const followUpReminders = localStorage.getItem('followUpReminders') !== 'false';
    const dailySummary = localStorage.getItem('dailySummary') === 'true';
    const paymentReminders = localStorage.getItem('paymentReminders') !== 'false';
    const autoSaveNotes = localStorage.getItem('autoSaveNotes') !== 'false';
    const dataBackup = localStorage.getItem('dataBackup') === 'true';
    
    updateToggleSwitches([
        followUpReminders,
        dailySummary,
        paymentReminders,
        autoSaveNotes,
        dataBackup
    ]);
}

function updateToggleSwitches(values) {
    const toggles = document.querySelectorAll('.toggle-switch');
    toggles.forEach((toggle, index) => {
        if (values[index]) {
            toggle.classList.add('active');
        }
    });
}

function toggleSetting(element) {
    element.classList.toggle('active');
}

function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('paymentDate').value = today;
}

function saveSettings() {
    // Save theme
    const theme = document.getElementById('themeSelect').value;
    localStorage.setItem('theme', theme);
    
    // Save date format
    const dateFormat = document.getElementById('dateFormatSelect').value;
    localStorage.setItem('dateFormat', dateFormat);
    
    // Save notification settings
    const toggles = document.querySelectorAll('.toggle-switch');
    const settings = [
        { key: 'followUpReminders', index: 0 },
        { key: 'dailySummary', index: 1 },
        { key: 'paymentReminders', index: 2 },
        { key: 'autoSaveNotes', index: 3 },
        { key: 'dataBackup', index: 4 }
    ];
    
    settings.forEach(setting => {
        localStorage.setItem(setting.key, toggles[setting.index].classList.contains('active'));
    });
    
    // Show success message
    const alert = document.getElementById('successAlert');
    alert.style.display = 'block';
    
    setTimeout(() => {
        alert.style.display = 'none';
    }, 3000);
}

function exportMyData() {
    const userData = {
        profile: {
            name: localStorage.getItem('userName'),
            email: localStorage.getItem('userEmail'),
            joinDate: localStorage.getItem('joinDate')
        },
        settings: {
            theme: localStorage.getItem('theme'),
            dateFormat: localStorage.getItem('dateFormat'),
            followUpReminders: localStorage.getItem('followUpReminders'),
            dailySummary: localStorage.getItem('dailySummary'),
            paymentReminders: localStorage.getItem('paymentReminders')
        }
    };
    
    const dataStr = JSON.stringify(userData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my_data_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
}

function deleteAccount() {
    if (confirm('This action cannot be undone. All your data will be deleted. Continue?')) {
        localStorage.clear();
        window.location.href = 'login.html';
    }
}