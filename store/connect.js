// src/store/connect.js
import { store } from './index.js';

export const connect = (baseElement) => class extends baseElement {
    constructor() {
        super();
        this._unsubscribe = null;
    }

    connectedCallback() {
        super.connectedCallback();
        this._unsubscribe = store.subscribe(() => {
            this.stateChanged(store.getState());
        });
        // Initial state
        this.stateChanged(store.getState());
    }

    disconnectedCallback() {
        if (this._unsubscribe) {
            this._unsubscribe();
            this._unsubscribe = null;
        }
        super.disconnectedCallback();
    }

    stateChanged(state) {
        // Override in your component
    }
};