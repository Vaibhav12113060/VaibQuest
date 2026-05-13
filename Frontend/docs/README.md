# VaibQuest - Frontend 🖥️

[👈 Back to Main README](../../Docs/README.md)

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/-Vitest-%23729B1B?style=for-the-badge&logo=vitest&logoColor=white)

This is the client-side application for **VaibQuest**, built with React, TypeScript, and Vite. It provides a highly responsive, intuitive, and gamified user interface for users to discover quests, submit proofs, and track their leaderboard rankings.

## 🚀 Tech Stack

- **Framework:** React 19
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** React Hooks
- **Routing:** React Router DOM v7
- **Testing:** Vitest, React Testing Library

## ✨ Key Features

1. **Gamified Dashboard:** View available quests, track deadlines, and instantly join challenges.
2. **Real-time Validations:** Strict form validations using custom rules and inline error highlighting.
3. **Submission System:** Upload proof files securely via Cloudinary or submit URLs.
4. **Global Leaderboard:** Track ranks dynamically sorted by Total XP.
5. **Admin Panel:** Separate protected layout for admins to manage users, create quests, and approve/reject submissions.
6. **Responsive Design:** 100% mobile-friendly layout with hamburger menus and fluid grid systems.

## 📂 Folder Structure

```text
src/
├── api/            # Axios instance and token interceptors setup
├── components/     # Reusable UI components (Navbar, Cards, Pagination)
├── layouts/        # Application layouts (MainLayout, AdminLayout)
├── pages/          # Individual screen components (Dashboard, Profile, Admin)
├── routes/         # Route definitions and ProtectedRoute logic
├── services/       # API calling functions abstracted away from UI
└── tests/          # Component and Integration tests using Vitest
```

## 🛠️ Setup Instructions

1. **Install Dependencies:**

   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file in the root of the `Frontend` directory and add the backend API URL:

   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

3. **Run the Development Server:**

   ```bash
   npm run dev
   ```

4. **Build for Production:**
   ```bash
   npm run build
   ```

## 📸 User Interface

To see the screenshots of the platform's User Interface (Dashboard, Profile, Admin Panel, etc.), please check the **UI Showcase in the Main README**.

## 🧪 Running Tests

To run the test suite and generate a coverage report:

```bash
npm test
```
