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

function nextStep() {
    document.getElementById('step-1').classList.remove('active');
    document.getElementById('step-2').classList.add('active');
    
    // Scroll to top
    window.scrollTo(0, 0);
}

function prevStep() {
    document.getElementById('step-2').classList.remove('active');
    document.getElementById('step-1').classList.add('active');
    
    // Scroll to top
    window.scrollTo(0, 0);
}

function sendOrder() {
    try {
        const btn = document.getElementById('mainBtn');
        btn.textContent = "እየተላከ ነው...";
        btn.disabled = true;

        const typeSelect = document.getElementById('design_type');
        const type = typeSelect.value;
        const typeText = typeSelect.options[typeSelect.selectedIndex].text;
        
        // Safely extract all inputs regardless of conditional display
        const instructions = document.getElementById('instructions') ? document.getElementById('instructions').value : '';
        const company_name = document.getElementById('company_name') ? document.getElementById('company_name').value : '';
        const contact = document.getElementById('contact_details') ? document.getElementById('contact_details').value : '';
        const colors = document.getElementById('color_preference') ? document.getElementById('color_preference').value : '';
        const payment_ref = document.getElementById('payment_ref') ? document.getElementById('payment_ref').value : '';
        
        const data = {
            type: type,
            type_name: typeText,
            instructions: instructions,
            company_name: company_name,
            contact: contact,
            colors: colors,
            payment_ref: payment_ref
        };
        
        const payload = JSON.stringify(data);
        
        // Provide haptic feedback if available
        if (tg.HapticFeedback) {
            tg.HapticFeedback.notificationOccurred('success');
        }
        
        // Execute Telegram WebApp sendData
        tg.sendData(payload);
        
    } catch (e) {
        console.error("Error sending data:", e);
        alert("ስህተት ተከስቷል። እባክዎ አፕሊኬሽኑን ከ Keyboard Button በመክፈት ይሞክሩ።");
        const btn = document.getElementById('mainBtn');
        btn.textContent = "ትዕዛዝ ላክ";
        btn.disabled = false;
    }
}
