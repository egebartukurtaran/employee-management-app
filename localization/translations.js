// src/localization/translations.js
import { getLocale } from '../utils/locale-utils.js';
import { en } from './en.js';
import { tr } from './tr.js';

const translations = {
    en,
    tr
};

export const t = (key) => {
    const locale = getLocale(); // This should return 'en' or 'tr'
    const translation = translations[locale] || translations.en;
    return translation[key] || key;
};