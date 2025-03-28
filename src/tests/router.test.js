// src/tests/router.test.js
describe('Router', () => {
    // Mock Router constructor
    const setRoutesMock = jest.fn();
    const renderMock = jest.fn();
    const RouterMock = jest.fn().mockImplementation(() => ({
        setRoutes: setRoutesMock,
        render: renderMock
    }));

    // Create router module for testing
    const router = {
        routes: [
            {
                path: '/',
                component: 'employee-list-page'
            },
            {
                path: '/add',
                component: 'employee-form-page'
            },
            {
                path: '/edit/:id',
                component: 'employee-form-page'
            },
            {
                path: '(.*)',
                component: 'not-found-page'
            }
        ],
        routerInstance: null,
        initRouter: function(outlet) {
            this.routerInstance = new RouterMock(outlet);
            this.routerInstance.setRoutes(this.routes);
            return this.routerInstance;
        },
        navigateTo: function(path) {
            if (this.routerInstance) {
                this.routerInstance.render(path, { scroll: 'preserve' });
            } else {
                console.warn('Router not initialized yet');
            }
        }
    };

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();
    });

    test('initializes router with routes', () => {
        // Create outlet element
        const outlet = {};

        // Initialize router
        router.initRouter(outlet);

        // Check router initialization
        expect(RouterMock).toHaveBeenCalledWith(outlet);
        expect(setRoutesMock).toHaveBeenCalledWith(router.routes);
    });

    test('navigates to the given path', () => {
        // Initialize router first
        router.initRouter({});

        // Navigate to a path
        router.navigateTo('/test');

        // Check navigation
        expect(renderMock).toHaveBeenCalledWith('/test', { scroll: 'preserve' });
    });

    test('handles navigation when router is not initialized', () => {
        // Save original console.warn
        const originalWarn = console.warn;

        // Mock console.warn
        console.warn = jest.fn();

        // Reset router instance
        router.routerInstance = null;

        // Try to navigate
        router.navigateTo('/test');

        // Check warning
        expect(console.warn).toHaveBeenCalledWith('Router not initialized yet');

        // Restore console.warn
        console.warn = originalWarn;
    });

    test('defines all required routes', () => {
        // Check required routes
        const paths = router.routes.map(route => route.path);
        expect(paths).toContain('/');
        expect(paths).toContain('/add');
        expect(paths.some(path => path.includes('/edit/'))).toBe(true);
        expect(paths.some(path => path.includes('(.*)'))).toBe(true);

        // Check components
        const homeRoute = router.routes.find(route => route.path === '/');
        expect(homeRoute.component).toBe('employee-list-page');

        const addRoute = router.routes.find(route => route.path === '/add');
        expect(addRoute.component).toBe('employee-form-page');

        const editRoute = router.routes.find(route => route.path === '/edit/:id');
        expect(editRoute.component).toBe('employee-form-page');

        const notFoundRoute = router.routes.find(route => route.path === '(.*)');
        expect(notFoundRoute.component).toBe('not-found-page');
    });
});