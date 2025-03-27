// src/utils/locale-utils.js
export const getLocale = () => {
    return localStorage.getItem('preferredLanguage') || document.documentElement.lang || 'en';
};