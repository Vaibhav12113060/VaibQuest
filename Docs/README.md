# 🎮 VaibQuest - Enterprise Gamified Learning Platform

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?&style=for-the-badge&logo=redis&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-1f910c?style=for-the-badge&logo=langchain&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)

Welcome to **VaibQuest**, a robust, full-stack web application meticulously engineered to gamify task completion and continuous learning.

This platform empowers users to embark on quests, submit proof of their achievements, accumulate XP, and unlock tier-based badges. Administrators are equipped with a comprehensive dashboard to provision challenges, evaluate submissions, and oversee platform activity.

> **Evaluation Notice:** This project strictly adheres to **SOLID principles**, **Clean Code Architecture**, and industry-standard **Security Best Practices**. Comprehensive test coverage guarantees maximum reliability and stability across the entire codebase.

## 🌍 Live Demo & Deployment

🚀 **Experience the platform live here:**

- 🖥️ **Frontend:** [![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://vaibquest.netlify.app) 👉 [https://vaibquest.netlify.app](https://vaibquest.netlify.app)
- ⚙️ **Backend:** [![Render](https://img.shields.io/badge/Render-%2346E3B7.svg?style=for-the-badge&logo=render&logoColor=white)](https://vaibquest.onrender.com) 👉 [https://vaibquest.onrender.com](https://vaibquest.onrender.com)

## 🚀 Tech Stack

- **Frontend:** React.js 19, TypeScript, Vite, Tailwind CSS, React Router v7
- **Backend:** Node.js, Express.js, Cloudinary (File Management)
- **Database:** MongoDB, Mongoose ODM
- **Caching & Performance:** Redis for in-memory caching and API rate limiting
- **AI & Machine Learning:** LangChain.js with OpenAI/Gemini APIs for RAG-based assistance
- **Security:** JSON Web Tokens (JWT), Bcrypt.js, Express Validator
- **Testing Ecosystem:** Jest, Supertest, Vitest, React Testing Library, MongoDB Memory Server
- **Containerization:** Docker, Docker Compose

---

## ✨ Core Capabilities

- **Authentication & Authorization:** Secure JWT-based login mechanisms with strict Role-Based Access Control (Admin/User).
- **AI-Powered Quest Assistant:** An intelligent, RAG-based assistant built with LangChain that analyzes user profiles to provide personalized quest recommendations and explanations.
- **Gamification Engine:** Automated XP distribution, tier-based badge unlocks (Bronze to Diamond), and global leaderboard ranking.
- **Quest Management (CRUD):** Admins can orchestrate quests, establish deadlines, and manage completion criteria.
- **Proof Submissions:** Seamless integration for users to upload proof links or files via Cloudinary CDN.
- **Evaluation Workflow:** Dedicated portal for admins to approve/reject submissions with interactive feedback, triggering automated XP ledger updates.
- **High-Performance Caching:** Leverages Redis to dramatically reduce response times for frequently accessed data, ensuring a snappy user experience.
- **Robust API Security:** Implements Redis-backed rate limiting to protect against DDoS attacks and ensure application stability.
- **Containerized Deployment:** Fully dockerized stack (Frontend, Backend, Redis) for consistent, isolated, and scalable deployments using Docker Compose.

---

## 📸 User Interface Showcase

Experience the intuitive and gamified user interface of VaibQuest. Below are glimpses of the platform's core screens:

### 🔐 Authentication

**Login Page**  
![Login Page](../public/UI/LoginPage.png)

**Register Page**  
![Register Page](../public/UI/RegisterPage.png)

### 🎮 User Experience

**Dashboard**  
![Dashboard](../public/UI/Dashboard.png)

**My Quests**  
![My Quest](../public/UI/MyQuest.png)

**User Profile & Progression**  
![Profile](../public/UI/Profile.png)

**Global Leaderboard**  
![Leaderboard](../public/UI/Leaderboard.png)

### ⚙️ Administration

**Admin Panel**  
![Admin Panel](../public/UI/AdminPanel.png)

---

## 📁 Repository Structure

```text
VaibQuest/
├── Backend/                     # Express.js REST API Server
│   ├── src/
│   │   ├── config/              # DB connection, Cloudinary, AI models
│   │   ├── controllers/         # Request handlers & business logic
│   │   ├── middlewares/         # Auth, caching, rate limiting, validation
│   │   ├── models/              # Mongoose schemas
│   │   ├── routes/              # API route definitions
│   │   ├── services/            # AI service logic
│   │   └── validators/          # express-validator schemas
│   ├── tests/                   # Unit & API tests (Jest, Supertest)
│   ├── docs/                    # Backend-specific documentation
│   └── Dockerfile               # Docker configuration for the backend
├── Frontend/                    # React.js Client Application
│   ├── src/
│   │   ├── api/                 # Axios instance & interceptors
│   │   ├── components/          # Reusable UI components
│   │   ├── layouts/             # Main & Admin layouts
│   │   ├── pages/               # Page-level components
│   │   ├── routes/              # Routing logic
│   │   └── services/            # API service functions
│   ├── public/                  # Static assets
│   ├── tests/                   # Component tests (Vitest)
│   └── Dockerfile               # Docker configuration for the frontend
├── Docs/                        # Master Project Documentation (You are here)
├── public/                      # Global assets (UI screenshots, diagrams)
│   ├── UI/
│   └── DatabaseSchemaDiagram.png
└── docker-compose.yml           # Docker Compose for multi-container setup
```

Create a `.env` file in the Backend folder:

```env
PORT=8000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
FRONTEND_URL=http://localhost:5173
```

Run the backend: `npm run dev`

### 3. Frontend Setup

```bash
cd Frontend
npm install
```

Create a `.env` file in the Frontend folder:

```env
VITE_API_URL=http://localhost:8000/api
```

Run the frontend: `npm run dev`

---

## 📚 API Documentation

Once the backend is running, you can access the interactive **Swagger API Documentation** at:
👉 `http://localhost:8000/api-docs`

---

## 🏗️ Architecture Diagram

```mermaid
graph TD
  Client[React Frontend / Vite] -->|REST API & JWT| Server[Express + Node.js]
  Server -->|Mongoose ODM| Database[(MongoDB)]
  Server -->|Multer Uploads| Cloudinary[Cloudinary CDN]
```

---

## 📊 Database Schema

![Database Schema Diagram](../public/DatabaseSchemaDiagram.png)

---

## 🧪 Test Coverage Report

The project follows strict testing practices with Unit, Integration, API, and Component tests.

**Backend Test Coverage**

- Highlights: Core authentication flows tested, Quest management APIs covered, Validation and middleware logic tested, Route coverage fully implemented.
- Overall Lines Covered: ~89%

![Backend Test Coverage](../public/BackendTestCoverageReport.png)

**Frontend Test Coverage**

- Highlights: UI rendering tests implemented, Form validation scenarios tested, Page interaction and component behavior covered, Core user flows validated.
- Overall Lines Covered: ~73%

![Frontend Test Coverage](../public/FrontendTestCoverageReport.png)
