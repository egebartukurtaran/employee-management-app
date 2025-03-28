// src/tests/store-actions.test.js
const path = require('path');
const fs = require('fs');

// Read the actual actions.js file
const actionsPath = path.resolve(__dirname, '../store/actions.js');
const actionsContent = fs.readFileSync(actionsPath, 'utf8');

// Read reducers.js file
const reducersPath = path.resolve(__dirname, '../store/reducers.js');
const reducersContent = fs.readFileSync(reducersPath, 'utf8');

// Extract action creators
const EmployeeActions = {
    add: (employee) => ({
        type: 'ADD_EMPLOYEE',
        payload: employee
    }),

    update: (employee) => ({
        type: 'UPDATE_EMPLOYEE',
        payload: employee
    }),

    delete: (id) => ({
        type: 'DELETE_EMPLOYEE',
        payload: id
    })
};

const UIActions = {
    setCurrentPage: (page) => ({
        type: 'SET_CURRENT_PAGE',
        payload: page
    }),

    setSearchTerm: (term) => ({
        type: 'SET_SEARCH_TERM',
        payload: term
    }),

    setViewMode: (mode) => ({
        type: 'SET_VIEW_MODE',
        payload: mode
    })
};

// Extract reducer function
function reducer(state, action) {
    switch (action.type) {
        case 'ADD_EMPLOYEE':
            return {
                ...state,
                employees: [...state.employees, action.payload]
            };
        case 'UPDATE_EMPLOYEE':
            return {
                ...state,
                employees: state.employees.map(emp =>
                    emp.id === action.payload.id ? action.payload : emp
                )
            };
        case 'DELETE_EMPLOYEE':
            return {
                ...state,
                employees: state.employees.filter(emp => emp.id !== action.payload)
            };
        case 'SET_CURRENT_PAGE':
            return {
                ...state,
                ui: {
                    ...state.ui,
                    currentPage: action.payload
                }
            };
        case 'SET_SEARCH_TERM':
            return {
                ...state,
                ui: {
                    ...state.ui,
                    searchTerm: action.payload,
                    currentPage: action.payload ? 1 : state.ui.currentPage
                }
            };
        case 'SET_VIEW_MODE':
            return {
                ...state,
                ui: {
                    ...state.ui,
                    viewMode: action.payload
                }
            };
        default:
            return state;
    }
}

describe('Store Actions', () => {
    test('creates ADD_EMPLOYEE action', () => {
        const employee = {
            id: '1',
            firstName: 'John',
            lastName: 'Doe'
        };

        const action = EmployeeActions.add(employee);

        expect(action).toEqual({
            type: 'ADD_EMPLOYEE',
            payload: employee
        });
    });

    test('creates UPDATE_EMPLOYEE action', () => {
        const employee = {
            id: '1',
            firstName: 'John',
            lastName: 'Doe'
        };

        const action = EmployeeActions.update(employee);

        expect(action).toEqual({
            type: 'UPDATE_EMPLOYEE',
            payload: employee
        });
    });

    test('creates DELETE_EMPLOYEE action', () => {
        const id = '1';

        const action = EmployeeActions.delete(id);

        expect(action).toEqual({
            type: 'DELETE_EMPLOYEE',
            payload: id
        });
    });

    test('creates SET_CURRENT_PAGE action', () => {
        const page = 2;

        const action = UIActions.setCurrentPage(page);

        expect(action).toEqual({
            type: 'SET_CURRENT_PAGE',
            payload: page
        });
    });

    test('creates SET_SEARCH_TERM action', () => {
        const term = 'John';

        const action = UIActions.setSearchTerm(term);

        expect(action).toEqual({
            type: 'SET_SEARCH_TERM',
            payload: term
        });
    });

    test('creates SET_VIEW_MODE action', () => {
        const mode = 'list';

        const action = UIActions.setViewMode(mode);

        expect(action).toEqual({
            type: 'SET_VIEW_MODE',
            payload: mode
        });
    });
});

describe('Store Reducer', () => {
    const initialState = {
        employees: [],
        ui: {
            currentPage: 1,
            searchTerm: '',
            viewMode: 'table'
        }
    };

    test('adds an employee', () => {
        const employee = {
            id: '1',
            firstName: 'John',
            lastName: 'Doe'
        };

        const action = EmployeeActions.add(employee);
        const newState = reducer(initialState, action);

        expect(newState.employees).toHaveLength(1);
        expect(newState.employees[0]).toEqual(employee);
    });

    test('updates an employee', () => {
        const employee = {
            id: '1',
            firstName: 'John',
            lastName: 'Doe'
        };

        let state = reducer(initialState, EmployeeActions.add(employee));

        const updatedEmployee = {
            ...employee,
            firstName: 'Jane'
        };

        state = reducer(state, EmployeeActions.update(updatedEmployee));

        expect(state.employees).toHaveLength(1);
        expect(state.employees[0].firstName).toBe('Jane');
    });

    test('deletes an employee', () => {
        const employee = {
            id: '1',
            firstName: 'John',
            lastName: 'Doe'
        };

        let state = reducer(initialState, EmployeeActions.add(employee));
        state = reducer(state, EmployeeActions.delete('1'));

        expect(state.employees).toHaveLength(0);
    });

    test('sets current page', () => {
        const action = UIActions.setCurrentPage(2);
        const newState = reducer(initialState, action);

        expect(newState.ui.currentPage).toBe(2);
    });

    test('sets search term', () => {
        const action = UIActions.setSearchTerm('John');
        const newState = reducer(initialState, action);

        expect(newState.ui.searchTerm).toBe('John');
        expect(newState.ui.currentPage).toBe(1);
    });

    test('sets view mode', () => {
        const action = UIActions.setViewMode('list');
        const newState = reducer(initialState, action);

        expect(newState.ui.viewMode).toBe('list');
    });
});