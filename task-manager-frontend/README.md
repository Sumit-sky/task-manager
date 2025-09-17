# Full-Stack Task Management Application

This is a full-stack task management application built with PostgreSQL, Express, React, and Node.js, as per the case study requirements. It allows users to register, log in, and manage their personal tasks through a secure, token-based authentication system. [cite: 5]

## Technology Stack

### Backend

- **Framework**: Node.js with Express (TypeScript) [cite: 16]
- **Database**: PostgreSQL [cite: 18]
- **ORM**: Prisma [cite: 17]
- **Authentication**: JSON Web Tokens (JWT) [cite: 19]
- **Testing**: Jest + Supertest [cite: 20]

### Frontend

- **Framework**: React (Vite + TypeScript) [cite: 9]
- **Styling**: TailwindCSS [cite: 10]
- **State Management**: Redux Toolkit [cite: 11]
- **Form Handling**: React Hook Form with Zod for validation [cite: 13]
- **API Client**: Axios [cite: 12]
- **Testing**: Jest + React Testing Library [cite: 14]

## Local Setup Instructions

Follow these steps to set up and run the project on your local machine. [cite: 76]

### Prerequisites

- Node.js (v18 or later)
- npm
- PostgreSQL database running locally

### 1. Clone the Repository

Clone this repository to your local machine:
`git clone <your-repository-url>`
`cd <your-repository-folder>`

### 2. Backend Setup

Navigate to the backend directory and set up the server.

```bash
cd task-manager-backend
npm install
```

Next, create a .env file in the backend directory and add your database connection string and a JWT secret.

For ex -
DATABASE_URL="postgres://c8d1eca47a0f3161fa3adad3e5231b84d1423ee12ca9a321ebf0807521c3b88d:sk_UedntXKgbAbrXitF3cz4v@db.prisma.io:5432/postgres?sslmode=require"
JWT_SECRET="YpMPnO)<FAkS(~p0UXNh&cP1Em?R@#CcxsVp!#^u9az_Ye[z]q(6BzgEkgr!c>:"

Finally, run the database migrations to create the necessary tables:

npx prisma migrate dev

cd task-manager-frontend
npm install

Running the Application

You will need two separate terminals to run both the backend and frontend servers simultaneously

Start the Backend Server - npm run dev
Start the Frontend Server - npm run dev

Running Tests
backend tests - npm test

API Endpoint Documentation

All task-related routes are protected and require a valid JWT in the
Authorization: Bearer <token> header

Method Endpoint Protection Description

POST /api/auth/register Public
Registers a new user.

POST /api/auth/login Public
Logs in a user and returns a JWT.

GET /api/tasks Private
Fetches all tasks for the logged-in user.

POST /api/tasks Private
Creates a new task for the logged-in user.

PUT /api/tasks/:id Private
Updates a specific task for the logged-in user.

DELETE /api/tasks/:id Private
Deletes a specific task for the logged-in user.
