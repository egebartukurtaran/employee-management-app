// src/app.js
// Main application entry point that sets up the router and app structure
// Serves as the root component for the employee management application

import { LitElement, html, css } from 'lit'; // Core LitElement libraries
import { initRouter } from './router.js'; // Router initialization function
import './components/app-header.js'; // App header component

/**
 * EmployeeApp Component
 * Root component that contains the app header and main content area
 * Sets up routing to handle page navigation
 */
export class EmployeeApp extends LitElement {
    // Component styling
    static get styles() {
        return css`
      /* Root container taking full viewport height */
      :host {
        display: block;
        min-height: 100vh;
      }
      
      /* Main content area with centered layout and responsive width */
      main {
        max-width: 1200px; /* Limit width for larger screens */
        margin: 0 auto; /* Center horizontally */
        padding: 16px; /* Add spacing around content */
      }
    `;
    }

    /**
     * Lifecycle method called after first render
     * Sets up the router for page navigation
     */
    firstUpdated() {
        // Get the main content container where pages will be rendered
        const outlet = this.renderRoot.querySelector('#outlet');

        // Initialize the router with the outlet element
        const router = initRouter(outlet);

        // Set up event listener for programmatic navigation
        // This allows components to trigger navigation without direct router access
        window.addEventListener('vaadin-router-go', (e) => {
            const path = e.detail?.pathname || '/'; // Get target path or default to home
            router.render(path); // Navigate to the path
        });
    }

    /**
     * Renders the application shell
     * Includes the header and the main content area for route rendering
     */
    render() {
        return html`
      <!-- App header with navigation and branding -->
      <app-header></app-header>
      
      <!-- Main content area where router will inject page components -->
      <main id="outlet"></main>
    `;
    }
}

// Register the custom element with the browser
customElements.define('employee-app', EmployeeApp);