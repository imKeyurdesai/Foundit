# Foundit - Campus Lost & Found

Foundit is a full-stack web application designed to serve as a centralized lost and found portal for a campus community. It enables users to report lost items, view a dashboard of all reported items, and communicate with each other through a real-time messaging system to facilitate the return of found belongings.

## Key Features

*   **Secure User Authentication:** Register and log in securely using Firebase Authentication, with validation against a unique enrollment number.
*   **Report Lost Items:** Easily upload details of a lost item, including its name, location, category, and an image. Images are converted to Base64 and stored efficiently in Firestore.
*   **Centralized Dashboard:** View all reported lost and found items in a clean, responsive grid layout. Users can manage their own posts by marking them as "Found" or deleting them.
*   **Real-Time Search:** Instantly search for items by title, description, category, or location with a live search preview in the navigation bar.
*   **Detailed Item View:** Click on any item to see a detailed view with a larger image, location, description, and the date it was reported.
*   **Social Sharing:** Share item details easily via a share modal with options for copying the link, WhatsApp, X (Twitter), Facebook, and Email.
*   **Real-Time Messaging:** A built-in chat system allows users to find and communicate with other registered users directly on the platform to arrange item recovery.
*   **Light/Dark Theme:** A modern UI built with Tailwind CSS and DaisyUI, featuring a toggleable light and dark mode for user comfort.

## Tech Stack

*   **Frontend:** React, Vite, Tailwind CSS, DaisyUI
*   **Backend & Database:** Firebase (Authentication, Firestore)
*   **State Management:** Redux Toolkit
*   **Routing:** React Router v7

## Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

*   Node.js (v18 or newer)
*   npm

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/imkeyurdesai/Foundit.git
    ```

2.  **Navigate to the project directory:**
    ```sh
    cd Foundit
    ```

3.  **Install dependencies:**
    ```sh
    npm install
    ```

### Firebase Configuration

This project requires a Firebase project to handle authentication and data storage.

1.  Create a project on the [Firebase Console](https://console.firebase.google.com/).
2.  Enable **Authentication** (Email/Password provider) and **Firestore Database**.
3.  In your Firebase project settings, find your web app's configuration.
4.  Create a file named `.env` in the root of the project directory.
5.  Add your Firebase credentials to the `.env` file. Refer to `src/components/firebase.js` for the required variables:

    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_project_id
    ```

## Available Scripts

In the project directory, you can run the following commands:

*   **`npm run dev`**
    Runs the app in development mode. Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

*   **`npm run dev-host`**
    Runs the development server and exposes it to your local network.

*   **`npm run build`**
    Builds the app for production to the `dist` folder.

*   **`npm run lint`**
    Lints the project files using ESLint.

*   **`npm run preview`**
    Serves the production build locally to preview it.

## Project Structure

The application code is organized within the `src` directory:

*   **`/assets`**: Static assets like images and icons.
*   **`/components`**: Reusable React components (e.g., `InputText`, `Navber`, `SearchPreview`).
*   **`/layout`**: Main application layout and routing configuration (`router.jsx`).
*   **`/pages`**: Top-level page components corresponding to different routes (e.g., `Dashboard`, `Login`, `Message`).
*   **`/store`**: Redux Toolkit setup, including the store configuration and slices (`bucketSlice`, `messageSlice`).