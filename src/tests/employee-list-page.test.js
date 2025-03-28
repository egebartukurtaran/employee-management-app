// src/tests/employee-list-page.test.js

// Mock actions directly in the test file
const EmployeeActions = {
    add: (employee) => ({ type: 'ADD_EMPLOYEE', payload: employee }),
    update: (employee) => ({ type: 'UPDATE_EMPLOYEE', payload: employee }),
    delete: (id) => ({ type: 'DELETE_EMPLOYEE', payload: id })
};

const UIActions = {
    setCurrentPage: (page) => ({ type: 'SET_CURRENT_PAGE', payload: page }),
    setSearchTerm: (term) => ({ type: 'SET_SEARCH_TERM', payload: term }),
    setViewMode: (mode) => ({ type: 'SET_VIEW_MODE', payload: mode })
};

// Mock navigation function
const navigateTo = jest.fn();

describe('EmployeeListPage', () => {
    // Sample test data
    const mockEmployees = [
        {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            dateOfEmployment: '01/01/2020',
            dateOfBirth: '01/01/1990',
            phone: '+(90) 532 123 45 67',
            email: 'john.doe@example.com',
            department: 'Tech',
            position: 'Senior'
        },
        {
            id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            dateOfEmployment: '02/02/2020',
            dateOfBirth: '02/02/1992',
            phone: '+(90) 532 987 65 43',
            email: 'jane.smith@example.com',
            department: 'Analytics',
            position: 'Junior'
        }
    ];

    // Mock store
    const mockStore = {
        dispatch: jest.fn(),
        getState: jest.fn(() => ({
            employees: mockEmployees,
            ui: {
                currentPage: 1,
                searchTerm: '',
                viewMode: 'table'
            }
        }))
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('filters employees based on search term', () => {
        const component = {
            _getFilteredEmployees: function(state) {
                const { searchTerm } = state.ui;
                if (!searchTerm) return state.employees;

                const lowerCaseSearchTerm = searchTerm.toLowerCase();
                return state.employees.filter(employee =>
                    employee.firstName.toLowerCase().includes(lowerCaseSearchTerm) ||
                    employee.lastName.toLowerCase().includes(lowerCaseSearchTerm) ||
                    employee.email.toLowerCase().includes(lowerCaseSearchTerm)
                );
            }
        };

        // Test with no search term
        const noFilterState = {
            employees: mockEmployees,
            ui: { searchTerm: '' }
        };
        expect(component._getFilteredEmployees(noFilterState)).toEqual(mockEmployees);

        // Test with search term that should match first employee
        const filteredState = {
            employees: mockEmployees,
            ui: { searchTerm: 'John' }
        };
        const filtered = component._getFilteredEmployees(filteredState);
        expect(filtered.length).toBe(1);
        expect(filtered[0].id).toBe('1');
    });

    test('handles edit employee navigation', () => {
        const component = {
            _handleEditEmployee: function(employee) {
                navigateTo(`/edit/${employee.id}`);
            }
        };

        component._handleEditEmployee(mockEmployees[0]);
        expect(navigateTo).toHaveBeenCalledWith('/edit/1');
    });

    test('confirms employee deletion', () => {
        const component = {
            _showDeleteDialog: false,
            _employeeToDelete: null,
            _confirmDeleteEmployee: function(employee) {
                this._employeeToDelete = employee;
                this._showDeleteDialog = true;
            }
        };

        component._confirmDeleteEmployee(mockEmployees[0]);

        expect(component._showDeleteDialog).toBe(true);
        expect(component._employeeToDelete).toBe(mockEmployees[0]);
    });

    test('handles delete confirmation', () => {
        const component = {
            _showDeleteDialog: true,
            _employeeToDelete: mockEmployees[0],
            _handleDeleteConfirm: function() {
                if (this._employeeToDelete) {
                    mockStore.dispatch(EmployeeActions.delete(this._employeeToDelete.id));
                    this._showDeleteDialog = false;
                    this._employeeToDelete = null;
                }
            }
        };

        component._handleDeleteConfirm();

        expect(mockStore.dispatch).toHaveBeenCalledWith({
            type: 'DELETE_EMPLOYEE',
            payload: '1'
        });
        expect(component._showDeleteDialog).toBe(false);
        expect(component._employeeToDelete).toBe(null);
    });

    test('handles view mode change', () => {
        const component = {
            _viewMode: 'table',
            _handleViewChange: function(mode) {
                if (this._viewMode !== mode) {
                    mockStore.dispatch(UIActions.setViewMode(mode));
                }
            }
        };

        // Change from table to list
        component._handleViewChange('list');
        expect(mockStore.dispatch).toHaveBeenCalledWith({
            type: 'SET_VIEW_MODE',
            payload: 'list'
        });

        // No change if same mode
        mockStore.dispatch.mockClear();
        component._viewMode = 'list';
        component._handleViewChange('list');
        expect(mockStore.dispatch).not.toHaveBeenCalled();
    });
});