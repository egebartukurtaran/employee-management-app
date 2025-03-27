describe('ConfirmationDialog', () => {
    // Mock event handlers
    const confirmSpy = jest.fn();
    const cancelSpy = jest.fn();

    // Create a mock component
    const component = {
        title: 'Test Confirmation',
        message: 'Are you sure you want to perform this action?',
        confirmLabel: 'Confirm',
        cancelLabel: 'Cancel',
        _handleConfirm: function() {
            // Dispatch confirm event
            confirmSpy();
        },
        _handleCancel: function() {
            // Dispatch cancel event
            cancelSpy();
        }
    };

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();
    });

    test('calls confirm handler when confirm button is clicked', () => {
        // Call confirm handler
        component._handleConfirm();

        // Check if handler was called
        expect(confirmSpy).toHaveBeenCalled();
    });

    test('calls cancel handler when cancel button is clicked', () => {
        // Call cancel handler
        component._handleCancel();

        // Check if handler was called
        expect(cancelSpy).toHaveBeenCalled();
    });
});