# Nivasa Society Management System - Frontend

## Overview
This is the frontend application for the Nivasa Society Management System, built with React and Vite.

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
# or
yarn install
```

### 2. Configure Environment Variables
```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your specific configuration
```

### Available Environment Variables
- `VITE_APP_API_URL`: Backend API URL (default: http://localhost:5000)
- `VITE_APP_PORT`: Development server port (default: 5173)
- `VITE_APP_ENV`: Environment name (development/production)
- `VITE_APP_TITLE`: Application title
- `VITE_APP_DESCRIPTION`: Application description
- `VITE_APP_MAX_FILE_SIZE`: Maximum file upload size
- `VITE_APP_ENABLE_NOTIFICATIONS`: Enable/disable notifications feature
- `VITE_APP_ENABLE_DARK_MODE`: Enable/disable dark mode feature

### 3. Start Development Server
```bash
npm run dev
# or
yarn dev
```

### 4. Build for Production
```bash
npm run build
# or
yarn build
```

## Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run lint`: Run ESLint
- `npm run preview`: Preview production build locally

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
