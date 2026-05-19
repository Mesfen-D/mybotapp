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

function updateFileName() {
    const input = document.getElementById('design-photo');
    const display = document.getElementById('file-name-display');
    if (input.files && input.files[0]) {
        display.textContent = "✅ " + input.files[0].name;
    } else {
        display.textContent = "📸 ፎቶ ይምረጡ / Select Photo";
    }
}

// Resizes image heavily to fit within Telegram WebApp sendData limit (4096 bytes)
function resizeImage(file, maxSize, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            let width = img.width;
            let height = img.height;
            
            if (width > height) {
                if (width > maxSize) {
                    height *= maxSize / width;
                    width = maxSize;
                }
            } else {
                if (height > maxSize) {
                    width *= maxSize / height;
                    height = maxSize;
                }
            }
            
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            // Compress very aggressively to try and fit in the 4096 byte data limit
            const dataUrl = canvas.toDataURL('image/jpeg', 0.2);
            callback(dataUrl);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

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

    const photoInput = document.getElementById('design-photo');
    
    // If a photo is selected, read it as base64
    if (photoInput.files && photoInput.files[0]) {
        // We heavily resize to try to not break Telegram WebApp Data Limit limit
        resizeImage(photoInput.files[0], 120, function(base64Image) {
            data.photo = base64Image;
            submitData(data);
        });
    } else {
        submitData(data);
    }
}

function submitData(data) {
    try {
        const payload = JSON.stringify(data);
        
        // Telegram limits data payload to exactly 4096 bytes.
        if (new Blob([payload]).size > 4000) {
             alert("የመረጡት ፎቶ መጠን አሁንም ትልቅ ነው። እባክዎ ፎቶውን ሳያካትቱ ይሞክሩ እና በኋላ በቦቱ ላይ ይላኩ።");
             const btn = document.getElementById('mainBtn');
             btn.textContent = "ትዕዛዝ ላክ";
             btn.disabled = false;
             return;
        }

        // Provide haptic feedback
        if (tg.HapticFeedback) {
            tg.HapticFeedback.notificationOccurred('success');
        }
        // Send data back to the bot
        tg.sendData(payload);
    } catch (e) {
        alert("ስህተት ተከስቷል።");
        const btn = document.getElementById('mainBtn');
        btn.textContent = "ትዕዛዝ ላክ";
        btn.disabled = false;
    }
}
