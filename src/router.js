// src/router.js
// Router configuration and navigation utilities for the application
// Handles lazy-loading of components and routing between app views

import { Router } from '@vaadin/router'; // Vaadin router library for web components

/**
 * Define all application routes
 * Each route has a path, component name, and lazy-loading action
 */
export const routes = [
    {
        path: '/',
        component: 'employee-list-page', // Custom element tag name
        action: async () => {
            // Lazy-load the employee list component when this route is accessed
            await import('./views/employee-list-page.js');
        }
    },
    {
        path: '/add',
        component: 'employee-form-page', // Form component for adding
        action: async () => {
            // Lazy-load the employee form component
            await import('./views/employee-form-page.js');
        }
    },
    {
        path: '/edit/:id',
        component: 'employee-form-page', // Same form for editing
        action: async () => {
            // Lazy-load the employee form component
            // The :id parameter will be passed to the component
            await import('./views/employee-form-page.js');
        }
    },
    // Fallback route for handling 404s and invalid URLs
    {
        path: '(.*)', // Match any unmatched route with regex
        component: 'not-found-page', // 404 page component
        action: async () => {
            // Lazy-load the not found page component
            await import('./views/not-found-page.js');
        }
    }
];

// Store the router instance globally for app-wide access
let routerInstance = null;

/**
 * Initialize the router with the DOM outlet element
 * @param {Element} outlet - DOM element where route components will render
 * @returns {Router} - The router instance
 */
export const initRouter = (outlet) => {
    routerInstance = new Router(outlet);
    routerInstance.setRoutes(routes);
    return routerInstance;
};

/**
 * Navigation helper function to change routes programmatically
 * @param {string} path - The path to navigate to
 */
export let navigateTo = (path) => {
    if (routerInstance) {
        routerInstance.render(path, {scroll: 'preserve'}); // Keep scroll position during navigation
    } else {
        console.warn('Router not initialized yet');
    }
};