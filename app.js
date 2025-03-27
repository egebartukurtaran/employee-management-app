// src/app.js
import { LitElement, html, css } from 'lit';
import { initRouter } from './router.js';
import './components/app-header.js';

export class EmployeeApp extends LitElement {
    static get styles() {
        return css`
      :host {
        display: block;
        min-height: 100vh;
      }
      main {
        max-width: 1200px;
        margin: 0 auto;
        padding: 16px;
      }
    `;
    }

    firstUpdated() {
        const outlet = this.renderRoot.querySelector('#outlet');
        const router = initRouter(outlet);

        // Add this to handle manual navigation
        window.addEventListener('vaadin-router-go', (e) => {
            const path = e.detail?.pathname || '/';
            router.render(path);
        });
    }

    render() {
        return html`
      <app-header></app-header>
      <main id="outlet"></main>
    `;
    }
}

customElements.define('employee-app', EmployeeApp);