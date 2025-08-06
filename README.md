# Terminal Operating System

This project is a web-based terminal operating system for managing container logistics. It is built with a React frontend and a Node.js backend.

## Features

- System of container localization (GTC)
- Digital container structure display
- Ship structure integration via BAPLIE
- EDI Hub (Electronic Data Interchange)
- Digital Container Damage Report (CDR)
- Digital customs inspection (Visite Douanière)
- Task tracking dashboard
- Modernized container history interface
- Truck Appointment System (TAS)
- TAS dual interface

## Prerequisites

- Node.js (v18 or later)
- npm
- PostgreSQL

## Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install frontend dependencies:**

    ```bash
    cd frontend
    npm install
    ```

3.  **Install backend dependencies:**

    ```bash
    cd ../backend
    npm install
    ```

4.  **Set up environment variables:**

    -   In the `backend` directory, create a `.env` file and add the following:

        ```
        DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database>"
        ```

5.  **Set up the database:**

    -   In the `backend` directory, run the following command to create the database schema:

        ```bash
        npx prisma db push
        ```

## Usage

1.  **Start the backend server:**

    ```bash
    cd backend
    npm run dev
    ```

2.  **Start the frontend development server:**

    ```bash
    cd ../frontend
    npm run dev
    ```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:3001`.
