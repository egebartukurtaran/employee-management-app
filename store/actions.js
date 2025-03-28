// Action type constants used throughout the app
export const ActionTypes = {
    // Employee actions
    ADD_EMPLOYEE: 'ADD_EMPLOYEE',
    UPDATE_EMPLOYEE: 'UPDATE_EMPLOYEE',
    DELETE_EMPLOYEE: 'DELETE_EMPLOYEE',

    // UI actions
    SET_SEARCH_TERM: 'SET_SEARCH_TERM',
    SET_CURRENT_PAGE: 'SET_CURRENT_PAGE',
    SET_VIEW_MODE: 'SET_VIEW_MODE'
};

// Action creators for employee management operations
export const EmployeeActions = {
    add: (employee) => ({
        type: ActionTypes.ADD_EMPLOYEE,
        payload: employee
    }),

    update: (employee) => ({
        type: ActionTypes.UPDATE_EMPLOYEE,
        payload: employee
    }),

    delete: (id) => ({
        type: ActionTypes.DELETE_EMPLOYEE,
        payload: id
    })
};

// Action creators for UI state changes
export const UIActions = {
    setSearchTerm: (term) => ({
        type: ActionTypes.SET_SEARCH_TERM,
        payload: term
    }),

    setCurrentPage: (page) => ({
        type: ActionTypes.SET_CURRENT_PAGE,
        payload: page
    }),

    setViewMode: (mode) => ({
        type: ActionTypes.SET_VIEW_MODE,
        payload: mode
    })
};