# Freelance Manager Backend

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Install MongoDB locally or use MongoDB Atlas

3. Update `.env` file with your MongoDB URI and JWT secret

4. Start the server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### Clients (Protected)
- GET `/api/clients` - Get all clients
- POST `/api/clients` - Create client
- PUT `/api/clients/:id` - Update client
- DELETE `/api/clients/:id` - Delete client

### Projects (Protected)
- GET `/api/projects` - Get all projects
- POST `/api/projects` - Create project
- PUT `/api/projects/:id` - Update project
- DELETE `/api/projects/:id` - Delete project

### Tasks (Protected)
- GET `/api/tasks` - Get all tasks
- POST `/api/tasks` - Create task
- PUT `/api/tasks/:id` - Update task
- DELETE `/api/tasks/:id` - Delete task

### Payments (Protected)
- GET `/api/payments` - Get all payments
- POST `/api/payments` - Create payment
- PUT `/api/payments/:id` - Update payment
- DELETE `/api/payments/:id` - Delete payment

## Authentication

All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <token>
```
