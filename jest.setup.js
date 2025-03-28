// jest.setup.js
// Minimal mock setup for browser environment

// Mock window
global.window = {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    location: {
        pathname: '/',
        search: '',
        hash: '',
        reload: jest.fn()
    }
};

// Mock document
global.document = {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    createElement: jest.fn().mockReturnValue({
        style: {},
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
    }),
    createTextNode: jest.fn(),
    querySelector: jest.fn(),
    querySelectorAll: jest.fn().mockReturnValue([])
};

// Mock localStorage
global.localStorage = {
    getItem: jest.fn().mockReturnValue(null),
    setItem: jest.fn(),
    removeItem: jest.fn()
};

// Mock CustomEvent
global.CustomEvent = class CustomEvent {
    constructor(type, options) {
        this.type = type;
        this.detail = options?.detail;
        this.bubbles = options?.bubbles || false;
        this.composed = options?.composed || false;
    }
};

// Mock customElements
global.customElements = {
    define: jest.fn(),
    get: jest.fn()
};