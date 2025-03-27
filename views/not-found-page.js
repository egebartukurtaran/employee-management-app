// src/views/not-found-page.js
import { LitElement, html, css } from 'lit';
import { navigateTo } from '../router.js';
import { t } from '../localization/translations.js';

class NotFoundPage extends LitElement {
    static get styles() {
        return css`
      :host {
        display: block;
        width: 100%;
        box-sizing: border-box;
        padding: 16px;
        text-align: center;
      }

      .not-found-container {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        padding: 40px 32px;
        width: 100%;
        max-width: 600px;
        margin: 60px auto;
        box-sizing: border-box;
      }

      .error-code {
        font-size: 120px;
        font-weight: 700;
        color: #ff6200;
        margin: 0;
        line-height: 1;
        text-shadow: 2px 2px 0 rgba(255, 98, 0, 0.1);
      }

      .error-title {
        font-size: 28px;
        color: #333;
        margin: 16px 0 24px;
      }

      .error-message {
        font-size: 16px;
        color: #666;
        line-height: 1.5;
        margin-bottom: 32px;
        max-width: 450px;
        margin-left: auto;
        margin-right: auto;
      }

      .action-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background-color: #ff6200;
        color: white;
        padding: 12px 24px;
        border-radius: 6px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        text-decoration: none;
        border: none;
        transition: background-color 0.2s;
      }

      .action-btn:hover {
        background-color: #e55800;
      }

      .illustration {
        max-width: 300px;
        margin: 0 auto 30px;
      }

      .btn-icon {
        width: 20px;
        height: 20px;
      }

      @media (max-width: 480px) {
        .error-code {
          font-size: 100px;
        }

        .error-title {
          font-size: 24px;
        }

        .not-found-container {
          padding: 32px 20px;
          margin: 40px auto;
        }
      }
    `;
    }

    _goToHome() {
        navigateTo('/');
    }

    render() {
        // Use hardcoded strings as fallback in case translations are not available
        const pageTitle = t('notFound.title') || 'Page Not Found';
        const pageMessage = t('notFound.message') || 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.';
        const backToHomeText = t('notFound.backToHome') || 'Back to Home';

        return html`
      <div class="not-found-container">
        

        <h1 class="error-code">404</h1>
        <h2 class="error-title">${t('404.title')}</h2>
        <p class="error-message">
            ${t('404.message')}
        </p>
        <button class="action-btn" @click="${this._goToHome}">
          <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
            ${t('404.backToHome')}
        </button>
      </div>
    `;
    }
}

customElements.define('not-found-page', NotFoundPage);