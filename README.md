# 🚀 TaskHub - Professional Project Management System

TaskHub is a robust, full-stack project management platform designed to help teams stay organized and track their productivity in real-time. Built with the latest technologies like **React Router 7**, **TypeScript**, and **Node.js**.

🔗 **Live Demo:** [https://task-hub-frontend-coral.vercel.app/](https://task-hub-frontend-coral.vercel.app/)

---

## ✨ Features

- **Personalized Dashboard:** Visual statistics using Recharts including Line Charts, Pie Charts, and Bar Charts.
- **Workspace Management:** Create, manage, and invite members to dedicated workspaces.
- **Project Tracking:** Real-time project progress bars and status management.
- **Task Management:** Categorized task lists (Overdue, Today, Upcoming) with priority levels.
- **Security:** Secure authentication including 2FA (Two-Factor Authentication) and OTP verification.
- **Team Collaboration:** Invite members via unique codes and manage roles within the team.
- **Responsive Design:** Fully optimized for Mobile, Tablet, and Desktop views.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React Router 7 (SSR & Type-Safe Routing).
- **Styling:** Tailwind CSS & Shadcn UI.
- **State Management:** TanStack Query (React Query) v5.
- **Forms:** React Hook Form & Zod Validation.
- **Charts:** Recharts.
- **Icons:** Lucide React.

### Backend
- **Environment:** Node.js & Express.
- **Database:** MongoDB with Mongoose ODM.
- **Communication:** Socket.io for real-time updates.
- **Email:** SMTP for OTP and notifications.
- **Storage:** Cloudinary for profile and project assets.

---

## ⚙️ Installation & Setup

To run TaskHub locally, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/mahdi-darvishi/TaskHub.git
cd TaskHub
```
### 2. Backend Setup
```
cd backend
npm install
# Configure your .env file
npm run dev
```
### 3. Frontend Setup
```
cd frontend
npm install
# Configure your .env file
npm run dev
```
🔑 Environment Variables Backend (/backend/.env)
```
PORT = 5000
MONGODB_URI = your_mongodb_connection_string
JWT_SECRET = your_secret_key
FRONTEND_URL = http://localhost:5173

# Email Service (SMTP)
SMTP_HOST = your_smtp_host
SMTP_PORT = your_smtp_port
SMTP_EMAIL = your_email
SMTP_PASSWORD = your_password

# Cloudinary
CLOUDINARY_CLOUD_NAME = your_cloud_name
CLOUDINARY_API_KEY = your_api_key
CLOUDINARY_API_SECRET = your_api_secret
```
Frontend (/frontend/.env)
```
VITE_API_URL = http://localhost:5000/api-v1
VITE_BACKEND_URL = http://localhost:5000
```


## 👤 Author

**Mehdi Darvishi**  
📧 Email: mehdidarvishi2004@gmail.com
