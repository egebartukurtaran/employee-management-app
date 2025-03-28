// src/store/reducers.js
import { ActionTypes } from './actions.js';

// Handles all employee data operations
export const employeesReducer = (state = [], action) => {
    switch (action.type) {
        case ActionTypes.ADD_EMPLOYEE:
            // Add new employee to the array
            return [...state, action.payload];

        case ActionTypes.UPDATE_EMPLOYEE:
            // Replace the employee with matching id
            return state.map(employee =>
                employee.id === action.payload.id ? action.payload : employee
            );

        case ActionTypes.DELETE_EMPLOYEE:
            // Remove employee with matching id
            return state.filter(employee => employee.id !== action.payload);

        default:
            // Return unchanged state for unhandled actions
            return state;
    }
};

// Handles UI state changes (search, pagination, view mode)
export const uiReducer = (state = {
    searchTerm: '',
    currentPage: 1,
    viewMode: 'table'
}, action) => {
    switch (action.type) {
        case ActionTypes.SET_SEARCH_TERM:
            // Update search term and reset to first page
            return {
                ...state,
                searchTerm: action.payload,
                currentPage: 1  // Reset to first page when searching
            };

        case ActionTypes.SET_CURRENT_PAGE:
            // Update current page for pagination
            return {
                ...state,
                currentPage: action.payload
            };

        case ActionTypes.SET_VIEW_MODE:
            // Toggle between different view layouts
            return {
                ...state,
                viewMode: action.payload
            };

        default:
            // Return unchanged state for unhandled actions
            return state;
    }
};

// Combines all reducers into a single root reducer
export const rootReducer = (state = {}, action) => {
    return {
        employees: employeesReducer(state.employees, action),
        ui: uiReducer(state.ui, action)
    };
};