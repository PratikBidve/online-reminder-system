
# Online Reminder System

An end-to-end web application to create, manage, and receive reminders via email notifications.

---

## Features
- User Authentication (Sign up, Log in, Account Management)
- Create Reminders (Title, Description, Date/Time)
- View Upcoming Reminders
- Email Notifications at scheduled times

---

## Tech Stack
- **Backend:** Express.js (TypeScript, MongoDB, JWT, Nodemailer)
- **Frontend:** React (Vite, TypeScript)
- **Email:** Nodemailer (Gmail SMTP)

---

## Project Structure
```
notebook-renderer-react-sample/
├── backend/        # Express.js API
├── frontend/       # React Vite app
├── README.md       # Project overview (this file)
├── SETUP_AND_TESTING.md # Setup & testing guide
├── PROJECT_FLOW_AND_USAGE.md # Project flow & usage
```

---

## Getting Started

### 1. Prerequisites
- Node.js (v18+ recommended)
- npm
- MongoDB (local or Atlas)

### 2. Backend Setup
```
cd backend
npm install
```
Edit `.env` with your MongoDB URI, JWT secret, and Gmail SMTP credentials (use a Gmail App Password!):
```
MONGO_URI=mongodb://localhost:27017/reminder-app
JWT_SECRET=your_jwt_secret_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_char_app_password
```
Start MongoDB (if local):
```
mongod
```
Start backend server:
```
npm run dev
```

### 3. Frontend Setup
```
cd frontend
npm install
npm run dev
```
The app will run at `http://localhost:5173` (default)

---

## Usage
1. Go to `/signup` and register a new user.
2. Log in at `/`.
3. Create reminders at `/reminders`.
4. You will receive email notifications at the scheduled time.

---

## Troubleshooting
- If you see errors about missing modules, run `npm install` in both `backend` and `frontend` folders.
- If MongoDB connection fails, check your URI and that MongoDB is running.
- For email issues, verify SMTP credentials and use a Gmail App Password (not your main password).
- Restart VS Code if TypeScript errors persist after installing dependencies.
- Check backend logs for detailed error messages.

---

## Security Notes
- Never commit your `.env` file or credentials to version control.
- Always use an app password for Gmail SMTP.

---

## Documentation
- See `SETUP_AND_TESTING.md` for step-by-step setup and testing.
- See `PROJECT_FLOW_AND_USAGE.md` for a detailed project flow and usage guide.

---

## License
MIT
