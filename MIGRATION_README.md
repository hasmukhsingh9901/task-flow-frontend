# TaskFlow Migration: Context API to Redux Toolkit

## Overview
This project has been successfully migrated from React Context API to Redux Toolkit for better state management and improved performance.

## Changes Made

### 1. Environment Configuration
- Created `.env` file with `VITE_API_BASE_URL=https://task-flow-backend-3816.onrender.com`
- Centralized API configuration in `src/services/api.js`

### 2. Redux Toolkit Setup
- Installed `@reduxjs/toolkit` and `react-redux`
- Created Redux store in `src/store/store.js`
- Implemented three slices:
  - `authSlice.js` - Authentication state management
  - `taskSlice.js` - Task CRUD operations
  - `userSlice.js` - User management and logs

### 3. API Service Layer
- Created centralized API service in `src/services/api.js`
- Implemented axios interceptors for automatic token management
- Separated auth and task API calls for better organization

### 4. Component Updates
All components have been updated to use Redux instead of Context:

#### Authentication Components
- **Login.jsx**: Now uses `useDispatch` and `useSelector` with Redux actions
- **Register.jsx**: Updated to use Redux for registration
- **Navbar.jsx**: Uses Redux for user state and logout
- **ProtectedRoute.jsx**: Updated to use Redux auth state

#### Task Management Components
- **TaskList.jsx**: Uses Redux for task fetching, creation, and deletion
- **TaskForm.jsx**: Updated to use Redux for task operations
- **Dashboard.jsx**: Uses Redux for user state

#### Admin Components
- **AdminDashboard.jsx**: Uses Redux for user management
- **UserLogs.jsx**: Updated to use Redux for log operations

### 5. Removed Files
- `src/context/AuthContext.jsx` - Replaced with Redux auth slice
- `src/context/TaskContext.jsx` - Replaced with Redux task slice

## Benefits of Migration

### 1. Better State Management
- Centralized state management with Redux DevTools support
- Predictable state updates with immutable state
- Better debugging capabilities

### 2. Performance Improvements
- Reduced re-renders with selective state subscriptions
- Optimized state updates with Redux Toolkit's Immer integration
- Better code splitting and lazy loading support

### 3. Developer Experience
- Type-safe actions with Redux Toolkit
- Built-in async thunk support for API calls
- Better error handling and loading states

### 4. Maintainability
- Separated concerns with dedicated slices
- Centralized API configuration
- Environment-based configuration

## File Structure

```
src/
├── store/
│   ├── store.js              # Redux store configuration
│   └── slices/
│       ├── authSlice.js      # Authentication state
│       ├── taskSlice.js      # Task management state
│       └── userSlice.js      # User management state
├── services/
│   └── api.js               # Centralized API service
├── components/              # Updated components using Redux
└── main.jsx                # Updated with Redux Provider
```

## Environment Variables

Create a `.env` file in the root directory:
```
VITE_API_BASE_URL=https://task-flow-backend-3816.onrender.com
```

## Usage

The application now uses Redux for all state management. Components access state using `useSelector` and dispatch actions using `useDispatch`:

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/slices/authSlice';

const MyComponent = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  
  const handleLogin = () => {
    dispatch(loginUser({ email, password }));
  };
};
```

## API Configuration

All API calls are now centralized in `src/services/api.js` with automatic token management and error handling. 