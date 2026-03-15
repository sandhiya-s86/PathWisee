# PathWise

**PathWise** is a full-stack career guidance platform built for Gen Z students (ages 16–24). It helps users discover suitable careers through an AI-powered assessment system, then provides personalised learning paths, entrance exam information, and college recommendations.

---

## Features

- **Career Assessment** — Multi-question quiz with weighted scoring that produces a ranked top-5 career recommendation list
- **Career Explorer** — Browse all careers filterable by academic stage and stream
- **Learning Paths** — Milestone-based roadmaps tied to each career
- **Entrance Exams** — Filterable directory of entrance exams with eligibility details
- **Colleges** — Filterable directory of colleges linked to careers and exams
- **Dashboard** — Personalised overview of assessment history, career readiness score, and active learning paths
- **User Profile** — Manage academic stage, stream, and skills
- **Admin Panel** — Create and delete careers (admin-only endpoints)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Tailwind CSS, Framer Motion, Radix UI |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Auth | JWT (72-hour tokens), bcrypt password hashing |
| 3D Effects | Three.js |
| Charts | Recharts |

---

## Project Structure

```
PathWise_V1/
├── backend/
│   ├── config/
│   │   └── db.js               # MySQL connection pool
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── assessmentController.js
│   │   ├── careersController.js
│   │   ├── dashboardController.js
│   │   ├── adminController.js
│   │   ├── collegesController.js
│   │   ├── examsController.js
│   │   ├── progressController.js
│   │   └── skillsController.js
│   ├── middleware/
│   │   ├── auth.js             # JWT authentication + admin guard
│   │   └── errorHandler.js
│   ├── routes/                 # Express routers (one per resource)
│   ├── utils/
│   │   └── helpers.js          # Shared DB helper functions
│   ├── app.js                  # Express app setup
│   ├── server.js               # Entry point
│   ├── schema.sql              # Full database schema
│   └── seed.js                 # Database seeding script
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── ui/             # Radix UI / shadcn components
│       │   ├── GalaxyBackground.js
│       │   ├── Navbar.js
│       │   └── ProtectedRoute.js
│       ├── context/
│       │   ├── AuthContext.js
│       │   └── ThemeContext.js
│       ├── hooks/
│       │   ├── use-galaxy-canvas.js
│       │   └── use-toast.js
│       ├── pages/
│       │   ├── Landing.js
│       │   ├── Login.js
│       │   ├── Signup.js
│       │   ├── Dashboard.js
│       │   ├── Assessment.js
│       │   ├── Results.js
│       │   ├── CareersPage.js
│       │   ├── CareerDetail.js
│       │   ├── LearningPath.js
│       │   ├── ExamsPage.js
│       │   ├── CollegesPage.js
│       │   └── Profile.js
│       ├── lib/
│       │   └── utils.js
│       └── App.js
│
└── design_guidelines.json      # Design system reference
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MySQL >= 8
- Yarn (frontend) or npm

---

### Database Setup

```bash
# Create the database
mysql -u root -p -e "CREATE DATABASE pathwise;"

# Apply the schema
mysql -u root -p pathwise < backend/schema.sql
```

---

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=pathwise
PORT=8001
JWT_SECRET=replace-with-a-long-random-secret
ADMIN_EMAIL=your-admin@email.com
CORS_ORIGINS=http://localhost:3000
```

> **Important:** Set `JWT_SECRET` to a strong random string before deploying. Never commit `.env` to version control.

Seed the database with sample careers and assessment questions:

```bash
npm run seed
```

Start the server:

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:8001`.

---

### Frontend

```bash
cd frontend
yarn install
```

Create `frontend/.env`:

```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

Start the development server:

```bash
yarn start
```

The app will open at `http://localhost:3000`.

---

## API Reference

All authenticated endpoints require the header:

```
Authorization: Bearer <token>
```

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register a new user |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/auth/profile` | Yes | Get current user profile |
| PUT | `/api/auth/profile` | Yes | Update academic stage, stream, skills |

**Register body:**
```json
{ "name": "string", "email": "string", "password": "string", "academic_stage": "string" }
```

**Login body:**
```json
{ "email": "string", "password": "string" }
```

---

### Assessment

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/assessment/questions` | — | Fetch all questions with options |
| POST | `/api/assessment/submit` | Yes | Submit responses, get career recommendations |
| GET | `/api/assessment/results/:user_id` | Yes | Fetch latest assessment results |

**Submit body:**
```json
{
  "user_id": "uuid",
  "responses": { "<question_id>": "<option_id>" }
}
```

---

### Careers

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/careers` | — | List careers (filter: `?academic_stage=&stream=`) |
| GET | `/api/careers/:id` | — | Get career details |
| GET | `/api/careers/:id/roadmap` | Yes | Get learning roadmap |
| GET | `/api/careers/:id/exams` | Yes | Get related exams |
| GET | `/api/careers/:id/colleges` | Yes | Get related colleges |

---

### Exams & Colleges

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/exams` | — | List exams (filter: `?category=`) |
| GET | `/api/exams/:id` | — | Get exam details |
| GET | `/api/colleges` | — | List colleges (filter: `?state=&exam=`) |
| GET | `/api/colleges/:id` | — | Get college details |

---

### Dashboard & Progress

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/dashboard/:user_id` | Yes | Get dashboard summary |
| GET | `/api/progress/:user_id` | Yes | Get learning progress |
| POST | `/api/progress/update` | Yes | Mark a milestone complete |

---

### Admin (admin only)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/users` | Yes (admin) | List all users |
| POST | `/api/admin/career/create` | Yes (admin) | Create a career |
| DELETE | `/api/admin/career/:id` | Yes (admin) | Delete a career |

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `DB_HOST` | MySQL host |
| `DB_PORT` | MySQL port (default: 3306) |
| `DB_USER` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `DB_NAME` | Database name |
| `PORT` | API port (default: 8001) |
| `JWT_SECRET` | Secret key for signing JWTs |
| `ADMIN_EMAIL` | Email that receives admin privileges on register |
| `CORS_ORIGINS` | Allowed CORS origins — comma-separated list or `*` |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `REACT_APP_BACKEND_URL` | Backend API base URL |

---

## Scripts

| Directory | Command | Description |
|-----------|---------|-------------|
| `backend` | `npm start` | Start production server |
| `backend` | `npm run dev` | Start with nodemon (auto-reload) |
| `backend` | `npm run seed` | Seed the database |
| `frontend` | `yarn start` | Start dev server |
| `frontend` | `yarn build` | Build for production |

---

## Design System

The project follows a documented design system in [`design_guidelines.json`](design_guidelines.json).

| Token | Value |
|-------|-------|
| Primary colour | Violet `#7C3AED` |
| Secondary colour | Amber `#FBBF24` |
| Accent colour | Emerald `#10B981` |
| Heading font | Outfit |
| Body font | DM Sans |
| Border radius (cards) | `rounded-2xl` |
| Border radius (buttons) | `rounded-full` |
| Visual style | Glassmorphism, gradients, 3D floating shapes |
| Motion | Staggered entry animations, smooth transitions |

---
