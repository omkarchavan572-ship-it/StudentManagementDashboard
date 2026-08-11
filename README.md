# EduPulse | Mini Student Management Dashboard (MERN Stack)

A modern, responsive educational SaaS dashboard for managing students, academic examination records, analytics, and admin authentication built with **MongoDB, Express.js, React.js, and Node.js**.

---

## 🌟 Key Features

### 1. 🔐 Admin Authentication
- **Secure Login**: JWT token-based authentication with bcrypt password hashing.
- **Form Validation**: Real-time email and password validation with inline error messaging.
- **One-Click Demo Login**: Built-in "Auto Fill" button for seamless evaluation (`admin@edu.com` / `admin123`).

### 2. 📊 Executive Dashboard Analytics
- **KPI Metrics**: Total Students, Active vs Inactive, Overall Pass Rate %, Average Score %.
- **Visual Analytics**: Interactive Recharts for Grade Distribution ($A^+, A, B^+, B, C, F$) and Course Enrollment breakdown.
- **Top Performers Leaderboard**: Ranks students by average score across subjects.
- **Recent Examination Feed**: Live log of newly added test scores.

### 3. 👥 Comprehensive Student Management
- **Full CRUD**: Add, View, Edit, and Delete student records with confirm modals.
- **Dynamic Search**: Instant searching across Name, Email, Phone, Student ID (Roll No), Course, and Institute.
- **Multi-Faceted Filtering**: Filter by Status (*Active, Inactive, Graduated, Suspended*), Course, and Institute.
- **Sorting & Layout**: Sort by Name, Date, Roll No; toggle between **Responsive Data Table** and **Grid Cards View**.
- **Pagination**: Server-side pagination controls for handling large datasets efficiently.

### 4. 🎓 Detailed Student Profile & Exam History
- **Personal Information Card**: Comprehensive bio, contact information, campus address, and status badges.
- **Academic Performance Cards**: Calculated Mean Score, Passed/Failed count, Pass Rate, and Standing status.
- **Exam History Table**: Complete breakdown of subject scores, max marks, letter grades, pass/fail status, and date.
- **Add Exam Scores**: Modal form to record new examination scores for any student directly.

### 5. ⚡ Robust Backend Architecture
- **Dual MongoDB Connection**: Connects to standard local MongoDB or MongoDB Atlas via `MONGODB_URI`. Automatically falls back to `mongodb-memory-server` if local MongoDB is not running (zero configuration needed!).
- **Data Seeder Script**: Auto-populates 12+ student profiles and 40+ exam records out of the box (`npm run seed`).

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React Icons, Recharts, Axios, React Router v6.
- **Backend**: Node.js, Express.js, Mongoose, JSON Web Tokens (JWT), BcryptJS, CORS, dotenv.
- **Database**: MongoDB (Mongoose ORM) with in-memory fallback support.

---

## 🚀 Quick Start & Installation Instructions

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/your-username/student-management-dashboard.git
cd student-management-dashboard

# Install root, server, and client dependencies with a single command:
npm run install-all
```

*Alternatively, install manually:*
```bash
# Install root tools
npm install

# Install server dependencies
cd server && npm install && cd ..

# Install client dependencies
cd client && npm install && cd ..
```

---

### 2. Configure Environment Variables

1. Copy `.env.example` in the `server/` directory:
```bash
cp server/.env.example server/.env
```

2. Update `server/.env` with your desired configuration:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/student_management_db
JWT_SECRET=super_secret_jwt_key_student_management_2026
NODE_ENV=development
```
*(Note: If local MongoDB is not installed or running, the backend server will automatically spin up an in-memory MongoDB instance so you can run the app immediately!)*

---

### 3. Seed Database (Optional but Recommended)

Pre-populate the database with sample admin credentials, 12 student profiles, and 40+ exam records:

```bash
npm run seed
```

---

### 4. Run the Application

Start both the Node.js backend server (port 5000) and the React Vite client (port 3000) concurrently:

```bash
npm start
```

Open your browser and navigate to:
**`http://localhost:3000`**

---

## 🔑 Demo Credentials

To log into the administrator dashboard:

- **Email**: `admin@edu.com`
- **Password**: `admin123`

*(You can also click the **Auto Fill** button on the login screen!)*

---

## 📡 API Endpoints Reference

### 🔐 Auth Routes (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/login` | Authenticate admin & return JWT token | Public |
| `GET` | `/api/auth/me` | Fetch logged-in user profile | Private |

### 👥 Student Routes (`/api/students`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/students` | List students with search, filter, sort, pagination | Private |
| `GET` | `/api/students/:id` | Fetch single student profile & academic stats | Private |
| `POST` | `/api/students` | Create a new student profile | Private |
| `PUT` | `/api/students/:id` | Update existing student profile | Private |
| `DELETE` | `/api/students/:id` | Delete student and associated exam history | Private |

### 📚 Exam History Routes (`/api/exams`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/exams/student/:studentId` | Get all exam records for student | Private |
| `POST` | `/api/exams/student/:studentId` | Add new subject score for student | Private |
| `DELETE` | `/api/exams/:id` | Delete specific exam record | Private |

### 📈 Dashboard Routes (`/api/dashboard`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/dashboard/stats` | Aggregated SaaS metrics, charts & top performers | Private |

---

## 📁 Directory Structure

```text
StudentManagement/
├── client/                      # React Frontend (Vite + Tailwind CSS)
│   ├── public/
│   ├── src/
│   │   ├── components/          # Navbar, Sidebar, StatCard, StudentModal, ExamModal, Modals, Pagination, Toast
│   │   ├── context/             # AuthContext (JWT state, dark mode, toast notifications)
│   │   ├── pages/               # LoginPage, DashboardPage, StudentListPage, StudentProfilePage
│   │   ├── services/            # Axios API client with token interceptors
│   │   ├── App.jsx              # React Router setup & protected routes
│   │   └── index.css            # Tailwind CSS & custom design tokens
│   ├── vite.config.js
│   └── package.json
├── server/                      # Node.js + Express Backend
│   ├── config/                  # DB connection logic with Mongo Memory Server fallback
│   ├── controllers/             # authController, studentController, examController, dashboardController
│   ├── middleware/              # authMiddleware (JWT protect), errorHandler
│   ├── models/                  # User, Student, ExamRecord Mongoose schemas
│   ├── routes/                  # Express REST routes
│   ├── utils/                   # seeder.js
│   ├── server.js                # Express app entry point
│   └── package.json
├── package.json                 # Root orchestration package
├── README.md                    # Project documentation
└── .gitignore
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
