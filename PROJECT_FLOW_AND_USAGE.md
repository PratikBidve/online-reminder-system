# Online Reminder System — Project Flow & Usage Instructions

## Overview
This project is a full-stack web application that allows users to create, manage, and receive reminders via email notifications. It uses:
- **Backend:** Express.js (TypeScript, MongoDB, JWT, Nodemailer)
- **Frontend:** React (Vite, TypeScript)

---

## How the System Works (End-to-End Flow)

### 1. User Registration (Sign Up)
- User visits `/signup` page on the frontend.
- Fills in name, email, and password.
- Frontend sends a POST request to `/api/auth/signup` on the backend.
- Backend hashes the password, creates a new user in MongoDB, and responds with a success message.

### 2. User Login
- User visits `/` (login page) and enters email and password.
- Frontend sends a POST request to `/api/auth/login`.
- Backend verifies credentials:
  - If valid, backend returns a JWT token.
  - If invalid, backend returns an error message.
- Frontend stores the JWT token in localStorage and redirects to `/reminders`.

### 3. Creating a Reminder
- On `/reminders`, user fills in title, description, and date/time.
- Frontend sends a POST request to `/api/reminders` with JWT in the Authorization header.
- Backend verifies the token, saves the reminder in MongoDB, and responds with the new reminder.

### 4. Viewing Reminders
- On `/reminders`, frontend fetches reminders from `/api/reminders` (GET) with JWT.
- Backend returns all upcoming reminders for the logged-in user.
- Frontend displays the list.

### 5. Deleting a Reminder
- User clicks delete on a reminder.
- Frontend sends a DELETE request to `/api/reminders/:id` with JWT.
- Backend verifies the token and deletes the reminder from MongoDB.

### 6. Email Notification
- A background process (to be implemented, e.g., with a cron job or setInterval) checks for reminders whose time has arrived.
- When a reminder is due, backend uses Nodemailer to send an email to the user.

---

## Usage Instructions (Step-by-Step)

1. **Start MongoDB** (local or Atlas)
2. **Start Backend**
   - `cd backend`
   - `npm install`
   - Configure `.env` (see SETUP_AND_TESTING.md)
   - `npm run dev`
3. **Start Frontend**
   - `cd frontend`
   - `npm install`
   - `npm run dev`
4. **Register a User**
   - Go to `http://localhost:5173/signup`
   - Fill in details and sign up
5. **Log In**
   - Go to `http://localhost:5173/`
   - Enter credentials and log in
6. **Create Reminders**
   - Go to `/reminders` (auto-redirect after login)
   - Add reminders
7. **Check Email**
   - When a reminder is due, check your email for a notification

---

## Notes
- All API requests requiring authentication must include the JWT token in the `Authorization` header as `Bearer <token>`.
- If you see errors, check the browser console, network tab, and backend terminal for details.
- For email notifications to work, SMTP credentials in `.env` must be valid.

---

For more troubleshooting and setup, see `SETUP_AND_TESTING.md`.
