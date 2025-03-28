// src/utils/locale-utils.js

// Returns the user's preferred language from storage or document settings
export const getLocale = () => {
    // Check localStorage first for user preference
    // Then fall back to document language
    // Default to English if neither is available
    return localStorage.getItem('preferredLanguage') || document.documentElement.lang || 'en';
};