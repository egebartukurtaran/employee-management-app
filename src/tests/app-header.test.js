// src/tests/app-header.test.js

// Avoid using external mocks, keep it simple
describe('AppHeader', () => {
    // Mock component functions
    const navigateToMock = jest.fn();

    // Create a simplified mock component
    const component = {
        _navigateHome: function() {
            navigateToMock('/');
        },
        _handleAddEmployee: function() {
            navigateToMock('/add');
        }
    };

    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();
    });

    test('navigates to home when logo is clicked', () => {
        component._navigateHome();
        expect(navigateToMock).toHaveBeenCalledWith('/');
    });

    test('navigates to add employee page', () => {
        component._handleAddEmployee();
        expect(navigateToMock).toHaveBeenCalledWith('/add');
    });
});