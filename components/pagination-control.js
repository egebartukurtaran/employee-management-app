// src/components/pagination-control.js
import { LitElement, html, css } from 'lit';

/**
 * PaginationControl Component
 * Reusable pagination component for multi-page content navigation
 */
export class PaginationControl extends LitElement {
    // Define reactive properties
    static get properties() {
        return {
            currentPage: { type: Number },    // Active page number
            totalPages: { type: Number },     // Total number of pages
            maxVisiblePages: { type: Number } // Max page buttons to display
        };
    }

    // Component styling
    static get styles() {
        return css`
          :host {
            display: block;
            margin: 20px 0;
          }

          .pagination {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
          }

          .page-btn {
            min-width: 36px;
            height: 36px;
            border: 1px solid #ddd;
            background-color: white;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            color: #333;
            transition: all 0.2s;
          }

          .page-btn:hover {
            background-color: #f5f5f5;
          }

          .page-btn.active {
            background-color: var(--primary-color, #ff6200);
            color: white;
            border-color: var(--primary-color, #ff6200);
          }

          .page-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .page-btn.nav {
            color: var(--primary-color, #ff6200);
          }

          .ellipsis {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 5px;
          }

          .nav-icon {
            width: 18px;
            height: 18px;
            stroke: currentColor;
          }
        `;
    }

    // Initialize default values
    constructor() {
        super();
        this.currentPage = 1;
        this.totalPages = 1;
        this.maxVisiblePages = 5;
    }

    // Handle page navigation
    _handlePageChange(page) {
        if (page < 1 || page > this.totalPages || page === this.currentPage) {
            return;
        }

        this.dispatchEvent(new CustomEvent('page-change', {
            detail: page,
            bubbles: true,
            composed: true
        }));
    }

    // Calculate which page buttons to display
    _getPageButtons() {
        const buttons = [];

        if (this.totalPages <= this.maxVisiblePages) {
            // Show all pages if total is less than max visible
            for (let i = 1; i <= this.totalPages; i++) {
                buttons.push(i);
            }
        } else {
            // Show subset with ellipsis for large page counts
            buttons.push(1);

            let start = Math.max(2, this.currentPage - Math.floor(this.maxVisiblePages / 2));
            let end = Math.min(this.totalPages - 1, start + this.maxVisiblePages - 3);

            if (end === this.totalPages - 1) {
                start = Math.max(2, end - (this.maxVisiblePages - 3));
            }

            if (start > 2) buttons.push('...');

            for (let i = start; i <= end; i++) {
                buttons.push(i);
            }

            if (end < this.totalPages - 1) buttons.push('...');

            buttons.push(this.totalPages);
        }

        return buttons;
    }

    // Render previous icon
    _renderPrevIcon() {
        return html`
            <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
        `;
    }

    // Render next icon
    _renderNextIcon() {
        return html`
            <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        `;
    }

    // Render the pagination component
    render() {
        if (this.totalPages <= 1) {
            return html``;
        }

        const pageButtons = this._getPageButtons();

        return html`
            <div class="pagination">
                <button
                        class="page-btn nav"
                        ?disabled=${this.currentPage === 1}
                        @click=${() => this._handlePageChange(this.currentPage - 1)}
                        title="Previous page">
                    ${this._renderPrevIcon()}
                </button>

                ${pageButtons.map(page =>
                        page === '...' ?
                                html`<span class="ellipsis">...</span>` :
                                html`
                                    <button
                                            class="page-btn ${page === this.currentPage ? 'active' : ''}"
                                            @click=${() => this._handlePageChange(page)}>
                                        ${page}
                                    </button>
                                `
                )}

                <button
                        class="page-btn nav"
                        ?disabled=${this.currentPage === this.totalPages}
                        @click=${() => this._handlePageChange(this.currentPage + 1)}
                        title="Next page">
                    ${this._renderNextIcon()}
                </button>
            </div>
        `;
    }
}

customElements.define('pagination-control', PaginationControl);