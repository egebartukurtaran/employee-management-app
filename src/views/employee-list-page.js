// src/views/employee-list-page.js
import { LitElement, html, css } from 'lit';
import { connect } from '../store/connect.js';
import { store } from '../store';
import { UIActions, EmployeeActions } from '../store/actions.js';
import '../components/pagination-control.js';
import '../components/search-input.js';
import '../components/confirmation-dialog.js';
import { t } from '../localization/translations.js';
import {navigateTo} from "../router";

class EmployeeListPage extends connect(LitElement) {
    // Define reactive properties
    static get properties() {
        return {
            _employees: { type: Array },
            _totalPages: { type: Number },
            _currentPage: { type: Number },
            _viewMode: { type: String },
            _showDeleteDialog: { type: Boolean },
            _employeeToDelete: { type: Object },
            _searchTerm: { type: String },
            _language: { type: String }
        };
    }

    constructor() {
        super();
        this._employees = [];
        this._totalPages = 1;
        this._currentPage = 1;
        this._viewMode = 'table';
        this._showDeleteDialog = false;
        this._employeeToDelete = null;
        this._searchTerm = '';
        this._language = localStorage.getItem('preferredLanguage') || 'en';

        // Set the document language attribute
        document.documentElement.lang = this._language;

        // Listen for language changes from other components
        this._onLanguageChanged = this._onLanguageChanged.bind(this);
        window.addEventListener('language-changed', this._onLanguageChanged);
    }

    // Clean up event listener when component is removed
    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('language-changed', this._onLanguageChanged);
    }

    // Handle language change events
    _onLanguageChanged(event) {
        this._language = event.detail.language;
        this.requestUpdate();
    }

    static get styles() {
        return css`
          :host {
            display: block;
            width: 100%;
            box-sizing: border-box;
            padding: 16px;
          }

          .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            color: #ff6200;
          }
          .page-header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 500;
          }

          .header-controls {
            display: flex;
            align-items: center;
          }

          .controls-row {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .search-container {
            position: relative;
            width: 250px;
          }

          .search-input {
            width: 100%;
            padding: 10px 0px 10px 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            outline: none;
            
          }

          .search-button {
            position: absolute;
            right: 0;
            top: 0;
            height: 100%;
            background: none;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 12px;
            cursor: pointer;
          }

          .search-icon {
            width: 20px;
            height: 20px;
            stroke: #666;
          }

          .view-controls {
            display: flex;
            border: 1px solid #ddd;
            border-radius: 4px;
            overflow: hidden;
            margin-left: 16px;
          }

          @media (max-width: 768px) {
            .page-header {
              flex-direction: column;
              align-items: flex-start;
              gap: 15px;
            }

            .header-controls {
              width: 100%;
            }

            .controls-row {
              width: 100%;
              flex-direction: column;
              align-items: flex-start;
              gap: 10px;
            }

            .search-container {
              width: 100%;
            }

            .view-controls {
              align-self: flex-end;
            }
          }

          .view-btn {
            background: white;
            border: none;
            padding: 8px 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .view-btn:not(:last-child) {
            border-right: 1px solid #ddd;
          }

          .view-btn.active {
            background-color: #ff6200;
            color: white;
          }

          .view-btn.active svg {
            stroke: white;
          }

          .view-btn .icon {
            width: 20px;
            height: 20px;
          }

          .table-container {
            width: 100%;
            max-width: 100%;
            background-color: white;
            border-radius: 8px;
            overflow-x: auto;
            margin-bottom: 30px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            box-sizing: border-box;
            padding: 10px;
          }

          th, td {
            padding: 12px 10px;
            text-align: center;
            border-bottom: 1px solid #f2f2f2;
            font-size: 14px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          th {
            color: #ff6200;
            font-weight: lighter;
            font-size: 14px;
            white-space: nowrap;
            padding-top: 20px;
            padding-bottom: 20px;
          }

          th:first-child, td:first-child {
            padding-left: 24px;
          }

          th:last-child, td:last-child {
            padding-right: 24px;
          }

          tr {
            height: 60px;
          }

          .table-container + pagination-control {
            margin-top: 30px;
          }

          tr:hover {
            background-color: rgba(0, 0, 0, 0.02);
          }

          .checkbox-cell {
            width: 40px;
            text-align: center;
          }

          .actions-cell {
            width: 100px;
            white-space: nowrap;
          }

          .action-btn {
            background: none;
            border: none;
            cursor: pointer;
            margin-right: 8px;
            padding: 4px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }

          .action-btn.delete, .action-btn.edit {
            color: #ff6200;
          }

          .icon {
            width: 20px;
            height: 20px;
            stroke: currentColor;
            fill: none;
          }

          .edit-icon, .delete-icon {
            stroke: #ff6200;
          }

          .empty-message {
            text-align: center;
            padding: 20px;
            color: #666;
            font-style: italic;
          }

          .list-wrapper {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            padding: 20px;
            width: 100%;
            max-width: 100%;
            margin-bottom: 30px;
            box-sizing: border-box;
          }
          
          .list-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
          }

          .employee-card {
            border: 1px solid #ddd;
            border-radius: 5px;
            overflow: hidden;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            background-color: white;
          }

          .card-header {
            background-color: white;
            padding: 10px 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #ddd;
            
          }

          .card-header h3 {
            margin: 0;
            font-size: 18px;
            color: #333;
          }

          .card-body {
            padding: 15px;
          }

          .info-row {
            margin-bottom: 8px;
            display: flex;
          }

          .info-row .label {
            font-weight: normal;
            font-size:14px;
            width: 130px;
            margin-right: 10px;
          }

          .info-row .value {
            flex: 1;
          }

          .card-actions {
            display: flex;
            gap: 5px;
          }

          .edit-btn, .delete-btn {
            border: none;
            background: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 4px;
            color: #ff6200;
          }

          .pagination {
            display: flex;
            justify-content: center;
            margin: 20px 0;
            gap: 5px;
          }

          .page-btn {
            min-width: 32px;
            height: 32px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            cursor: pointer;
          }

          .page-btn.active {
            background-color: #ff6200;
            color: white;
            border-color: #ff6200;
          }

          .page-btn.nav {
            color: #ff6200;
          }

          @media (max-width: 768px) {
            .page-header {
              flex-direction: column;
              align-items: flex-start;
              gap: 15px;
            }

            .header-controls {
              width: 100%;
              flex-wrap: wrap;
            }

            .search-container {
              width: 100%;
              margin-bottom: 10px;
            }

            .view-controls {
              margin-left: auto;
            }

            th, td {
              padding: 8px;
            }

            .list-container {
              grid-template-columns: 1fr;
            }
          }
        `;
    }

    // Update from store state
    stateChanged(state) {
        this._searchTerm = state.ui.searchTerm || '';

        // Get paginated employees
        const filteredEmployees = this._getFilteredEmployees(state);
        const itemsPerPage = 10;
        const startIndex = (state.ui.currentPage - 1) * itemsPerPage;

        this._employees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);
        this._totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
        this._currentPage = state.ui.currentPage || 1;
        this._viewMode = state.ui.viewMode || 'table';
    }

    // Filter employees based on search term
    _getFilteredEmployees(state) {
        const { searchTerm } = state.ui;
        if (!searchTerm) return state.employees;

        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return state.employees.filter(employee =>
            employee.firstName.toLowerCase().includes(lowerCaseSearchTerm) ||
            employee.lastName.toLowerCase().includes(lowerCaseSearchTerm) ||
            employee.email.toLowerCase().includes(lowerCaseSearchTerm)
        );
    }

    // Handle pagination changes
    _handlePageChange(e) {
        store.dispatch(UIActions.setCurrentPage(e.detail));
    }

    // Navigate to edit page
    _handleEditEmployee(employee) {
        navigateTo(`/edit/${employee.id}`);
    }

    // Show delete confirmation dialog
    _confirmDeleteEmployee(employee) {
        this._employeeToDelete = employee;
        this._showDeleteDialog = true;
    }

    // Handle delete confirmation
    _handleDeleteConfirm() {
        if (this._employeeToDelete) {
            store.dispatch(EmployeeActions.delete(this._employeeToDelete.id));
            this._showDeleteDialog = false;
            this._employeeToDelete = null;
        }
    }

    // Handle delete cancellation
    _handleDeleteCancel() {
        this._showDeleteDialog = false;
        this._employeeToDelete = null;
    }

    // Update search term
    _handleSearchInput(e) {
        this._searchTerm = e.target.value;
        store.dispatch(UIActions.setSearchTerm(this._searchTerm));
    }

    // List view icon
    _renderListIcon() {
        return html`
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
        `;
    }

    // Grid view icon
    _renderGridIcon() {
        return html`
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
        `;
    }

    // Change view mode
    _handleViewChange(mode) {
        if (this._viewMode !== mode) {
            store.dispatch(UIActions.setViewMode(mode));
        }
    }

    // Main render method
    render() {
        return html`
    <div class="page-header">
        <h1>${t('employees.list')}</h1>
        
        <div class="header-controls">
            <div class="controls-row">
                <div class="search-container">
                    <input
                            type="text"
                            class="search-input"
                            .value="${this._searchTerm}"
                            placeholder="${t('search')}"
                            @input="${this._handleSearchInput}">
                    <button class="search-button">
                        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>
                </div>
                <div class="view-controls">
                    <button class="view-btn ${this._viewMode === 'table' ? 'active' : ''}" @click="${() => this._handleViewChange('table')}">
                        ${this._renderListIcon()}
                    </button>
                    <button class="view-btn ${this._viewMode === 'list' ? 'active' : ''}" @click="${() => this._handleViewChange('list')}">
                        ${this._renderGridIcon()}
                    </button>
                </div>
            </div>
        </div>
    </div>

    ${this._viewMode === 'table'
            ? this._renderTableView()
            : this._renderListView()}

    <pagination-control
            .currentPage=${this._currentPage}
            .totalPages=${this._totalPages}
            @page-change=${this._handlePageChange}>
    </pagination-control>

    ${this._showDeleteDialog ? html`
        <confirmation-dialog
                title="${t('employees.delete')}"
                message="${t('confirmation.deleteEmployee')}"
                @confirm=${this._handleDeleteConfirm}
                @cancel=${this._handleDeleteCancel}>
        </confirmation-dialog>
    ` : ''}
    `;
    }

    // Render edit icon
    _renderEditIcon() {
        return html`
    <svg class="icon edit-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
    </svg>
  `;
    }

    // Render delete icon
    _renderDeleteIcon() {
        return html`
    <svg class="icon delete-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
  `;
    }

    // Render table view
    _renderTableView() {
        return html`
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th class="checkbox-cell">
              <input type="checkbox" @change=${this._handleSelectAll}>
            </th>
            <th>${t('employee.firstName')}</th>
            <th>${t('employee.lastName')}</th>
            <th>${t('employee.dateOfEmployment')}</th>
            <th>${t('employee.dateOfBirth')}</th>
            <th>${t('employee.phone')}</th>
            <th>${t('employee.email')}</th>
            <th>${t('employee.department')}</th>
            <th>${t('employee.position')}</th>
            <th class="actions-cell">${t('employee.actions')}</th>
          </tr>
        </thead>
        <tbody>
          ${this._employees.length > 0 ?
            this._employees.map(employee => html`
              <tr>
                <td class="checkbox-cell">
                  <input type="checkbox" .value=${employee.id} @change=${this._handleSelectRow}>
                </td>
                <td>${employee.firstName}</td>
                <td>${employee.lastName}</td>
                <td>${employee.dateOfEmployment}</td>
                <td>${employee.dateOfBirth}</td>
                <td>${employee.phone}</td>
                <td>${employee.email}</td>
                <td>${employee.department}</td>
                <td>${employee.position}</td>
                <td class="actions-cell">
                  <button class="action-btn edit" @click=${() => this._handleEditEmployee(employee)} title="${t('button.edit')}">
                    ${this._renderEditIcon()}
                  </button>
                  <button class="action-btn delete" @click=${() => this._confirmDeleteEmployee(employee)} title="${t('button.delete')}">
                    ${this._renderDeleteIcon()}
                  </button>
                </td>
              </tr>
            `) :
            html`
              <tr>
                <td colspan="10" class="empty-message">${t('list.empty')}</td>
              </tr>
            `
        }
        </tbody>
      </table>
    </div>
  `;
    }

    // Render card/list view
    _renderListView() {
        return html`
            <div class="list-wrapper">
                <div class="list-container">
                    ${this._employees.length > 0 ?
            this._employees.map(employee => html`
                                <div class="employee-card">
                                    <div class="card-header">
                                        <h3>${employee.firstName} ${employee.lastName}</h3>
                                        <div class="card-actions">
                                            <button class="edit-btn" @click=${() => this._handleEditEmployee(employee)} title="${t('button.edit')}">
                                                ${this._renderEditIcon()}
                                            </button>
                                            <button class="delete-btn" @click=${() => this._confirmDeleteEmployee(employee)} title="${t('button.delete')}">
                                                ${this._renderDeleteIcon()}
                                            </button>
                                        </div>
                                    </div>
                                    <div class="card-body">
                                        <div class="info-row">
                                            <span class="label">${t('employee.department')}:</span>
                                            <span class="value">${employee.department}</span>
                                        </div>
                                        <div class="info-row">
                                            <span class="label">${t('employee.position')}:</span>
                                            <span class="value">${employee.position}</span>
                                        </div>
                                        <div class="info-row">
                                            <span class="label">${t('employee.dateOfEmployment')}:</span>
                                            <span class="value">${employee.dateOfEmployment}</span>
                                        </div>
                                        <div class="info-row">
                                            <span class="label">${t('employee.email')}:</span>
                                            <span class="value">${employee.email}</span>
                                        </div>
                                        <div class="info-row">
                                            <span class="label">${t('employee.phone')}:</span>
                                            <span class="value">${employee.phone}</span>
                                        </div>
                                    </div>
                                </div>
                            `) :
            html`<div class="empty-message">${t('list.empty')}</div>`
        }
                </div>
            </div>
        `;
    }

    // Handle select all checkbox
    _handleSelectAll(e) {
        const checked = e.target.checked;
        const checkboxes = this.shadowRoot.querySelectorAll('tbody input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = checked;
        });
        console.log('Select all:', checked);
    }

    // Handle individual row selection
    _handleSelectRow(e) {
        const checked = e.target.checked;
        const value = e.target.value;
        console.log('Select row:', value, checked);
    }
}

customElements.define('employee-list-page', EmployeeListPage);