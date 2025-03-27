// src/store/reducers.js
import { ActionTypes } from './actions.js';

export const employeesReducer = (state = [], action) => {
    switch (action.type) {
        case ActionTypes.ADD_EMPLOYEE:
            return [...state, action.payload];

        case ActionTypes.UPDATE_EMPLOYEE:
            return state.map(employee =>
                employee.id === action.payload.id ? action.payload : employee
            );

        case ActionTypes.DELETE_EMPLOYEE:
            return state.filter(employee => employee.id !== action.payload);

        default:
            return state;
    }
};

export const uiReducer = (state = {
    searchTerm: '',
    currentPage: 1,
    viewMode: 'table'
}, action) => {
    switch (action.type) {
        case ActionTypes.SET_SEARCH_TERM:
            return {
                ...state,
                searchTerm: action.payload,
                currentPage: 1  // Reset to first page when searching
            };

        case ActionTypes.SET_CURRENT_PAGE:
            return {
                ...state,
                currentPage: action.payload
            };

        case ActionTypes.SET_VIEW_MODE:
            return {
                ...state,
                viewMode: action.payload
            };

        default:
            return state;
    }
};

export const rootReducer = (state = {}, action) => {
    return {
        employees: employeesReducer(state.employees, action),
        ui: uiReducer(state.ui, action)
    };
};