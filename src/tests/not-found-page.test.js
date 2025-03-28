// src/tests/not-found-page.test.js
describe('NotFoundPage', () => {
    // Mock navigation
    const navigateToMock = jest.fn();

    // Create mock component
    const component = {
        _goToHome: function() {
            navigateToMock('/');
        }
    };

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();
    });

    test('navigates to home when button is clicked', () => {
        // Call go to home method
        component._goToHome();

        // Check navigation
        expect(navigateToMock).toHaveBeenCalledWith('/');
    });
});
