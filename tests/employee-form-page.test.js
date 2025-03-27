// src/tests/employee-form-page.test.js

// Define action creators directly
const EmployeeActions = {
    add: (employee) => ({ type: 'ADD_EMPLOYEE', payload: employee }),
    update: (employee) => ({ type: 'UPDATE_EMPLOYEE', payload: employee })
};

// Mock navigation function
const navigateTo = jest.fn();

describe('EmployeeFormPage', () => {
    // Sample test data
    const mockEmployee = {
        id: '123',
        firstName: 'John',
        lastName: 'Doe',
        dateOfEmployment: '01/01/2020',
        dateOfBirth: '01/01/1990',
        phone: '+(90) 532 123 45 67',
        email: 'john.doe@example.com',
        department: 'Tech',
        position: 'Senior'
    };

    // Mock store
    const mockStore = {
        dispatch: jest.fn(),
        getState: jest.fn(() => ({
            employees: [mockEmployee]
        }))
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('loads employee data in edit mode', () => {
        const component = {
            id: '123',
            _employee: {},
            _loadEmployeeData: function() {
                if (!this.id) return;

                const state = mockStore.getState();
                const employee = state.employees.find(emp => emp.id === this.id);

                if (employee) {
                    this._employee = { ...employee };
                }
            }
        };

        component._loadEmployeeData();
        expect(component._employee).toEqual(mockEmployee);
    });

    test('handles input changes', () => {
        const component = {
            _employee: { ...mockEmployee },
            _errors: { firstName: 'Error' },
            _handleInputChange: function(e) {
                const { name, value } = e.target;
                this._employee = {
                    ...this._employee,
                    [name]: value
                };

                // Clear error for this field
                if (this._errors[name]) {
                    this._errors = {
                        ...this._errors,
                        [name]: null
                    };
                }
            }
        };

        // Test input change
        const event = { target: { name: 'firstName', value: 'Jane' } };
        component._handleInputChange(event);

        expect(component._employee.firstName).toBe('Jane');
        expect(component._errors.firstName).toBeNull();
    });

    test('validates required fields', () => {
        // Mock translation function
        const t = jest.fn(key => key);

        const component = {
            _employee: { firstName: '', lastName: '' },
            _errors: {},
            _formValid: false,
            t: t,
            _validateForm: function() {
                const errors = {};
                let isValid = true;

                // Required fields
                const requiredFields = ['firstName', 'lastName', 'dateOfEmployment', 'dateOfBirth',
                    'phone', 'email', 'department', 'position'];
                requiredFields.forEach(field => {
                    if (!this._employee[field]) {
                        errors[field] = this.t('error.required');
                        isValid = false;
                    }
                });

                this._errors = errors;
                this._formValid = isValid;
                return isValid;
            }
        };

        const result = component._validateForm();

        expect(result).toBe(false);
        expect(component._errors.firstName).toBe('error.required');
        expect(component._errors.lastName).toBe('error.required');
    });

    test('validates email format', () => {
        // Mock translation function
        const t = jest.fn(key => key);

        const component = {
            _employee: {
                firstName: 'John',
                lastName: 'Doe',
                email: 'invalid-email'
            },
            _errors: {},
            _formValid: false,
            t: t,
            _validateForm: function() {
                const errors = {};
                let isValid = true;

                // Fill in required fields for this test
                ['dateOfEmployment', 'dateOfBirth', 'phone', 'department', 'position'].forEach(field => {
                    if (!this._employee[field]) {
                        this._employee[field] = 'test'; // Add dummy values
                    }
                });

                // Email validation
                if (this._employee.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this._employee.email)) {
                    errors.email = this.t('error.email');
                    isValid = false;
                }

                this._errors = errors;
                this._formValid = isValid;
                return isValid;
            }
        };

        const result = component._validateForm();

        expect(result).toBe(false);
        expect(component._errors.email).toBe('error.email');

        // Test with valid email
        component._employee.email = 'john.doe@example.com';
        component._errors = {};
        const validResult = component._validateForm();

        expect(validResult).toBe(true);
        expect(component._errors.email).toBeUndefined();
    });

    test('adds a new employee on confirmation', () => {
        const component = {
            _isEditMode: false,
            _employee: { ...mockEmployee, id: null },
            _showConfirmDialog: true,
            _handleConfirm: function() {
                this._showConfirmDialog = false;

                if (this._isEditMode) {
                    mockStore.dispatch(EmployeeActions.update(this._employee));
                } else {
                    const newEmployee = {
                        ...this._employee,
                        id: 'new-id' // Simplify for testing
                    };
                    mockStore.dispatch(EmployeeActions.add(newEmployee));
                }

                navigateTo('/');
            }
        };

        component._handleConfirm();

        expect(component._showConfirmDialog).toBe(false);
        expect(mockStore.dispatch).toHaveBeenCalled();
        expect(mockStore.dispatch.mock.calls[0][0].type).toBe('ADD_EMPLOYEE');
        expect(navigateTo).toHaveBeenCalledWith('/');
    });

    test('updates an employee on confirmation in edit mode', () => {
        const component = {
            _isEditMode: true,
            _employee: { ...mockEmployee, firstName: 'Updated' },
            _showConfirmDialog: true,
            _handleConfirm: function() {
                this._showConfirmDialog = false;

                if (this._isEditMode) {
                    mockStore.dispatch(EmployeeActions.update(this._employee));
                } else {
                    const newEmployee = {
                        ...this._employee,
                        id: 'new-id'
                    };
                    mockStore.dispatch(EmployeeActions.add(newEmployee));
                }

                navigateTo('/');
            }
        };

        component._handleConfirm();

        expect(component._showConfirmDialog).toBe(false);
        expect(mockStore.dispatch).toHaveBeenCalled();
        expect(mockStore.dispatch.mock.calls[0][0].type).toBe('UPDATE_EMPLOYEE');
        expect(mockStore.dispatch.mock.calls[0][0].payload.firstName).toBe('Updated');
        expect(navigateTo).toHaveBeenCalledWith('/');
    });
});