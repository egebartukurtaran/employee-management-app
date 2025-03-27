// src/router.js
import { Router } from '@vaadin/router';

// Define all application routes
export const routes = [
    {
        path: '/',
        component: 'employee-list-page',
        action: async () => {
            await import('./views/employee-list-page.js');
        }
    },
    {
        path: '/add',
        component: 'employee-form-page',
        action: async () => {
            await import('./views/employee-form-page.js');
        }
    },
    {
        path: '/edit/:id',
        component: 'employee-form-page',
        action: async () => {
            await import('./views/employee-form-page.js');
        }
    },
    // Fallback route - important for handling refreshes
    {
        path: '(.*)',
        component: 'not-found-page',
        action: async () => {
            await import('./views/not-found-page.js');
        }
    }
];

// Store the router instance globally
let routerInstance = null;

// Initialize the router
export const initRouter = (outlet) => {
    routerInstance = new Router(outlet);
    routerInstance.setRoutes(routes);
    return routerInstance;
};

// Navigation helper function
export let navigateTo = (path) => {
    if (routerInstance) {
        routerInstance.render(path, {scroll: 'preserve'});
    } else {
        console.warn('Router not initialized yet');
    }
};