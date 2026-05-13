# VaibQuest - Backend ⚙️

[👈 Back to Main README](../../Docs/README.md)

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)

This is the RESTful API server for **VaibQuest**, meticulously crafted with Node.js and Express. It handles secure authentication, complex quest management, user submissions, automated XP calculation logic, and file uploads.

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens)
- **File Uploads:** Multer + Cloudinary
- **Testing:** Jest, Supertest, MongoDB Memory Server
- **Documentation:** Swagger UI

## ✨ Key Features

1. **JWT Authentication:** Secure login/registration with hashed passwords using bcryptjs.
2. **Role-Based Access Control (RBAC):** Middleware protecting admin-only routes (e.g., creating quests, reviewing submissions).
3. **Advanced Mongoose Queries:** Paginated lists, complex joins (`populate`), and atomic database updates.
4. **Gamification Logic:** Automated calculations for XP allocation and Tier/Badge progression upon task approval.
5. **Input Validation:** Strict payload validation using `express-validator`.
6. **Error Handling:** Centralized error handling across all controllers to prevent unhandled promise rejections.

## 📂 Folder Structure

```text
src/
├── config/         # MongoDB connection & Cloudinary cloud setup
├── controllers/    # Business logic for Auth, Quests, and UserQuests
├── middlewares/    # JWT verification, Admin Role checks, and Validators
├── models/         # Mongoose schema definitions
├── routes/         # Express router configurations
└── validators/     # Express-validator schemas
```

## 🛠️ Setup Instructions

1. **Install Dependencies:**

   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file in the root of the `Backend` directory:

   ```env
   PORT=8000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   FRONTEND_URL=http://localhost:5173
   ```

3. **Start the Server:**
   ```bash
   npm run dev
   ```

## 📚 API Documentation (Swagger)

Once the server is running, the interactive Swagger API documentation is automatically generated and served.

👉 **Access the documentation here:** http://localhost:8000/api-docs

## 🧪 Running Tests

To run the API and Unit tests with coverage:

```bash
npm test
```
