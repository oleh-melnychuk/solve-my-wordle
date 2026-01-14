// Embedded translations as fallback (source: English)
const embeddedTranslations = {
    en: {
        title: 'Word of the Day',
        subtitle: 'Daily Wordle Words',
        letters5: '5 Letters',
        letters6: '6 Letters',
        clickToReveal: 'Click to reveal',
        issue: 'Issue',
        lastUpdated: 'Last Updated',
        supportProject: 'Support the project',
        topUpMonobank: 'Top up the bank via Monobank',
        qrAlt: 'QR code for top-up'
    },
    uk: {
        title: 'Слово дня',
        subtitle: 'Щоденні слова Wordle',
        letters5: '5 Літер',
        letters6: '6 Літер',
        clickToReveal: 'Натисніть, щоб відкрити',
        issue: 'Випуск',
        lastUpdated: 'Останнє оновлення',
        supportProject: 'Підтримати проект',
        topUpMonobank: 'Поповнити банку через Monobank',
        qrAlt: 'QR-код для поповнення'
    }
};

// Translations storage
let translations = {};
let currentLang = localStorage.getItem('language') || 'uk'; // Default to Ukrainian

// Load translation file
async function loadTranslation(lang) {
    try {
        // Try to load from JSON file
        const response = await fetch(`./translations/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load translation: ${lang}`);
        }
        return await response.json();
    } catch (error) {
        // Fallback to embedded translations
        console.warn(`Using embedded translation for ${lang}`);
        return embeddedTranslations[lang] || embeddedTranslations.en;
    }
}

// Load all translations
async function loadTranslations() {
    translations.en = await loadTranslation('en');
    translations.uk = await loadTranslation('uk');
}

// Switch language function
function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Update all translatable elements
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Update issue labels (they have text nodes)
    document.querySelectorAll('.word-issue').forEach(element => {
        const issueNum = element.textContent.match(/#\d+/)?.[0];
        if (issueNum) {
            element.innerHTML = `<span data-i18n="issue">${translations[lang].issue}</span> ${issueNum}`;
        }
    });
    
    // Update dropdown selection
    const langSelect = document.getElementById('language-select');
    if (langSelect) {
        langSelect.value = lang;
    }
    
    // Update QR code alt text
    const qrImg = document.querySelector('#qrcode img');
    if (qrImg) {
        qrImg.alt = translations[lang].qrAlt;
    }
}

// Card flip function
function flipCard(card) {
    if (!card.classList.contains('flipped')) {
        card.classList.add('flipped');
    }
}

// Generate QR code using API service
const monobankUrl = 'https://send.monobank.ua/jar/AT6icdg5vu';

// Initialize on page load
document.addEventListener('DOMContentLoaded', async function() {
    // Load translations first
    await loadTranslations();
    
    // Set dropdown to current language
    const langSelect = document.getElementById('language-select');
    if (langSelect) {
        langSelect.value = currentLang;
    }
    
    // Set initial language
    switchLanguage(currentLang);
    
    // Generate QR code
    const qrElement = document.getElementById('qrcode');
    if (qrElement) {
        // Encode URL for API
        const encodedUrl = encodeURIComponent(monobankUrl);
        // Use api.qrserver.com - free and reliable
        const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodedUrl}`;
        
        // Create and insert image
        const img = document.createElement('img');
        img.src = qrImageUrl;
        img.alt = translations[currentLang]?.qrAlt || 'QR code for top-up';
        img.style.width = '250px';
        img.style.height = '250px';
        img.style.borderRadius = '10px';
        
        qrElement.appendChild(img);
    }
});
