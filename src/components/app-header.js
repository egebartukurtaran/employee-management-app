// src/components/app-header.js
import { LitElement, html, css } from 'lit'; // Importing core LitElement libraries
import { navigateTo } from "../router.js"; // Import navigation function
import { t } from '../localization/translations.js'; // Import translation function

/**
 * AppHeader Component
 * A customizable header component built with LitElement
 * Features:
 * - Company logo and branding
 * - Navigation to employees list
 * - Button to add new employees
 * - Language selector with dropdown (supports English and Turkish)
 */
export class AppHeader extends LitElement {
    // Define reactive properties
    static get properties() {
        return {
            currentLanguage: { type: String }, // Tracks the currently selected language
            isLanguageDropdownOpen: { type: Boolean } // Tracks dropdown open/closed state
        };
    }

    // Component styling using CSS
    static get styles() {
        return css`
      :host {
        display: block;
        padding: 15px 20px;
        background-color: white;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }
      
      /* Container for the entire header */
      .header-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1200px;
        margin: 0 auto;
      }
      
      /* Logo section styling */
      .logo-section {
        display: flex;
        align-items: center;
        cursor: pointer;
      }
      
      .logo-icon {
        width: 40px;
        height: 40px;
        background-color: #ff6200;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 10px;
      }
      
      .logo-icon img {
        width: 70px;
        height: 70px;
      }
      
      .logo-text {
        font-weight: bold;
        font-size: 18px;
        color: #333;
      }
      
      /* Actions section containing navigation and buttons */
      .actions {
        display: flex;
        align-items: center;
        gap: 20px; /* Increased gap between buttons */
      }
      
      /* Employees link styling with hover effects */
      .employees-link {
        display: flex;
        align-items: center;
        color: #ff6200;
        text-decoration: none;
        font-weight: 500; /* Changed from lighter to medium weight for better visibility */
        font-size: 16px; /* Increased font size */
        cursor: pointer;
        padding: 8px 16px; /* Added padding for larger clickable area */
        border-radius: 4px;
        transition: background-color 0.2s, color 0.2s;
      }
      
      .employees-link:hover {
        background-color: rgba(255, 98, 0, 0.05); /* Subtle hover effect */
      }
      
      .employees-icon {
        margin-right: 8px; /* Increased spacing */
        color: #ff6200;
        width: 22px; /* Larger icon */
        height: 22px; /* Larger icon */
      }
      
      /* Add employee button with enhanced styling */
      .add-button {
        background-color: #ff6200; /* Changed to filled button for better visibility */
        color: white; /* Changed text to white for contrast */
        font-weight: 500; /* Medium font weight */
        border: none;
        border-radius: 4px;
        padding: 10px 18px; /* Increased padding for larger button */
        font-size: 16px; /* Increased font size */
        cursor: pointer;
        display: flex;
        align-items: center;
        transition: background-color 0.2s;
        box-shadow: 0 2px 4px rgba(255, 98, 0, 0.2); /* Subtle shadow for depth */
      }
      
      .add-button:hover {
        background-color: #e55800; /* Darker color on hover */
      }
      
      .add-button span {
        margin-right: 8px;
        font-size: 20px; /* Larger plus icon */
        font-weight: bold;
        line-height: 1;
      }
      
      /* Language dropdown styling and positioning */
      .language-dropdown {
        position: relative;
        cursor: pointer;
      }
      
      .flag-icon {
        width: 24px;
        height: 16px;
        border-radius: 2px;
      }
      
      .language-options {
        position: absolute;
        top: 100%;
        right: 0;
        background-color: white;
        border: 1px solid #eee;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        padding: 8px 0;
        display: none;
        z-index: 1000;
        min-width: 120px;
      }
      
      .language-options.open {
        display: block;
      }
      
      .language-option {
        display: flex;
        align-items: center;
        padding: 8px 12px;
        cursor: pointer;
      }
      
      .language-option:hover {
        background-color: #f5f5f5;
      }
      
      .language-option img {
        margin-right: 8px;
      }
      
      /* Responsive adjustments for mobile devices */
      @media (max-width: 768px) {
        .header-container {
          flex-wrap: wrap;
        }
        
        .actions {
          width: 100%;
          justify-content: space-between;
          margin-top: 15px;
        }
        
        .employees-link, .add-button {
          padding: 8px 12px; /* Slightly smaller on mobile */
        }
      }
    `;
    }

    /**
     * Constructor initializes default state
     * - Sets default language from localStorage or falls back to English
     * - Initializes dropdown as closed
     * - Binds event handlers to maintain correct 'this' context
     */
    constructor() {
        super();
        this.currentLanguage = localStorage.getItem('preferredLanguage') || 'en';
        this.isLanguageDropdownOpen = false;
        this._onClickOutside = this._onClickOutside.bind(this);
    }

    /**
     * Lifecycle method when element is added to DOM
     * - Adds click event listener to close dropdown when clicking outside
     */
    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('click', this._onClickOutside);
    }

    /**
     * Lifecycle method when element is removed from DOM
     * - Removes event listeners to prevent memory leaks
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('click', this._onClickOutside);
    }

    /**
     * Handles clicks outside the language dropdown
     * - Closes the dropdown when user clicks elsewhere on the page
     * @param {Event} event - The click event
     */
    _onClickOutside(event) {
        const path = event.composedPath();
        if (this.isLanguageDropdownOpen && !path.includes(this.renderRoot.querySelector('.language-dropdown'))) {
            this.isLanguageDropdownOpen = false;
        }
    }

    /**
     * Navigates to the home page
     * - Used when clicking on the logo
     */
    _navigateHome() {
        navigateTo('/');
    }

    /**
     * Toggles the language dropdown visibility
     * - Prevents event propagation to avoid triggering outside click handler
     * @param {Event} e - The click event
     */
    _toggleLanguageDropdown(e) {
        e.stopPropagation();
        this.isLanguageDropdownOpen = !this.isLanguageDropdownOpen;
    }

    /**
     * Changes the application language
     * - Stores preference in localStorage
     * - Updates HTML document lang attribute
     * - Dispatches custom event for app-wide notification
     * - Reloads the page to apply changes
     * @param {string} lang - The language code to change to (e.g., 'en', 'tr')
     */
    _changeLanguage(lang) {
        if (this.currentLanguage !== lang) {
            // Store the language preference in localStorage
            localStorage.setItem('preferredLanguage', lang);

            // Update the HTML lang attribute
            document.documentElement.lang = lang;
            this.currentLanguage = lang;

            // Close the dropdown
            this.isLanguageDropdownOpen = false;

            // Dispatch a custom event to notify the application
            this.dispatchEvent(new CustomEvent('language-changed', {
                detail: { language: lang },
                bubbles: true,
                composed: true
            }));

            console.log(`Language changed to: ${lang}`);

            // Trigger a page reload to apply the new language
            window.location.reload();
        }
    }

    /**
     * Gets the URL for a language's flag image
     * @param {string} lang - The language code
     * @returns {string} - URL to the flag image
     */
    getFlagUrl(lang) {
        // You can replace these with actual flag images
        const flags = {
            en: 'https://flagcdn.com/w40/gb.png',
            tr: 'https://flagcdn.com/w40/tr.png'
        };
        return flags[lang] || flags.en;
    }

    /**
     * Gets the display name for a language
     * @param {string} lang - The language code
     * @returns {string} - Localized name of the language
     */
    getLanguageName(lang) {
        const names = {
            en: 'English',
            tr: 'Türkçe'
        };
        return names[lang] || 'English';
    }

    /**
     * Handles navigation to the add employee page
     */
    _handleAddEmployee() {
        navigateTo('/add');
    }

    /**
     * Renders the component template
     * @returns {TemplateResult} - LitElement template result
     */
    render() {
        return html`
            <div class="header-container">
                <!-- Logo section - navigates home when clicked -->
                <div class="logo-section" @click="${this._navigateHome}">
                    <div class="logo-icon">
                        <img src="/ing.webp" alt="ING Logo">
                    </div>
                    <div class="logo-text">ING</div>
                </div>

                <div class="actions">
                    <!-- Employees navigation link -->
                    <div class="employees-link" @click="${this._navigateHome}">
                        <svg class="employees-icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                             stroke-linecap="round" stroke-linejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        ${t('employees')}
                    </div>

                    <!-- Add employee button -->
                    <button class="add-button" @click="${this._handleAddEmployee}">
                        <span>+</span> ${t('add_employees')}
                    </button>

                    <!-- Language selector dropdown -->
                    <div class="language-dropdown" @click="${(e) => e.stopPropagation()}">
                        <div class="current-language" @click="${this._toggleLanguageDropdown}">
                            <img class="flag-icon" src="${this.getFlagUrl(this.currentLanguage)}"
                                 alt="${this.getLanguageName(this.currentLanguage)}">
                        </div>

                        <!-- Language options that appear when dropdown is open -->
                        <div class="language-options ${this.isLanguageDropdownOpen ? 'open' : ''}">
                            <div class="language-option" @click="${() => this._changeLanguage('en')}">
                                <img class="flag-icon" src="${this.getFlagUrl('en')}" alt="English">
                                <span>English</span>
                            </div>
                            <div class="language-option" @click="${() => this._changeLanguage('tr')}">
                                <img class="flag-icon" src="${this.getFlagUrl('tr')}" alt="Türkçe">
                                <span>Türkçe</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Register the custom element with the browser
customElements.define('app-header', AppHeader);