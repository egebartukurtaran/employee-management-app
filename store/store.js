// src/store/Store.js
export class Store {
    constructor(reducer, initialState = {}) {
        this.reducer = reducer;
        this.state = initialState;
        this.listeners = [];

        // Try to load state from localStorage
        try {
            const saved = localStorage.getItem('employeeState');
            if (saved) {
                this.state = JSON.parse(saved);
            }
        } catch (e) {
            console.error('Failed to load state:', e);
        }
    }

    getState() {
        return this.state;
    }

    dispatch(action) {
        this.state = this.reducer(this.state, action);

        // Save to localStorage
        try {
            localStorage.setItem('employeeState', JSON.stringify(this.state));
        } catch (e) {
            console.error('Failed to save state:', e);
        }

        this.listeners.forEach(listener => listener());
        return action;
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }
}