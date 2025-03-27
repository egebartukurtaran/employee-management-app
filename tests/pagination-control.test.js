// src/tests/input-mask.test.js
describe('Input Masking', () => {
    // Create mock implementations of masking functions
    const dateMask = (input) => {
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
    };

    const phoneMask = (input) => {
        // Remove any non-digit characters
        let value = input.replace(/\D/g, '');

        // Format as +(90) 539 850 02 44
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
    };

    // Create mock validators
    const validators = {
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

        phone: (value) => {
            if (!value) return false;
            return /^\+\(\d{2}\)\s\d{3}\s\d{3}\s\d{2}\s\d{2}$/.test(value);
        },

        email: (value) => {
            if (!value) return false;
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        }
    };

    test('formats date input correctly', () => {
        // Test day formatting
        expect(dateMask('12')).toBe('12');
        expect(dateMask('123')).toBe('12/3');

        // Test month formatting
        expect(dateMask('1234')).toBe('12/34');
        expect(dateMask('12345')).toBe('12/34/5');

        // Test complete date
        expect(dateMask('12345678')).toBe('12/34/5678');

        // Test with non-numeric characters
        expect(dateMask('12/34/5678')).toBe('12/34/5678');
        expect(dateMask('12-34-5678')).toBe('12/34/5678');
    });

    test('formats phone input correctly', () => {
        // Test beginning of phone number
        expect(phoneMask('9')).toBe('+(9)');
        expect(phoneMask('90')).toBe('+(90)');

        // Test area code
        expect(phoneMask('905')).toBe('+(90) 5');
        expect(phoneMask('90539')).toBe('+(90) 539');

        // Test middle part
        expect(phoneMask('90539850')).toBe('+(90) 539 850');

        // Test last parts
        expect(phoneMask('9053985002')).toBe('+(90) 539 850 02');
        expect(phoneMask('905398500244')).toBe('+(90) 539 850 02 44');
    });

    test('validates date correctly', () => {
        // Valid dates
        expect(validators.date('01/01/2020')).toBe(true);
        expect(validators.date('29/02/2020')).toBe(true); // Leap year

        // Invalid dates
        expect(validators.date('32/01/2020')).toBe(false); // Invalid day
        expect(validators.date('29/02/2021')).toBe(false); // Not a leap year
        expect(validators.date('01/13/2020')).toBe(false); // Invalid month
        expect(validators.date('2020-01-01')).toBe(false); // Wrong format
    });

    test('validates phone correctly', () => {
        // Valid phone
        expect(validators.phone('+(90) 539 850 02 44')).toBe(true);

        // Invalid phone
        expect(validators.phone('+90 539 850 02 44')).toBe(false);
        expect(validators.phone('90 539 850 02 44')).toBe(false);
        expect(validators.phone('+(90)5398500244')).toBe(false);
    });

    test('validates email correctly', () => {
        // Valid emails
        expect(validators.email('test@example.com')).toBe(true);
        expect(validators.email('user.name@example.com')).toBe(true);

        // Invalid emails
        expect(validators.email('test@')).toBe(false);
        expect(validators.email('test@example')).toBe(false);
        expect(validators.email('test.example.com')).toBe(false);
    });
});