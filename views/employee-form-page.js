// src/views/employee-form-page.js
import { LitElement, html, css } from 'lit';
import { connect } from '../store/connect.js';
import { store } from '../store';
import { EmployeeActions } from '../store/actions.js';
import { t } from '../localization/translations.js';
import { navigateTo } from '../router.js';
import { dateMask, phoneMask, validators } from '../utils/input-mask.js';

/**
 * EmployeeFormPage Component
 * Handles both creating and editing employee records
 * Features form validation, input masking, and confirmation dialogs
 */
class EmployeeFormPage extends connect(LitElement) {
    // Define reactive properties
    static get properties() {
        return {
            id: { type: String },              // Employee ID when editing
            _employee: { type: Object },       // Current employee data
            _isEditMode: { type: Boolean },    // Whether in edit or create mode
            _showConfirmDialog: { type: Boolean }, // Controls confirmation dialog
            _formValid: { type: Boolean },     // Overall form validity
            _errors: { type: Object },         // Validation errors by field
            _liveValidation: { type: Boolean } // Whether to validate on input
        };
    }

    // Initialize component state
    constructor() {
        super();
        this.id = null;
        this._isEditMode = false;
        this._showConfirmDialog = false;
        this._formValid = false;
        this._errors = {};
        this._liveValidation = false;
        this._employee = this._getEmptyEmployee();
    }

    // Component styling
    static get styles() {
        return css`
          /* Root container */
          :host {
            display: block;
            width: 100%;
            box-sizing: border-box;
            padding: 16px;
          }

          /* Page header with title */
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

          /* Main form container */
          .form-container {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            padding: 32px;
            width: 100%;
            max-width: 100%;
            margin: 0 auto 30px;
            box-sizing: border-box;
            overflow: hidden; /* Prevent overflow */
          }

          /* Form row layout - responsive flex container */
          .form-row {
            display: flex;
            flex-wrap: wrap;
            gap: 24px;
            margin-bottom: 10px;
            width: 100%;
            box-sizing: border-box;
            padding: 0;
            margin-left: 0;
            margin-right: 0;
          }

          /* Form group - individual input container */
          .form-group {
            flex: 1 1 calc(50% - 12px);
            min-width: 200px;
            max-width: 100%;
            box-sizing: border-box;
          }

          /* Form input styling */
          input, select {
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
            padding: 14px 16px;
            margin: 5px 0 15px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            outline: none;
          }

          /* Focus state for inputs */
          input:focus, select:focus {
            border-color: #ff6200;
            box-shadow: 0 0 0 3px rgba(255, 98, 0, 0.1);
            background-color: #fff;
          }

          /* Error message styling */
          .error {
            color: #e53935;
            font-size: 13px;
            margin-top: 8px;
            display: block;
          }

          /* Form buttons container */
          .form-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 16px;
            margin-top: 40px;
            padding-top: 24px;
            border-top: 1px solid #eee;
          }

          /* Button base styling */
          .btn {
            padding: 14px 28px;
            border-radius: 6px;
            font-size: 15px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            min-width: 120px;
            text-align: center;
          }

          /* Primary (accent) button */
          .btn-primary {
            background-color: #ff6200;
            color: white;
            border: none;
          }

          .btn-primary:hover {
            background-color: #e55800;
          }

          /* Secondary button */
          .btn-secondary {
            background-color: #f5f5f5;
            color: #333;
            border: 1px solid #ddd;
          }

          .btn-secondary:hover {
            background-color: #eaeaea;
          }

          /* Required field indicator */
          .required::after {
            content: " *";
            color: #e53935;
            font-weight: bold;
          }

          /* Placeholder styling */
          ::placeholder {
            color: #aaa;
          }

          /* Custom select dropdown styling */
          select {
            appearance: none;
            background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 16px center;
            background-size: 16px;
            padding-right: 48px;
          }

          /* Responsive adjustments for mobile */
          @media (max-width: 768px) {
            .form-group {
              flex: 1 1 100%; /* Full width on small screens */
            }

            .form-container {
              padding: 20px; /* Less padding on mobile */
            }
          }
        `;
    }

    // Runs after component is first rendered
    // Extracts employee ID from URL for editing
    firstUpdated() {
        // Check for ID in route params
        // For URL pattern /edit/:id
        const path = window.location.pathname;
        const pathParts = path.split('/');

        // Extract ID from the URL path segments
        let id = null;
        if (pathParts.length >= 3 && pathParts[1] === 'edit') {
            id = pathParts[2];
        }

        // Also check for query params as fallback (for legacy URLs)
        if (!id) {
            const params = new URLSearchParams(window.location.search);
            id = params.get('id');
        }

        if (id) {
            this.id = id;
            this._isEditMode = true;
            this._loadEmployeeData();
        }
    }

    // Loads employee data from store when editing
    _loadEmployeeData() {
        if (!this.id) return;

        const state = store.getState();
        const employee = state.employees.find(emp => emp.id === this.id);

        if (employee) {
            this._employee = { ...employee };
        } else {
            // Handle case where employee isn't found
            console.error('Employee not found');
            navigateTo('/'); // Navigate back to list
        }
    }

    // Creates an empty employee object for new records
    _getEmptyEmployee() {
        return {
            id: null,
            firstName: '',
            lastName: '',
            dateOfEmployment: this._formatDate(new Date()),
            dateOfBirth: '',
            phone: '',
            email: '',
            department: '',
            position: ''
        };
    }

    // Helper to format Date object to DD/MM/YYYY
    _formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    // Connected callback from store - updates when store changes
    stateChanged(state) {
        if (this.id) {
            const employee = state.employees.find(emp => emp.id === this.id);
            if (employee) {
                this._employee = { ...employee };
                this._isEditMode = true;
            }
        }
    }

    // Lifecycle method to detect property changes
    update(changedProperties) {
        if (changedProperties.has('id') && this.id) {
            this._isEditMode = true;
        }
        super.update(changedProperties);
    }

    // Handles all input changes with field-specific formatting
    _handleInputChange(e) {
        const { name, value } = e.target;
        let maskedValue = value;

        // Apply masking based on field name
        if (name === 'dateOfEmployment' || name === 'dateOfBirth') {
            maskedValue = dateMask(value);
            // Update input value with masked version
            e.target.value = maskedValue;
        } else if (name === 'phone') {
            maskedValue = phoneMask(value);
            // Update input value with masked version
            e.target.value = maskedValue;
        }

        // Update employee object
        this._employee = {
            ...this._employee,
            [name]: maskedValue
        };

        // If we're doing live validation, validate this field
        if (this._liveValidation) {
            this._validateField(name, maskedValue);
        }
    }

    // Validates a single field and returns validity
    _validateField(fieldName, value) {
        let errorMessage = null;

        // Empty check for required fields
        if (!value || value.trim() === '') {
            errorMessage = t('error.required');
        } else {
            // Field-specific validation
            switch (fieldName) {
                case 'email':
                    if (!validators.email(value)) {
                        errorMessage = t('error.email');
                    }
                    break;

                case 'phone':
                    if (!validators.phone(value)) {
                        errorMessage = t('error.phone');
                    }
                    break;

                case 'dateOfBirth':
                case 'dateOfEmployment':
                    if (!validators.date(value)) {
                        errorMessage = t('error.date');
                    }
                    break;
            }
        }

        // Update errors object
        this._errors = {
            ...this._errors,
            [fieldName]: errorMessage
        };

        return !errorMessage;
    }

    // Validates the entire form
    _validateForm() {
        // Start live validation from this point
        this._liveValidation = true;

        const requiredFields = ['firstName', 'lastName', 'dateOfEmployment', 'dateOfBirth', 'phone', 'email', 'department', 'position'];

        // Validate all fields
        let isValid = true;
        for (const field of requiredFields) {
            const fieldValid = this._validateField(field, this._employee[field]);
            isValid = isValid && fieldValid;
        }

        this._formValid = isValid;
        return isValid;
    }

    // Form submission handler
    _handleSubmit(e) {
        e.preventDefault();

        if (this._validateForm()) {
            this._showConfirmDialog = true;
        } else {
            // Scroll to first error
            const firstErrorField = Object.keys(this._errors).find(key => this._errors[key]);
            if (firstErrorField) {
                const errorElement = this.shadowRoot.querySelector(`#${firstErrorField}`);
                if (errorElement) {
                    errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    errorElement.focus();
                }
            }
        }
    }

    // Confirmation dialog success handler
    _handleConfirm() {
        this._showConfirmDialog = false;

        if (this._isEditMode) {
            store.dispatch(EmployeeActions.update(this._employee));
        } else {
            const newEmployee = {
                ...this._employee,
                id: Date.now().toString() // Generate a unique ID
            };
            store.dispatch(EmployeeActions.add(newEmployee));
        }

        navigateTo('/');
    }

    // Confirmation dialog cancel handler
    _handleCancel() {
        this._showConfirmDialog = false;
    }

    // Navigate back to employee list
    _navigateBack() {
        navigateTo('/');
    }

    // Render the component template
    render() {
        return html`
      <div class="page-header">
        <h1>${this._isEditMode ? t('employees.edit') : t('employees.add')}</h1>
      </div>
      
      <div class="form-container">
        <form @submit=${this._handleSubmit}>
          <!-- Name fields -->
          <div class="form-row">
            <div class="form-group">
              <label class="required" for="firstName">${t('employee.firstName')}</label>
              <input 
                type="text" 
                id="firstName" 
                name="firstName"
                class="${this._errors.firstName ? 'error-input' : ''}"
                .value=${this._employee.firstName}
                @input=${this._handleInputChange}>
              ${this._errors.firstName ? html`<div class="error">${this._errors.firstName}</div>` : ''}
            </div>
            
            <div class="form-group">
              <label class="required" for="lastName">${t('employee.lastName')}</label>
              <input 
                type="text" 
                id="lastName" 
                name="lastName"
                class="${this._errors.lastName ? 'error-input' : ''}"
                .value=${this._employee.lastName}
                @input=${this._handleInputChange}>
              ${this._errors.lastName ? html`<div class="error">${this._errors.lastName}</div>` : ''}
            </div>
          </div>
          
          <!-- Date fields -->
          <div class="form-row">
            <div class="form-group">
              <label class="required" for="dateOfEmployment">${t('employee.dateOfEmployment')}</label>
              <input 
                type="text" 
                id="dateOfEmployment" 
                name="dateOfEmployment"
                class="${this._errors.dateOfEmployment ? 'error-input' : ''}"
                placeholder="DD/MM/YYYY"
                .value=${this._employee.dateOfEmployment}
                @input=${this._handleInputChange}>
              ${this._errors.dateOfEmployment ? html`<div class="error">${this._errors.dateOfEmployment}</div>` : ''}
            </div>
            
            <div class="form-group">
              <label class="required" for="dateOfBirth">${t('employee.dateOfBirth')}</label>
              <input 
                type="text" 
                id="dateOfBirth" 
                name="dateOfBirth"
                class="${this._errors.dateOfBirth ? 'error-input' : ''}"
                placeholder="DD/MM/YYYY"
                .value=${this._employee.dateOfBirth}
                @input=${this._handleInputChange}>
              ${this._errors.dateOfBirth ? html`<div class="error">${this._errors.dateOfBirth}</div>` : ''}
            </div>
          </div>
          
          <!-- Contact information -->
          <div class="form-row">
            <div class="form-group">
              <label class="required" for="phone">${t('employee.phone')}</label>
              <input 
                type="text" 
                id="phone" 
                name="phone"
                class="${this._errors.phone ? 'error-input' : ''}"
                placeholder="+(90) 532 123 45 67"
                .value=${this._employee.phone}
                @input=${this._handleInputChange}>
              ${this._errors.phone ? html`<div class="error">${this._errors.phone}</div>` : ''}
            </div>
            
            <div class="form-group">
              <label class="required" for="email">${t('employee.email')}</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                class="${this._errors.email ? 'error-input' : ''}"
                .value=${this._employee.email}
                @input=${this._handleInputChange}>
              ${this._errors.email ? html`<div class="error">${this._errors.email}</div>` : ''}
            </div>
          </div>
          
          <!-- Job information -->
          <div class="form-row">
            <div class="form-group">
              <label class="required" for="department">${t('employee.department')}</label>
              <select 
                id="department" 
                name="department"
                class="${this._errors.department ? 'error-input' : ''}"
                .value=${this._employee.department}
                @change=${this._handleInputChange}>
                <option value="" disabled selected>${t('select.department')}</option>
                <option value="Analytics">${t('departments.analytics')}</option>
                <option value="Tech">${t('departments.tech')}</option>
              </select>
              ${this._errors.department ? html`<div class="error">${this._errors.department}</div>` : ''}
            </div>
            
            <div class="form-group">
              <label class="required" for="position">${t('employee.position')}</label>
              <select 
                id="position" 
                name="position"
                class="${this._errors.position ? 'error-input' : ''}"
                .value=${this._employee.position}
                @change=${this._handleInputChange}>
                <option value="" disabled selected>${t('select.position')}</option>
                <option value="Junior">${t('positions.junior')}</option>
                <option value="Medior">${t('positions.medior')}</option>
                <option value="Senior">${t('positions.senior')}</option>
              </select>
              ${this._errors.position ? html`<div class="error">${this._errors.position}</div>` : ''}
            </div>
          </div>
          
          <!-- Form action buttons -->
          <div class="form-buttons">
            <button 
              type="button" 
              class="btn btn-secondary"
              @click=${this._navigateBack}>
              ${t('button.cancel')}
            </button>
            <button 
              type="submit" 
              class="btn btn-primary">
              ${this._isEditMode ? t('button.update') : t('button.save')}
            </button>
          </div>
        </form>
      </div>
      
      <!-- Confirmation dialog -->
      ${this._showConfirmDialog ? html`
        <confirmation-dialog
          title="${this._isEditMode ? t('confirmation.updateEmployee') : t('confirmation.addEmployee')}"
          message="${t('confirmation.saveChanges')}"
          @confirm=${this._handleConfirm}
          @cancel=${this._handleCancel}>
        </confirmation-dialog>
      ` : ''}
    `;
    }
}

// Register the custom element with the browser
customElements.define('employee-form-page', EmployeeFormPage);