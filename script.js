// Initialize Telegram WebApp SDK
const tg = window.Telegram.WebApp;

// Expand to full height
tg.expand();

// Optionally set the MainButton from SDK instead of custom HTML button
// tg.MainButton.text = "ትዕዛዝ ላክ (Send Order)";
// tg.MainButton.show();
// Telegram.WebApp.onEvent('mainButtonClicked', sendOrder);

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
    const typeSelect = document.getElementById('design_type');
    const type = typeSelect.value;
    const typeText = typeSelect.options[typeSelect.selectedIndex].text;
    const instructions = document.getElementById('instructions').value;
    
    // Validate required fields (optional, but good practice)
    if (instructions.trim() === '' && type === 'other') {
        tg.showAlert("እባክዎትን መመሪያዎችን ያስገቡ!");
        return;
    }
    
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
    
    // Provide haptic feedback
    if (tg.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('success');
    }
    
    // Send data back to the bot
    tg.sendData(JSON.stringify(data));
}
