import { LitElement, html, css } from 'lit';
import { t } from '../localization/translations.js';
export class ConfirmationDialog extends LitElement {
    static get properties() {
        return {
            title: { type: String },
            message: { type: String }
        };
    }

    static get styles() {
        return css`
          :host {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }
          .dialog {
            background-color: white;
            border-radius: 4px;
            padding: 24px;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          }
          h2 {
            margin-top: 0;
            color: #ff6200;
          }
          .actions {
            display: flex;
            justify-content: flex-end;
            margin-top: 24px;
          }
          button {
            padding: 8px 16px;
            border-radius: 4px;
            font-weight: bold;
            cursor: pointer;
            margin-left: 8px;
          }
          button.confirm {
            background-color: #ff6200;
            color: white;
            border: none;
          }
          button.cancel {
            background-color: #f5f5f5;
            border: 1px solid #ccc;
          }
        `;
    }

    _confirm() {
        this.dispatchEvent(new CustomEvent('confirm'));
    }

    _cancel() {
        this.dispatchEvent(new CustomEvent('cancel'));
    }

    render() {
        return html`
            <div class="dialog">
                <h2>${this.title}</h2>
                <p>${this.message}</p>
                <div class="actions">
                    <button
                            class="cancel"
                            @click=${this._cancel}>
                        ${t('cancel')}
                    </button>
                    <button
                            class="confirm"
                            @click=${this._confirm}>
                        ${t('proceed')}
                    </button>
                </div>
            </div>
        `;
    }
}

customElements.define('confirmation-dialog', ConfirmationDialog);