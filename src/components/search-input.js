// src/components/search-input.js
import { LitElement, html, css } from 'lit';

/**
 * SearchInput Component
 * Reusable search input with icon for filtering data
 */
export class SearchInput extends LitElement {
    // Define reactive properties
    static get properties() {
        return {
            value: { type: String },        // Current search text value
            placeholder: { type: String }   // Placeholder text for input
        };
    }

    // Component styling
    static get styles() {
        return css`
      :host {
        display: block;
      }
      
      .search-container {
        position: relative;
        width: 300px;
      }
      
      .search-input {
        width: 100%;
        padding: 8px 12px;
        padding-left: 36px; /* Space for the search icon */
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        outline: none;
        transition: border-color 0.2s;
      }
      
      .search-input:focus {
        border-color: var(--primary-color, #ff6200);
      }
      
      .search-icon {
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        width: 18px;
        height: 18px;
        stroke: #999;
      }
      
      /* Responsive adjustments */
      @media (max-width: 768px) {
        .search-container {
          width: 100%;
        }
      }
    `;
    }

    // Initialize default values
    constructor() {
        super();
        this.value = '';
        this.placeholder = 'Search employees...';
    }

    // Handle input changes and dispatch search event
    _handleInput(e) {
        this.value = e.target.value;
        this.dispatchEvent(new CustomEvent('search', {
            detail: this.value,
            bubbles: true,
            composed: true
        }));
    }

    // Render the search input with icon
    render() {
        return html`
            <div class="search-container">
                <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                        type="text"
                        class="search-input"
                        .value="${this.value}"
                        placeholder="${this.placeholder}"
                        @input="${this._handleInput}">
            </div>
        `;
    }
}

customElements.define('search-input', SearchInput);