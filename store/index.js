// src/store/index.js
import { Store } from './store.js';
import { rootReducer } from './reducers.js';

// Generate mock data for initial employees
// Alternative version with more realistic data
const generateMockEmployees = () => {
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'Daniel', 'Anna', 'Ahmet', 'Meryem', 'Mehmet', 'Ayşe', 'Ali'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Wilson', 'Taylor', 'Yılmaz', 'Kaya', 'Demir', 'Şahin', 'Çelik'];
    const departments = ['Analytics', 'Tech'];
    const positions = ['Junior', 'Medior', 'Senior'];

    return firstNames.map((firstName, index) => {
        const lastName = lastNames[index];
        const id = `emp-${index + 1}`;
        const dateOfEmployment = '23/09/2022';
        const dateOfBirth = '23/09/1990';
        const phone = `+(90) 532 123 45 ${index < 9 ? '0' + (index + 1) : (index + 1)}`;
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
        const department = departments[Math.floor(Math.random() * departments.length)];
        const position = positions[Math.floor(Math.random() * positions.length)];

        return {
            id,
            firstName,
            lastName,
            dateOfEmployment,
            dateOfBirth,
            phone,
            email,
            department,
            position
        };
    });
};

const initialState = {
    employees: generateMockEmployees(),
    ui: {
        searchTerm: '',
        currentPage: 1,
        viewMode: 'table'
    }
};
export const store = new Store(rootReducer, initialState);