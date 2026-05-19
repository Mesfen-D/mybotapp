// Initialize Telegram WebApp SDK
const tg = window.Telegram.WebApp;

// Tell Telegram app the Web App is ready
tg.ready();

// Expand to full height
tg.expand();

// Parse language from URL
const urlParams = new URLSearchParams(window.location.search);
const paramLang = urlParams.get('lang');
const currentLang = ['en', 'am', 'om'].includes(paramLang) ? paramLang : 'am';

const translations = {
    en: {
        step1Title: "What would you like to order?",
        designTypeLabel: "Design Type",
        options: {
            logo: "Logo",
            banner: "Banner",
            social_post: "Social Media Post",
            youtube_thumbnail: "YouTube Thumbnail",
            business_card: "Business Card",
            other: "Other"
        },
        companyNameLabel: "Company Name",
        companyNamePlaceholder: "Enter your company name",
        contactDetailsLabel: "Contact Information",
        contactDetailsPlaceholder: "Phone, email...",
        colorPreferenceLabel: "Preferred Colors",
        colorPreferencePlaceholder: "e.g., Black and Gold",
        instructionsLabel: "Additional Instructions",
        instructionsPlaceholder: "Write detailed information about the design here...",
        nextBtn: "Next",
        noticeText: "📝 Note: You can send your payment receipt (Screenshot), images for the design, or voice messages directly in the bot chat after submitting this form.",
        step2Title: "Payment Information",
        paymentRefLabel: "Payment Reference Number",
        paymentRefPlaceholder: "Enter the receipt reference number",
        submitBtn: "Submit Order",
        backBtn: "Back",
        sendingText: "Sending...",
        errorMsg: "An error occurred. Please try opening the app from the Keyboard Button."
    },
    am: {
        step1Title: "ምን ማዘዝ ይፈልጋሉ?",
        designTypeLabel: "የንድፍ ዓይነት",
        options: {
            logo: "ሎጎ (Logo)",
            banner: "ባነር (Banner)",
            social_post: "ለማህበራዊ ፖስት (Social Post)",
            youtube_thumbnail: "የዩቲዩብ ተምኔል (YouTube Thumbnail)",
            business_card: "ቢዝነስ ካርድ (Business Card)",
            other: "ሌላ (Other)"
        },
        companyNameLabel: "የድርጅት ስም / Company Name",
        companyNamePlaceholder: "ድርጅትዎን ያስገቡ",
        contactDetailsLabel: "የመገናኛ አድራሻ / Contact Info",
        contactDetailsPlaceholder: "ስልክ, ኢሜል...",
        colorPreferenceLabel: "የሚመርጡት ቀለማት / Preferred Colors",
        colorPreferencePlaceholder: "ለምሳሌ: ጥቁር እና ወርቃማ",
        instructionsLabel: "ተጨማሪ መመሪያዎች / Additional Instructions",
        instructionsPlaceholder: "ስለ ንድፉ ዝርዝር መረጃ እዚህ ይጻፉ...",
        nextBtn: "ቀጥል / Next",
        noticeText: "📝 ማስታወሻ፦ የከፈሉበትን ደረሰኝ (Screenshot)፣ ለዲዛይኑ የሚገቡ ምስሎችን ወይም የድምፅ መልእክት ይህን ገፅ ጨርሰው መረጃውን ከላኩ በኋላ ቦቱ ላይ ቀጥታ ማስገባት ይችላሉ።",
        step2Title: "የክፍያ መረጃ",
        paymentRefLabel: "የክፍያ ማጣቀሻ ቁጥር (Reference Number)",
        paymentRefPlaceholder: "የደረሰኝ ማጣቀሻ ቁጥር ያስገቡ",
        submitBtn: "ትዕዛዝ ላክ",
        backBtn: "ተመለስ / Back",
        sendingText: "እየተላከ ነው...",
        errorMsg: "ስህተት ተከስቷል። እባክዎ አፕሊኬሽኑን ከ Keyboard Button በመክፈት ይሞክሩ።"
    },
    om: {
        step1Title: "Ajaja Diizaayinii",
        designTypeLabel: "Gosa Diizaayinii",
        options: {
            logo: "Logo",
            banner: "Baaneerii",
            social_post: "Poostii Miidiyaa Hawaasaa",
            youtube_thumbnail: "Tambineelii YouTube",
            business_card: "Kaardii Daldalaa",
            other: "Kan biroo"
        },
        companyNameLabel: "Maqaa Dhaabbataa / Company Name",
        companyNamePlaceholder: "Maqaa dhaabbata keessanii galchaa",
        contactDetailsLabel: "Odeeffannoo Quunnamtii / Contact Info",
        contactDetailsPlaceholder: "Bilbila, e-mail...",
        colorPreferenceLabel: "Halluuwwan Filataman / Preferred Colors",
        colorPreferencePlaceholder: "fkn., Gurraachaa fi Warqee",
        instructionsLabel: "Ibsa Diizaayinii / Design Description",
        instructionsPlaceholder: "Odeeffannoo bal'aa waa'ee diizaayinichaa asitti barreessaa...",
        nextBtn: "Itti Fufi / Next",
        noticeText: "📝 Hubachiisa: Fakkiiwwan agarsiisaa (Screenshot) kaffaltii, fakkiiwwan diizaayiniif galesan ykn ergaa sagalee, fuula kana xumurtanii odeeffannoo eega ergitaniin booda botii irratti kallattiin galchuun ni danda'ama.",
        step2Title: "Odeeffannoo Kaffaltii",
        paymentRefLabel: "Lakkoofsa Mirkaneessa Kaffaltii (Reference Number)",
        paymentRefPlaceholder: "Lakkoofsa mirkaneessa nagahee galchaa",
        submitBtn: "Ajaja Ergi",
        backBtn: "Duuba / Back",
        sendingText: "Ergamaa Jira...",
        errorMsg: "Rakkoon uumameera. Maaloo buttonii keyboard irraa appii saaqaa."
    }
};

function applyLanguage(lang) {
    const t = translations[lang];

    document.getElementById('step1-title').textContent = t.step1Title;
    document.getElementById('design-type-label').textContent = t.designTypeLabel;

    const select = document.getElementById('design_type');
    for (let i = 0; i < select.options.length; i++) {
        const val = select.options[i].value;
        if (t.options[val]) {
            select.options[i].text = t.options[val];
        }
    }

    document.getElementById('company-name-label').textContent = t.companyNameLabel;
    document.getElementById('company_name').placeholder = t.companyNamePlaceholder;

    document.getElementById('contact-details-label').textContent = t.contactDetailsLabel;
    document.getElementById('contact_details').placeholder = t.contactDetailsPlaceholder;

    document.getElementById('color-preference-label').textContent = t.colorPreferenceLabel;
    document.getElementById('color_preference').placeholder = t.colorPreferencePlaceholder;

    document.getElementById('instructions-label').textContent = t.instructionsLabel;
    document.getElementById('instructions').placeholder = t.instructionsPlaceholder;

    document.getElementById('next-btn').textContent = t.nextBtn;
    document.getElementById('notice-1').textContent = t.noticeText;

    document.getElementById('step2-title').textContent = t.step2Title;
    document.getElementById('payment-ref-label').textContent = t.paymentRefLabel;
    document.getElementById('payment_ref').placeholder = t.paymentRefPlaceholder;

    document.getElementById('mainBtn').textContent = t.submitBtn;
    document.getElementById('back-btn').textContent = t.backBtn;
    document.getElementById('notice-2').textContent = t.noticeText;
}

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
applyLanguage(currentLang);
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

function sendOrder(e) {
    if (e) e.preventDefault();
    try {
        const btn = document.getElementById('mainBtn');
        btn.textContent = translations[currentLang].sendingText;
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
            lang: currentLang,
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
        if (tg && typeof tg.sendData === 'function') {
            tg.sendData(payload);
            tg.close(); // Closes the Telegram slider sheet immediately
        } else {
            console.error("Telegram WebApp API is undefined or sendData is not a function.");
            alert(translations[currentLang].errorMsg + "\n(tg.sendData fallback)");
            btn.textContent = translations[currentLang].submitBtn;
            btn.disabled = false;
        }

    } catch (e) {
        console.error("Error sending data:", e);
        alert(translations[currentLang].errorMsg);
        const btn = document.getElementById('mainBtn');
        btn.textContent = translations[currentLang].submitBtn;
        btn.disabled = false;
    }
}
