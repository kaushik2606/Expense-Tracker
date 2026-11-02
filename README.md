# Expense Tracker Frontend

This is the React frontend for the Expense Tracker application. It provides a clean, responsive dashboard for users to register, sign in, manage income and expenses, and view profile information.

## Features

- User authentication and protected routes
- Dashboard overview for income and expense tracking
- Add, edit, and remove income records
- Add, edit, and remove expense records
- Profile management and session handling
- Bootstrap-based responsive UI

## Tech Stack

- React 19
- React Router DOM
- Bootstrap 5
- Axios for API calls
- Create React App

## Project Structure

```text
expense_tracker/
├── public/
├── src/
│   ├── components/
│   ├── context/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   └── index.js
├── package.json
├── README.md
└── .gitignore
```

## Prerequisites

- Node.js 18+ recommended
- npm or yarn
- The backend must be running locally

## Setup

1. Open a terminal in the frontend folder:

```bash
cd expense_tracker
```

2. Install dependencies:

```bash
npm install
```

3. Start the frontend in development mode:

```bash
npm start
```

The application will run at:

```text
http://localhost:3000
```

## Environment Variables

This frontend uses the backend API base URL. You can override the default value in a local `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

If you do not set it, the app will default to:

```text
http://localhost:5000/api
```

## Available Scripts

```bash
npm start
npm run build
npm test
npm run eject
```

## Notes

- The frontend expects the backend service to be running before user authentication and transaction APIs can work.
- Protected pages redirect users to `/login` if no valid session is present.
- Auth tokens are stored locally in the browser for session persistence.
