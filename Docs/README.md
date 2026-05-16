# 🎮 VaibQuest - Enterprise Gamified Learning Platform

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
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
- **Security:** JSON Web Tokens (JWT), Bcrypt.js, Express Validator
- **Testing Ecosystem:** Jest, Supertest, Vitest, React Testing Library, MongoDB Memory Server

---

## ✨ Core Capabilities

- **Authentication & Authorization:** Secure JWT-based login mechanisms with strict Role-Based Access Control (Admin/User).
- **Gamification Engine:** Automated XP distribution, tier-based badge unlocks (Bronze to Diamond), and global leaderboard ranking.
- **Quest Management (CRUD):** Admins can orchestrate quests, establish deadlines, and manage completion criteria.
- **Proof Submissions:** Seamless integration for users to upload proof links or files via Cloudinary CDN.
- **Evaluation Workflow:** Dedicated portal for admins to approve/reject submissions with interactive feedback, triggering automated XP ledger updates.

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
├── Backend/                 # Express.js REST API Server
│   ├── src/                 # Source code (Controllers, Models, Routes)
│   ├── tests/               # Unit and API Tests (Jest & Supertest)
│   └── docs/                # Documentation & Swagger
│       ├── swagger.json     # Swagger API Documentation
│       └── README.md        # Backend specific documentation
├── Frontend/                # React.js Client Application
│   ├── src/                 # Source code (Components, Pages, Services)
│   ├── tests/               # Component & Integration Tests (Vitest)
│   ├── public/              # Static assets & images
│   └── docs/                # Frontend Documentation
│       └── README.md        # Frontend specific documentation
├── Docs/                    # Master Documentation (You are here)
│   └── README.md            # Main Project Documentation
└── public/                  # Core documentation assets & imagery
    ├── UI/                  # User Interface Screenshots
    └── ...
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
