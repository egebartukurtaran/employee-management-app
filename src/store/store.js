// src/store/Store.js

// Custom store implementation similar to Redux
export class Store {
    constructor(reducer, initialState = {}) {
        this.reducer = reducer;        // Function that processes actions
        this.state = initialState;     // Current application state
        this.listeners = [];           // Subscribed components

        // Try to load state from localStorage for persistence
        try {
            const saved = localStorage.getItem('employeeState');
            if (saved) {
                this.state = JSON.parse(saved);
            }
        } catch (e) {
            console.error('Failed to load state:', e);
        }
    }

    // Returns the current application state
    getState() {
        return this.state;
    }

    // Processes an action through the reducer and updates state
    dispatch(action) {
        this.state = this.reducer(this.state, action);

        // Persist state to localStorage
        try {
            localStorage.setItem('employeeState', JSON.stringify(this.state));
        } catch (e) {
            console.error('Failed to save state:', e);
        }

        // Notify all subscribers about the state change
        this.listeners.forEach(listener => listener());
        return action;
    }

    // Adds a listener function that runs on state changes
    // Returns an unsubscribe function for cleanup
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }
}