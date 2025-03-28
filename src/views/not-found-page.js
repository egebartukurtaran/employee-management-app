// src/views/not-found-page.js
// 404 Error page component that displays when route isn't found
// Shows error message and provides navigation back to home page

import { LitElement, html, css } from 'lit'; // Core LitElement imports
import { navigateTo } from '../router.js'; // Navigation utility
import { t } from '../localization/translations.js'; // Translation utility

/**
 * NotFoundPage Component
 * Displays a user-friendly 404 error page with return to home option
 */
class NotFoundPage extends LitElement {
    // Component styling
    static get styles() {
        return css`
      /* Root container */
      :host {
        display: block;
        width: 100%;
        box-sizing: border-box;
        padding: 16px;
        text-align: center; /* Center all content */
      }

      /* Main container with shadow and rounded corners */
      .not-found-container {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        padding: 40px 32px;
        width: 100%;
        max-width: 600px; /* Limit width for better readability */
        margin: 60px auto; /* Center on page with space above */
        box-sizing: border-box;
      }

      /* Large 404 error code styling */
      .error-code {
        font-size: 120px;
        font-weight: 700;
        color: #ff6200;
        margin: 0;
        line-height: 1;
        text-shadow: 2px 2px 0 rgba(255, 98, 0, 0.1); /* Subtle shadow for depth */
      }

      /* Error title below the code */
      .error-title {
        font-size: 28px;
        color: #333;
        margin: 16px 0 24px;
      }

      /* Explanatory message */
      .error-message {
        font-size: 16px;
        color: #666;
        line-height: 1.5;
        margin-bottom: 32px;
        max-width: 450px; /* Control line length for readability */
        margin-left: auto;
        margin-right: auto;
      }

      /* Call-to-action button styling */
      .action-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px; /* Space between icon and text */
        background-color: #ff6200; 
        color: white;
        padding: 12px 24px;
        border-radius: 6px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        text-decoration: none;
        border: none;
        transition: background-color 0.2s; /* Smooth hover effect */
      }

      /* Button hover state */
      .action-btn:hover {
        background-color: #e55800; 
      }

      /* Optional illustration - not used in this rendering */
      .illustration {
        max-width: 300px;
        margin: 0 auto 30px;
      }

      /* Home icon in button */
      .btn-icon {
        width: 20px;
        height: 20px;
      }

      /* Responsive adjustments for small screens */
      @media (max-width: 480px) {
        .error-code {
          font-size: 100px; /* Smaller font on mobile */
        }

        .error-title {
          font-size: 24px; /* Smaller font on mobile */
        }

        .not-found-container {
          padding: 32px 20px; /* Less padding on mobile */
          margin: 40px auto; /* Less margin on mobile */
        }
      }
    `;
    }

    // Navigate back to home page
    goToHome() {
        navigateTo('/');
    }

    // Render the component
    render() {
        return html`
      <div class="not-found-container">
        <!-- Large error code display -->
        <h1 class="error-code">404</h1>
        
        <!-- Error title - uses translation -->
        <h2 class="error-title">${t('404.title')}</h2>
        
        <!-- Error message with explanation -->
        <p class="error-message">
            ${t('404.message')}
        </p>
        
        <!-- Action button with home icon -->
        <button class="action-btn" @click="${this.goToHome}">
          <!-- Home icon SVG -->
          <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <!-- Button text - uses translation -->
          ${t('404.backToHome')}
        </button>
      </div>
    `;
    }
}

// Register custom element with the browser
customElements.define('not-found-page', NotFoundPage);