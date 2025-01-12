# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Client Directory - README

## Overview

The `client` directory contains the frontend application for a real estate platform, built with modern web technologies. This application allows users to browse, search, and manage property listings, and includes authentication and user profile features.

## Tech Stack

- **React**: For building the user interface.
- **Redux**: For state management.
- **Firebase**: For backend services (authentication and database).
- **Tailwind CSS**: For styling.
- **Vite**: For a fast development environment.
- **PostCSS**: For CSS processing.

---

## Directory Structure

### 1. **Public**

Contains static assets like images and `index.html` for the application.

- `estate.png`: Default image for estate-related visuals.
- `page-not-found.png`: Image for the 404 "Page Not Found" screen.

### 2. **Source (src)**

Contains the main application logic, components, pages, styles, and helper utilities.

#### **Key Files and Folders:**

- `.env`: Environment variables for secure and configurable project settings.
- `App.jsx`: Root component that handles application routing.
- `index.css`: Global styles.
- `main.jsx`: Application entry point.

#### **Assets**:

A folder for storing additional images, icons, or other media.

#### **Components**:

Reusable UI components to structure the application.

- `Contact.jsx`: Contact form and details component.
- `Footer.jsx`: Footer section of the app.
- `Header.jsx`: Navigation header for the app.
- `ListingItem.jsx`: Component for displaying individual listings.
- `OAuth.jsx`: Handles OAuth integration for authentication.
- `PrivateRoute.jsx`: Protects routes that require user authentication.

#### **Firebase**:

- `firebase.js`: Firebase configuration and initialization file.

#### **Helper**:

Utility functions for the application.

- `unit.js`: Functions for converting and formatting units.

#### **Pages**:

Route-based components representing different sections of the app.

- `About.jsx`: Information about the platform.
- `CreateListing.jsx`: Page for users to create a new listing.
- `Home.jsx`: Main landing page.
- `Listing.jsx`: Detailed view of a specific property listing.
- `Notfound.jsx`: 404 page for undefined routes.
- `Profile.jsx`: User profile page.
- `Search.jsx`: Page for searching and filtering listings.
- `Signin.jsx`: User login page.
- `Signup.jsx`: User registration page.
- `UpdateListing.jsx`: Page for editing existing listings.

#### **Redux**:

Handles application state using Redux.

- `store.js`: Centralized store for the application.
- `user/`: Contains the `userSlice.js` file, which manages user-related state.

---

### 3. **Configuration Files**

- `.gitignore`: Specifies files and folders to ignore in Git.
- `eslint.config.js`: ESLint configuration for code linting.
- `postcss.config.js`: PostCSS configuration for CSS processing.
- `tailwind.config.js`: Tailwind CSS configuration.
- `vite.config.js`: Vite configuration for development and build settings.

---

### 4. **Dependencies**

Refer to the `package.json` file for the complete list of dependencies and scripts.

---

## How to Run the Project

### Prerequisites

- Node.js (v16 or above)
- npm or yarn installed
- Firebase project setup

### Steps:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   - Add your Firebase configuration.
   - Example:
     ```env
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open the app in your browser:
   - Navigate to `http://localhost:5173`.

---

## Scripts

- **`npm run dev`**: Start the development server.
- **`npm run build`**: Build the app for production.
- **`npm run lint`**: Run linting on the codebase.
- **`npm run preview`**: Preview the production build.

---

## Features

- User authentication (email/password and OAuth).
- Dynamic property listings with search and filters.
- Profile management.
- CRUD operations for property listings.
- Responsive design with Tailwind CSS.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Author

**Richard Essuman**
Email: ressuman001@gmail.com

For any questions or suggestions, feel free to reach out!
