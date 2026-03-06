# 🎯 QuizMaster — Full-Stack MERN Quiz Application

A complete, production-ready quiz platform built with the MERN stack using **ES Modules (.mjs)** throughout.

---

## 🏗️ Folder Structure

```
quiz-app/
├── backend/
│   ├── config/
│   │   └── cloudinary.mjs          # Cloudinary + Multer setup
│   ├── controllers/
│   │   ├── authController.mjs      # Register, login, profile
│   │   ├── quizController.mjs      # CRUD quizzes + analytics
│   │   ├── questionController.mjs  # CRUD questions
│   │   └── attemptController.mjs   # Submit, leaderboard, history
│   ├── middleware/
│   │   ├── authMiddleware.mjs      # JWT protect + adminOnly
│   │   ├── errorMiddleware.mjs     # Global error handler
│   │   └── validateMiddleware.mjs  # express-validator helper
│   ├── models/
│   │   ├── User.mjs                # User schema + bcrypt hooks
│   │   ├── Quiz.mjs                # Quiz schema
│   │   ├── Question.mjs            # Question schema
│   │   └── Attempt.mjs             # Attempt schema
│   ├── routes/
│   │   ├── auth.mjs                # POST /register /login GET /me
│   │   ├── quiz.mjs                # CRUD /quizzes
│   │   ├── question.mjs            # CRUD /questions
│   │   └── attempt.mjs             # POST /attempt GET /leaderboard /history
│   ├── utils/
│   │   ├── generateToken.mjs       # JWT generator
│   │   └── seed.mjs                # DB seeder (admin + sample quiz)
│   ├── .env.example
│   ├── package.json                # "type": "module"
│   └── server.mjs                  # Express app entry
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── QuizCard.jsx
    │   │   │   ├── LoadingScreen.jsx
    │   │   │   ├── EmptyState.jsx
    │   │   │   ├── Spinner.jsx
    │   │   │   └── ConfirmModal.jsx
    │   │   └── layout/
    │   │       ├── Layout.jsx
    │   │       └── Navbar.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx      # Auth state + JWT storage
    │   ├── hooks/
    │   │   ├── useQuizzes.js        # React Query quiz hooks
    │   │   ├── useQuestions.js      # React Query question hooks
    │   │   └── useAttempt.js        # React Query attempt hooks
    │   ├── pages/
    │   │   ├── Landing.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── QuizList.jsx
    │   │   ├── QuizStart.jsx
    │   │   ├── QuizPlay.jsx         # Timer + question engine
    │   │   ├── QuizResult.jsx       # Score + answer review
    │   │   ├── Leaderboard.jsx
    │   │   ├── History.jsx
    │   │   ├── Profile.jsx
    │   │   └── admin/
    │   │       ├── AdminQuizzes.jsx
    │   │       ├── AdminQuizForm.jsx
    │   │       └── AdminQuestions.jsx
    │   ├── services/
    │   │   ├── api.js               # Axios instance + interceptors
    │   │   ├── authService.js
    │   │   └── quizService.js
    │   ├── utils/
    │   │   ├── constants.js
    │   │   └── schemas.js           # Yup validation schemas
    │   ├── App.jsx                  # Routes + guards
    │   ├── main.jsx                 # React root
    │   └── index.css                # Tailwind + custom layers
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)
- Cloudinary account (free tier works)

---

### 1. Clone & Install

```bash
# Clone the project
git clone <your-repo-url>
cd quiz-app

# Install backend deps
cd backend
npm install

# Install frontend deps
cd ../frontend
npm install
```

---

### 2. Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quizapp
JWT_SECRET=your_super_secret_key_min_32_characters
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

> **Get Cloudinary credentials:** Sign up at [cloudinary.com](https://cloudinary.com) → Dashboard → copy Cloud Name, API Key, API Secret

---

### 3. Seed Database (Optional)

```bash
cd backend
npm run seed
```

This creates:
- **Admin:** `admin@quizapp.com` / `Admin@123`
- **User:** `user@quizapp.com` / `User@123`
- Sample JavaScript quiz with 5 questions

---

### 4. Start Development Servers

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# → Server running on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# → App running on http://localhost:5173
```

---

## 📡 API Reference

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register (multipart/form-data) | ❌ |
| POST | `/api/auth/login` | Login | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |
| PUT | `/api/auth/profile` | Update profile | ✅ |

### Quizzes
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/quizzes` | List quizzes (filter/paginate) | ❌ |
| GET | `/api/quizzes/:id` | Get quiz by ID | ❌ |
| POST | `/api/quizzes` | Create quiz | Admin |
| PUT | `/api/quizzes/:id` | Update quiz | Admin |
| DELETE | `/api/quizzes/:id` | Delete quiz | Admin |
| GET | `/api/quizzes/admin/all` | Admin's quizzes | Admin |
| GET | `/api/quizzes/:id/analytics` | Quiz analytics | Admin |

### Questions
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/questions` | Add question | Admin |
| GET | `/api/questions/:quizId` | Get questions (answers hidden) | User |
| GET | `/api/questions/:quizId/admin` | Get questions with answers | Admin |
| PUT | `/api/questions/:id` | Update question | Admin |
| DELETE | `/api/questions/:id` | Delete question | Admin |

### Attempts
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/attempt` | Submit quiz attempt | User |
| GET | `/api/leaderboard/:quizId` | Get leaderboard | ❌ |
| GET | `/api/history` | Get user's history | User |

---

## 🗄️ Database Schemas

### User
```js
{ name, email, password (hashed), role: 'user'|'admin',
  avatar: { url, publicId }, totalQuizzesTaken, totalScore, isActive }
```

### Quiz
```js
{ title, description, thumbnail: { url, publicId }, category, difficulty,
  timeLimit, totalQuestions, createdBy (ref User), isPublished,
  totalAttempts, averageScore, tags }
```

### Question
```js
{ quizId (ref Quiz), questionText, questionImage: { url, publicId },
  options: [4 strings], correctAnswer (0-3), explanation, order }
```

### Attempt
```js
{ userId, quizId, answers: [{ questionId, selectedAnswer, isCorrect, timeTaken }],
  score, totalQuestions, correctAnswers, wrongAnswers, skippedAnswers,
  percentage, timeTaken, passed }
```

---

## ✨ Features

### User Features
- 🔐 Register/Login with JWT + profile image upload
- 📋 Browse quizzes with category/difficulty filters + search
- ⏱️ Take timed quizzes with real-time countdown
- 📊 Detailed result screen with answer review + explanations
- 🏆 Per-quiz leaderboard (ranked by score then time)
- 📜 Full quiz history with pagination
- 👤 Profile with avatar update

### Admin Features
- ➕ Create/Edit/Delete quizzes with thumbnail upload
- ❓ Add questions with 4 options, correct answer, image + explanation
- 📈 Quiz analytics (attempts, avg score, pass rate)
- 🔒 All admin routes protected by role middleware

### Technical
- ✅ ESM (.mjs) throughout backend
- ✅ React Query for all API state + caching
- ✅ Protected routes (user + admin)
- ✅ Axios interceptors with auto-redirect on 401
- ✅ Global error handler middleware
- ✅ Input validation (express-validator + Yup)
- ✅ Cloudinary image uploads with auto-delete on update
- ✅ Responsive dark UI with Tailwind CSS
- ✅ Toast notifications
- ✅ Pagination (quizzes + history)

---

## 🔒 Security

- Passwords hashed with bcrypt (12 salt rounds)
- JWT tokens with configurable expiry
- Protected routes on both frontend and backend
- Input sanitization with express-validator
- Admin role enforcement via middleware
- CORS restricted to frontend origin

---

## 🏭 Production Build

```bash
# Build frontend
cd frontend
npm run build

# The dist/ folder can be served statically or deployed to Vercel/Netlify

# Backend can be deployed to Railway, Render, or any Node.js host
# Set all .env variables in your host's dashboard
```

---

## 📝 Default Credentials (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@quizapp.com | Admin@123 |
| User | user@quizapp.com | User@123 |
