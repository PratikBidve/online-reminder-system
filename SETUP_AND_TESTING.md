# Online Reminder System — Setup & Testing Guide

This guide will help you set up, run, and test the Online Reminder System (Express.js + React + MongoDB).

---

## Prerequisites
- Node.js (v18+ recommended)
- npm
- MongoDB (local or Atlas)

---

## 1. Backend Setup (Express.js + TypeScript)

### a. Install dependencies
```sh
cd backend
npm install
```

### b. Configure environment variables
Edit `backend/.env` with your MongoDB URI, JWT secret, and SMTP credentials:
```
MONGO_URI=mongodb://localhost:27017/reminder-app
JWT_SECRET=your_jwt_secret_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password_or_app_password
```

### c. Start MongoDB
- If using local MongoDB, run:
  ```sh
  mongod
  ```
- If using MongoDB Atlas, update `MONGO_URI` in `.env` accordingly.

### d. Start backend server
```sh
npm run dev
```
- The API will run at `http://localhost:4000`

---

## 2. Frontend Setup (React + Vite)

### a. Install dependencies
```sh
cd frontend
npm install
```

### b. Start frontend dev server
```sh
npm run dev
```
- The app will run at `http://localhost:5173` (default)

---

## 3. Testing the Application

### a. Sign Up
- Go to `/signup` in the frontend app.
- Register a new user.

### b. Log In
- Go to `/` (login page).
- Enter your credentials and log in.

### c. Reminders
- After login, you’ll be redirected to `/reminders`.
- Add a new reminder (title, description, date/time).
- View your upcoming reminders.
- Delete reminders as needed.

### d. Email Notification
- At the scheduled time, check your email for the reminder notification.
- Ensure SMTP credentials are correct for email delivery.

---

## 4. Troubleshooting
- If you see errors about missing modules, run `npm install` in both `backend` and `frontend` folders.
- If MongoDB connection fails, check your URI and that MongoDB is running.
- For email issues, verify SMTP credentials and allow access for less secure apps if using Gmail.
- Restart VS Code if TypeScript errors persist after installing dependencies.

---

## 5. Useful Commands
- Install a new package: `npm install <package>`
- Rebuild TypeScript: `npm run build` (backend)
- Stop servers: `Ctrl+C` in terminal

---

## 6. Project Structure
```
/Users/prateekbidve/Desktop/notebook-renderer-react-sample/
├── backend/        # Express.js API
├── frontend/       # React Vite app
├── README.md       # Project overview
├── SETUP_AND_TESTING.md # This guide
```

---

For any issues, copy error messages and ask for help!
