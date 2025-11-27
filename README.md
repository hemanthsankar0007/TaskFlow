App Live on : https://taskflow-eight-peach.vercel.app/


# ⚡ TaskFlow - Employee Task Management System

A modern, full-stack task management application built with the MERN stack, featuring drag-and-drop functionality, JWT authentication, and a beautiful glassmorphic UI.

![TaskFlow Banner](https://img.shields.io/badge/TaskFlow-MERN%20Stack-blue?style=for-the-badge)

---

## 🚀 Features

- **Kanban Board**: Drag-and-drop tasks between Pending, In Progress, and Completed columns
- **Task Management**: Create, edit, delete, and assign tasks to employees
- **Authentication**: JWT-based authentication with guest mode
- **Employee Management**: View employee profiles and assigned tasks
- **Real-time Updates**: Optimistic UI updates for smooth user experience
- **Glassmorphic UI**: Modern design with 3D effects and animations
- **Responsive Design**: Works seamlessly on desktop and mobile devices

---

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0** - UI library
- **Vite 6.0.5** - Build tool and dev server
- **React Router 7.9.6** - Client-side routing
- **Tailwind CSS 3.4.14** - Utility-first CSS framework
- **@hello-pangea/dnd 18.0.1** - Drag-and-drop functionality
- **Axios 1.13.2** - HTTP client
- **React Parallax Tilt** - 3D tilt effects

### Backend
- **Node.js v20.14.0** - Runtime environment
- **Express 5.1.0** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose 9.0.0** - MongoDB ODM
- **JSON Web Token 9.0.2** - Authentication
- **bcryptjs 3.0.3** - Password hashing
- **CORS** - Cross-origin resource sharing

---

## 📋 Prerequisites

- Node.js v20.14.0 or higher
- MongoDB Atlas account (or local MongoDB instance)
- npm or yarn package manager

---

## ⚙️ Project Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/hemanthsankar0007/TaskFlow.git
cd TaskFlow
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
echo "MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000" > .env

# Start the backend server
node server.js
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173` (or `http://localhost:5174` if 5173 is busy)

### 4. Seed the Database (Optional)

```bash
# Seed with sample employees and tasks
curl -X POST http://localhost:5000/api/seed
```

---

## 🔑 Environment Variables

### Backend (.env)

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taskflow?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
PORT=5000
```

---

## 📡 API Endpoints

### Authentication Routes

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "john_doe"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "john_doe"
}
```

---

### Public Routes (No Authentication Required)

#### Get Dashboard Stats
```http
GET /api/dashboard
```

**Response:**
```json
{
  "total": 5,
  "completed": 2,
  "pending": 2,
  "inProgress": 1,
  "rate": 40
}
```

#### Get All Tasks
```http
GET /api/tasks
```

**Response:**
```json
[
  {
    "_id": "674a1b2c3d4e5f6g7h8i9j0k",
    "title": "Build Login",
    "description": "Implement JWT authentication",
    "status": "Completed",
    "assignedTo": {
      "_id": "674a1b2c3d4e5f6g7h8i9j0l",
      "name": "Alice Johnson",
      "email": "alice@prou.com",
      "avatar": "https://i.pravatar.cc/150?u=a"
    },
    "createdAt": "2024-11-27T10:30:00.000Z",
    "updatedAt": "2024-11-27T15:45:00.000Z"
  }
]
```

#### Get All Employees
```http
GET /api/employees
```

**Response:**
```json
[
  {
    "_id": "674a1b2c3d4e5f6g7h8i9j0l",
    "name": "Alice Johnson",
    "role": "Frontend Dev",
    "email": "alice@prou.com",
    "avatar": "https://i.pravatar.cc/150?u=a"
  }
]
```

#### Get Tasks for an Employee
```http
GET /api/employees/:id/tasks
```

**Response:**
```json
[
  {
    "_id": "674a1b2c3d4e5f6g7h8i9j0k",
    "title": "Build Login",
    "status": "Completed"
  }
]
```

---

### Protected Routes (Requires Authentication)

**Note:** All protected routes require an `Authorization` header with a valid JWT token.

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Fix Login Bug",
  "description": "Resolve authentication timeout issue",
  "status": "Pending",
  "assignedTo": "674a1b2c3d4e5f6g7h8i9j0l"
}
```

**Response:**
```json
{
  "_id": "674a1b2c3d4e5f6g7h8i9j0m",
  "title": "Fix Login Bug",
  "description": "Resolve authentication timeout issue",
  "status": "Pending",
  "assignedTo": "674a1b2c3d4e5f6g7h8i9j0l",
  "createdAt": "2024-11-27T16:00:00.000Z",
  "updatedAt": "2024-11-27T16:00:00.000Z"
}
```

#### Update Task
```http
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "In Progress"
}
```

**Response:**
```json
{
  "_id": "674a1b2c3d4e5f6g7h8i9j0m",
  "title": "Fix Login Bug",
  "status": "In Progress",
  "updatedAt": "2024-11-27T16:30:00.000Z"
}
```

#### Delete Task
```http
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Task deleted successfully"
}
```

---

## 🎨 Project Structure

```
TaskFlow/
├── backend/
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   ├── models/
│   │   └── Schemas.js        # Mongoose schemas (Employee, Task)
│   ├── routes/
│   │   └── authRoutes.js     # Authentication routes
│   ├── .env                  # Environment variables
│   ├── server.js             # Express server entry point
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── EmployeeBackground.jsx  # Animated background
│   │   │   ├── Navbar.jsx              # Navigation bar
│   │   │   ├── TaskCard.jsx            # Individual task card
│   │   │   └── TaskModal.jsx           # Create/Edit task modal
│   │   ├── context/
│   │   │   └── AuthContext.jsx         # Authentication state management
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx           # Kanban board
│   │   │   ├── Employees.jsx           # Employee list
│   │   │   ├── EmployeeDetails.jsx     # Employee profile
│   │   │   └── Login.jsx               # Login/Register page
│   │   ├── App.jsx                     # Main app component
│   │   ├── index.css                   # Global styles
│   │   └── main.jsx                    # React entry point
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
```

---

## 🔐 Authentication Flow

1. **Register/Login**: User provides credentials
2. **Token Generation**: Backend generates JWT token with user ID
3. **Token Storage**: Frontend stores token in localStorage
4. **Protected Requests**: Token sent in Authorization header
5. **Guest Mode**: Users can view tasks without authentication

---

## 🎯 Key Features Explained

### Drag-and-Drop Functionality
- Uses `@hello-pangea/dnd` library
- Optimistic UI updates for smooth UX
- Automatically updates task status on drop
- Disabled for guest users

### Authentication System
- JWT tokens with 7-day expiration
- Passwords hashed with bcrypt (10 rounds)
- Protected API endpoints via middleware
- Guest mode for viewing without login

### Responsive Design
- Mobile-first approach
- Glassmorphic UI with backdrop blur
- 3D tilt effects on cards
- Smooth animations and transitions

---

## 📝 Assumptions Made

1. **Single User System**: Authentication is implemented but the system assumes a small team/organization
2. **Task Assignment**: Each task can only be assigned to one employee
3. **Status Workflow**: Tasks follow a linear progression: Pending → In Progress → Completed
4. **Avatar URLs**: Employee avatars are stored as URLs (using placeholder service)
5. **Real-time Updates**: Not implemented (would require WebSockets/Socket.io)
6. **Task Deletion**: Only authenticated users can delete tasks (no soft delete)
7. **Employee CRUD**: Employee creation/editing not implemented in UI (can be added via API)

---

## 🚦 Running in Production

### Build Frontend
```bash
cd frontend
npm run build
```

### Deploy Backend
- Set environment variables on hosting platform
- Ensure MongoDB Atlas is accessible
- Use process manager (PM2) for Node.js

### Recommended Hosting
- **Frontend**: Vercel, Netlify, or GitHub Pages
- **Backend**: Railway, Render, or Heroku
- **Database**: MongoDB Atlas (already cloud-based)

---

## 🐛 Common Issues & Solutions

### Port Already in Use
```bash
# Frontend
# Vite will automatically use next available port (5174, 5175, etc.)

# Backend
# Change PORT in .env file
```

### MongoDB Connection Error
- Verify MONGO_URI in .env
- Check MongoDB Atlas network access settings
- Ensure IP address is whitelisted

### CORS Error
- Backend CORS is set to `http://localhost:5173`
- Update if frontend runs on different port

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Manual](https://docs.mongodb.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [JWT Introduction](https://jwt.io/introduction)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

## 📄 License

This project is [MIT](https://opensource.org/licenses/MIT) licensed.

---

## 👨‍💻 Developed By

**Hemanth Sankar**

- GitHub: [@hemanthsankar0007](https://github.com/hemanthsankar0007)
- Portfolio: [Coming Soon]

---

## 🙏 Acknowledgments

- React Team for an amazing library
- Tailwind Labs for Tailwind CSS
- MongoDB for excellent database solution
- All open-source contributors

---

**⚡ Built with passion using MERN Stack**
