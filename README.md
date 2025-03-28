# Employee Management Application

A web application built with Lit Element and Vaadin Router for managing employee information. This application allows HR staff to view, add, edit, and delete employee records, with support for multiple languages.

## Features

- 🔍 View all employee records in table or card view
- ➕ Add new employee records
- ✏️ Edit existing employee records
- 🗑️ Delete employee records
- 🌐 Multi-language support (English/Turkish)
- 📱 Responsive design for mobile and desktop
- 🔍 Search functionality for employees
- 📄 Pagination support

## Technologies

- **LitElement**: Web components framework
- **Vaadin Router**: Client-side routing
- **Redux Pattern**: Custom store implementation
- **Responsive Design**: Mobile-friendly UI without external libraries
- **Web Dev Server**: Local development server with history API fallback

## Project Structure
employee-management-app/
├── index.html
├── web-dev-server.config.js
├── package.json
├── src/
│   ├── index.js
│   ├── app.js
│   ├── router.js
│   ├── components/
│   │   ├── app-header.js
│   │   ├── confirmation-dialog.js
│   │   ├── pagination-control.js
│   │   └── search-input.js
│   ├── views/
│   │   ├── employee-list-page.js
│   │   ├── employee-form-page.js
│   │   └── not-found-page.js
│   ├── store/
│   │   ├── index.js
│   │   ├── actions.js
│   │   ├── reducers.js
│   │   ├── store.js
│   │   └── connect.js
│   └── localization/
│       ├── translations.js
│       ├── en.js
│       └── tr.js
└── public/
└── ing.webp

## Getting Started

### Prerequisites

- Node.js 14.x or later
- npm 6.x or later

### Installation

1. Clone the repository
   - git clone https://github.com/egebartukurtaran/employee-management-app.git
   - cd employee-management-app
2. Install dependencies
   - npm install
3. Start the development server 
   - npm start
4. Open your browser to http://localhost:8000

## Usage

### View Employees

The main page displays a list of all employees. You can:
- Switch between table and card views using the toggle buttons
- Search for employees using the search input
- Navigate through pages using the pagination controls

### Add Employee

1. Click the "Add New" button in the header
2. Fill in the required employee information
3. Click "Save" to add the employee to the system

### Edit Employee

1. Click the edit icon next to an employee in the list
2. Update the employee information in the form
3. Click "Update" to save the changes

### Delete Employee

1. Click the delete icon next to an employee in the list
2. Confirm the deletion in the confirmation dialog

### Change Language

Click the language flag icon in the header to switch between English and Turkish.

### Running Tests
  -npm test
  