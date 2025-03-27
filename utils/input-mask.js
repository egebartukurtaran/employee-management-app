// src/utils/input-mask.js

/**
 * A simple input masking utility for form fields
 */

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

// Phone mask in +(90) 539 850 02 44 format
export function phoneMask(input) {
    // Remove any non-digit characters
    let value = input.replace(/\D/g, '');

    // Start with +
    let result = '+';

    // Add country code in parentheses
    if (value.length > 0) {
        result += '(' + value.substring(0, Math.min(value.length, 2)) + ')';

        // Add first three digits
        if (value.length > 2) {
            result += ' ' + value.substring(2, Math.min(value.length, 5));
        }

        // Add next three digits
        if (value.length > 5) {
            result += ' ' + value.substring(5, Math.min(value.length, 8));
        }

        // Add next two digits
        if (value.length > 8) {
            result += ' ' + value.substring(8, Math.min(value.length, 10));
        }

        // Add last two digits
        if (value.length > 10) {
            result += ' ' + value.substring(10, Math.min(value.length, 12));
        }
    }

    return result;
}

// Real-time validation helpers
export const validators = {
    // Date validation for DD/MM/YYYY format
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

    // Phone validation for +(90) 532 123 45 67 format
    phone: (value) => {
        if (!value) return false;
        return /^\+\(\d{2}\)\s\d{3}\s\d{3}\s\d{2}\s\d{2}$/.test(value);
    },

    // Email validation
    email: (value) => {
        if (!value) return false;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
};