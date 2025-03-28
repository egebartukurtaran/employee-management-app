// src/utils/input-mask.js

// Date mask in DD/MM/YYYY format
export function dateMask(input) {
    // Remove any non-digit characters
    let value = input.replace(/\D/g, '');

    // Format as DD/MM/YYYY
    if (value.length > 0) {
        // Add first slash after day
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2);
        }
        // Add second slash after month
        if (value.length > 5) {
            value = value.substring(0, 5) + '/' + value.substring(5);
        }
        // Limit to 10 characters (DD/MM/YYYY)
        if (value.length > 10) {
            value = value.substring(0, 10);
        }
    }

    return value;
}

// Phone mask in +(90) 532 123 45 67 format
// Updated phone mask function to format as +(90) 539 850 02 44

// Phone mask formatter for Turkish phone number format
export function phoneMask(input) {
    // Remove any non-digit characters
    let value = input.replace(/\D/g, '');

    // Start with +
    let result = '+';

    // Format: +(90) 539 850 02 44
    if (value.length > 0) {
        // Country code in parentheses
        result += '(' + value.substring(0, Math.min(value.length, 2)) + ')';

        // Area code (539)
        if (value.length > 2) {
            result += ' ' + value.substring(2, Math.min(value.length, 5));
        }

        // First part of number (850)
        if (value.length > 5) {
            result += ' ' + value.substring(5, Math.min(value.length, 8));
        }

        // Second part of number (02)
        if (value.length > 8) {
            result += ' ' + value.substring(8, Math.min(value.length, 10));
        }

        // Last part of number (44)
        if (value.length > 10) {
            result += ' ' + value.substring(10, Math.min(value.length, 12));
        }
    }

    return result;
}

// Input validators for form fields
export const validators = {
    // Validates date in DD/MM/YYYY format
    // Checks format and logical date validity (month range, days in month)
    date: (value) => {
        if (!value) return false;

        // Check format
        const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const match = value.match(dateRegex);
        if (!match) return false;

        // Extract day, month, year
        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10);
        const year = parseInt(match[3], 10);

        // Check ranges
        if (month < 1 || month > 12) return false;
        if (day < 1) return false;

        // Check days in month
        const daysInMonth = new Date(year, month, 0).getDate();
        if (day > daysInMonth) return false;

        // Valid date
        return true;
    },

    // Validates phone number format
    // Must match the pattern created by phoneMask
    phone: (value) => {
        if (!value) return false;
        return /^\+\(\d{2}\)\s\d{3}\s\d{3}\s\d{2}\s\d{2}$/.test(value);
    },

    // Validates email format
    // Basic check for user@domain.tld pattern
    email: (value) => {
        if (!value) return false;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
};