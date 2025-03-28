// src/store/connect.js
import { store } from './index.js';

// Higher-order function that adds store connectivity to a component
// Similar to React-Redux connect pattern but for web components
export const connect = (baseElement) => class extends baseElement {
    constructor() {
        super();
        this._unsubscribe = null; // Store subscription reference
    }

    // When component is added to the DOM
    connectedCallback() {
        super.connectedCallback();
        // Subscribe to store changes and update component
        this._unsubscribe = store.subscribe(() => {
            this.stateChanged(store.getState());
        });
        // Initialize with current state
        this.stateChanged(store.getState());
    }

    // Cleanup when component is removed
    disconnectedCallback() {
        if (this._unsubscribe) {
            this._unsubscribe(); // Prevent memory leaks by unsubscribing
            this._unsubscribe = null;
        }
        super.disconnectedCallback();
    }

    // To be implemented by child components
    // This method receives the latest state and lets components react
    stateChanged(state) {
        // Override in your component
    }
};