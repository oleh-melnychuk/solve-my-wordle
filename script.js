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
    },
    uk: {
        title: 'Слово дня',
        subtitle: 'Щоденні слова Wordle',
        letters5: '5 Літер',
        letters6: '6 Літер',
        clickToReveal: 'Натисніть, щоб відкрити',
        issue: 'Випуск',
        lastUpdated: 'Останнє оновлення',
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
    
}

// Card flip function
function flipCard(card) {
    if (!card.classList.contains('flipped')) {
        card.classList.add('flipped');
    }
}

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
});
