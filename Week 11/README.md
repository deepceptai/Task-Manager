
# 🧪 Task Manager API – Week 10

This project is a backend for a task management app built with **Express.js**, **MongoDB**, and **JWT authentication**. It supports user registration, login, and CRUD operations on tasks.

---

## 📦 Setup Instructions

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node index.js
   ```
   Server will run at: `http://localhost:5000`

> No `.env` required – MongoDB URI and JWT secret are hardcoded for learning.

---

## 🔐 Authentication Flow

- **Register** → `POST /register`
- **Login** → `POST /login`
- Use returned token as Bearer token for all protected routes

---

## 🔁 API Endpoints

### 🧑 User Authentication

#### `POST /register`
- Registers a new user
- **Body:**
```json
{
  "username": "testuser",
  "password": "testpass"
}
```

#### `POST /login`
- Logs in a user and returns JWT token
- **Body:**
```json
{
  "username": "testuser",
  "password": "testpass"
}
```
- **Response:**
```json
{
  "token": "your_jwt_token"
}
```

---

### ✅ Task Routes (Require Auth Header)

Add this header:
```
Authorization: Bearer <your_token>
```

#### `GET /tasks`
- Returns all tasks

#### `GET /tasks/:id`
- Returns task by ID

#### `POST /tasks`
- Adds a new task
- **Body:**
```json
{
  "title": "New Task",
  "description": "Task details",
  "completed": false
}
```

#### `PUT /tasks/:id`
- Updates an existing task

#### `DELETE /tasks/:id`
- Deletes a task

---

## 🧪 Thunder Client Setup (or Postman)

### Create a Collection:
1. Add all routes: `/register`, `/login`, `/tasks`, etc.
2. For protected routes, add **Authorization Header**:
```
Authorization: Bearer <token_from_login>
```

### Test Order:
- ✅ Register → POST `/register`
- ✅ Login → POST `/login` (copy token)
- ✅ Use token → Access `/tasks` routes

---

## 📚 Sample Dummy Task

```json
{
  "title": "Learn Express",
  "description": "Finish Week 10 assignment",
  "completed": false
}
```

---

## 🛠 Technologies Used
- Express.js
- MongoDB (via Mongoose)
- JWT (jsonwebtoken)
- bcrypt for hashing
- CORS for cross-origin access

---

## ✅ Next Steps (Optional)
- Create React frontend to connect with this API
- Add pagination, filtering, or user-specific tasks
- Dockerize the backend

---

Happy Testing! 🚀
