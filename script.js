// Initialize Telegram WebApp SDK
const tg = window.Telegram.WebApp;

// Expand to full height
tg.expand();

function handleTypeChange() {
    const type = document.getElementById('design_type').value;
    
    // Hide all conditional fields first
    document.getElementById('company_name_group').style.display = 'none';
    document.getElementById('contact_details_group').style.display = 'none';
    document.getElementById('color_preference_group').style.display = 'none';
    
    // Show relevant fields based on type
    if (type === 'logo') {
        document.getElementById('company_name_group').style.display = 'block';
        document.getElementById('color_preference_group').style.display = 'block';
    } else if (type === 'business_card') {
        document.getElementById('company_name_group').style.display = 'block';
        document.getElementById('contact_details_group').style.display = 'block';
        document.getElementById('color_preference_group').style.display = 'block';
    } else if (type === 'banner' || type === 'social_post' || type === 'youtube_thumbnail') {
        document.getElementById('color_preference_group').style.display = 'block';
    }
}

// Initial setup
handleTypeChange();

function sendOrder() {
    const btn = document.getElementById('mainBtn');
    btn.textContent = "እየተላከ ነው...";
    btn.disabled = true;

    const typeSelect = document.getElementById('design_type');
    const type = typeSelect.value;
    const typeText = typeSelect.options[typeSelect.selectedIndex].text;
    const instructions = document.getElementById('instructions').value;
    
    const data = {
        type: type,
        type_name: typeText,
        instructions: instructions
    };
    
    if (type === 'logo') {
        data.company_name = document.getElementById('company_name').value;
        data.colors = document.getElementById('color_preference').value;
    } else if (type === 'business_card') {
        data.company_name = document.getElementById('company_name').value;
        data.contact = document.getElementById('contact_details').value;
        data.colors = document.getElementById('color_preference').value;
    } else {
        data.colors = document.getElementById('color_preference').value;
    }

    submitData(data);
}

function submitData(data) {
    try {
        const payload = JSON.stringify(data);
        
        // Provide haptic feedback
        if (tg.HapticFeedback) {
            tg.HapticFeedback.notificationOccurred('success');
        }
        // Send data back to the bot
        tg.sendData(payload);
    } catch (e) {
        alert("ስህተት ተከስቷል። እባክዎ እንደገና ይሞክሩ።");
        const btn = document.getElementById('mainBtn');
        btn.textContent = "ትዕዛዝ ላክ";
        btn.disabled = false;
    }
}
