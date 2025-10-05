# Task Manager

## Project Setup

This project consists of a frontend and a backend. Below are the instructions for setting up both parts of the application.

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Configure the database connection in `src/config/db.js`.
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Start the frontend application:
   ```bash
   npm start
   ```

## Folder Structure

### Backend Folder Structure
- `src/`
  - `config/`: Contains configuration files, including database connection settings.
  - `controllers/`: Contains the logic for handling requests and responses.
  - `middleware/`: Contains middleware functions for request processing.
  - `models/`: Contains the data models for the application.
  - `routes/`: Contains the route definitions for the API endpoints.
  - `uploads/`: Directory for storing uploaded files.

### Frontend Folder Structure
- `src/`
  - `api/`: Contains API calls to the backend.
  - `components/`: Contains reusable components used throughout the application.
  - `context/`: Contains context providers for state management.
  - `hooks/`: Contains custom hooks for managing state and side effects.
  - `pages/`: Contains the main pages of the application.
  - `styles/`: Contains CSS files for styling the application.
  - `types/`: Contains TypeScript type definitions.

## Available Frontend Routes
- `/auth/login`: Login page
- `/auth/register`: Registration page
- `/dashboard`: Dashboard page
- `/profile`: User profile page
- `/tasks`: Task list page

---

This README provides a basic overview of the project setup and structure. For more detailed information, please refer to the individual files and documentation within the project.