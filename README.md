<div align="center">

  <img src="frontend/public/logo.jpg" alt="NEET CBT Platform Logo" width="120" style="border-radius: 16px; border: 2px solid #fbbf24;" />

  # 🩺 NEET CBT Platform
  ### NTA-Pattern Mock Exam & AI Proctoring Portal

  [![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?logo=react)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Bundler-Vite%205-646CFF?logo=vite)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
  [![Node.js](https://img.shields.io/badge/Backend-Node.js%20v20-339933?logo=nodedotjs)](https://nodejs.org/)
  [![Express](https://img.shields.io/badge/Framework-Express%20v4-000000?logo=express)](https://expressjs.com/)
  [![PostgreSQL](https://img.shields.io/badge/Database-Neon%20PostgreSQL-4169E1?logo=postgresql)](https://neon.tech/)
  [![Google Gemini AI](https://img.shields.io/badge/AI-Google%20Gemini-8E44AD?logo=google)](https://ai.google.dev/)

  *An enterprise-grade, full-stack Computer-Based Test (CBT) preparation ecosystem built specifically for National Eligibility cum Entrance Test (NEET UG) aspirants in India.*

  [Live Demo](http://localhost:3000) • [Explore Features](#-key-features) • [API Documentation](#-api-reference) • [Setup Guide](#-getting-started)

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Ownership & License](#-license--ownership)

---

## 🔬 Overview

The **NEET CBT Platform** bridges the gap between traditional pen-and-paper preparation and the actual computer-based test center environment administered by the **National Testing Agency (NTA)**.

By leveraging **Google Gemini AI**, the platform dynamically generates real-time NCERT high-yield questions matching authentic NEET question typologies (Assertion-Reason, Statement I & II, and Match the Columns) while enforcing strict camera and microphone proctoring telemetry.

---

## ⚡ Key Features

### 1. 🛡️ Authentic NTA CBT Exam Engine
- **Official 200-Question Format**: Physics, Chemistry, Botany, and Zoology.
- **Section A & B Rules**: 35 mandatory questions in Section A; 15 questions in Section B (select any 10).
- **Official Marking Scheme**: `+4` for correct responses, `-1` for incorrect attempts, `0` for unattempted questions.
- **5-State Question Palette**:
  - 🟩 **Green**: Answered
  - 🟥 **Red**: Not Answered
  - 🟪 **Purple**: Marked for Review
  - 🟣 **Purple + Green Circle**: Answered & Marked for Review
  - ⚪ **Grey**: Unvisited
- **Timed Session Management**: 200-minute synchronized countdown timer with automated submission telemetry.

### 2. 🤖 Google Gemini AI Question Generator
- On-demand generation of NCERT-grounded high-probability questions.
- Categorized test suites:
  - **Full Mocks (200Q, 720 Marks)**
  - **Subject-Wise Special Papers** (Electrodynamics, Organic Equilibrium, Genetics)
  - **Topic Speed Tests** (Ray Optics, Mendelian Genetics)
  - **AI High-Yield Predicted Series**
- Customizable custom test generator modal per subject and chapter.

### 3. 👁️ Real-Time AI Proctoring Telemetry
- WebRTC camera & microphone anomaly detection.
- Browser window blur & tab switch tracking.
- Teacher live monitoring dashboard with warning alert triggers.

### 4. 🏆 AI Medical Admission & Closing Rank Predictor
- Predicts admission probabilities for top Government Medical Colleges (AIIMS New Delhi, MAMC, VMMC, JIPMER, KGMU).
- Evaluates MCC All-India 15% Quota and State 85% closing rank trends across General, OBC, SC, ST, and EWS categories.

### 5. 🎬 1080p Animated AI Video Classroom
- Interactive dual-avatar explainer featuring **Dr. S. K. Roy (Faculty Mentor)** and **Rahul Kumar (NEET Aspirant)**.
- Dual-language voiceover in **Hindi 🇮🇳** and **English 🇬🇧** powered by the Web Speech API.
- Synchronized soundwave equalizer and live interactive screen morphing canvas.

### 6. 🔐 Dual-Role Authentication & Guest Gateway
- **Candidate Login / Sign Up**: Custom name, email, password, and target exam year registration.
- **Teacher / Admin Portal**: Question bank management and live proctoring feeds.
- **Instant Guest Practice**: 1-click test access without credential barriers.

---

## 🏗️ System Architecture

```mermaid
graph TD
    User([NEET Aspirant / Teacher]) --> Frontend[Vite + React 18 UI]
    Frontend --> AuthModal[Auth & Profile Management]
    Frontend --> CBTEngine[NTA CBT Exam Engine]
    Frontend --> VideoTheater[1080p AI Video Theater]
    Frontend --> Predictor[AI College Predictor]

    CBTEngine <-->|REST API / HTTP| Express[Express MVC REST API]
    CBTEngine <-->|WebSockets| SocketIO[Socket.io Real-Time Feed]

    Express --> PostgreSQL[(Neon Cloud PostgreSQL)]
    Express --> GeminiAI[Google Gemini AI SDK]
```

---

## 📁 Project Directory Structure

```
neet-cbt-platform/
├── backend/
│   ├── src/
│   │   ├── config/          # Neon PostgreSQL (db.js) & Gemini AI (gemini.js)
│   │   ├── controllers/     # MVC Route Controllers (exam, question, auth, attempt, predictor)
│   │   ├── middleware/      # JWT Auth & Error Handlers
│   │   ├── models/          # Question & Attempt DAO Models
│   │   ├── routes/          # Express Router Definitions
│   │   ├── services/        # Google Gemini AI Service Engine
│   │   └── utils/           # Standardized Response Wrappers
│   ├── server.js            # Express Entrypoint & WebSockets Setup
│   └── package.json
│
├── frontend/
│   ├── public/              # Logos & Avatar Assets (teacher_avatar.jpg, student_avatar.jpg)
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/        # LandingPage.jsx, AuthModal.jsx
│   │   │   ├── cbt/         # ExamEngine.jsx, PreExamCheck.jsx, PostExamScorecard.jsx, GenerateAiTestModal.jsx
│   │   │   ├── predictor/   # CollegePredictor.jsx, CutoffExplorer.jsx
│   │   │   ├── proctoring/  # ProctorMonitor.jsx, ProctorAlertOverlay.jsx
│   │   │   ├── social/      # Leaderboard.jsx, StudyTeams.jsx, DoubtForum.jsx, MyNotes.jsx
│   │   │   ├── teacher/     # QuestionBank.jsx, LiveProctoringDashboard.jsx
│   │   │   ├── ui/          # Toast.jsx, Skeleton.jsx, ErrorBoundary.jsx
│   │   │   └── video/       # AiVideoExplainer.jsx
│   │   ├── data/            # Mock Data Suites
│   │   ├── services/        # API Client (api.js) & Store State (store.js)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 💻 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Abhisek1233/neet-cbt-platform.git
   cd neet-cbt-platform
   ```

2. **Configure & Start Backend Server**:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file inside `backend/` (refer to [Environment Variables](#-environment-variables)).
   ```bash
   npm start
   ```
   *Express REST API will start on `http://localhost:4000`.*

3. **Configure & Start Frontend Client**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   *Vite development server will launch on `http://localhost:3000`.*

---

## 🔑 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=4000
NODE_ENV=development

# Database Connection (Neon Cloud PostgreSQL)
DATABASE_URL=postgresql://neondb_owner:npg_6szKYAmFEO9Z@ep-still-rice-ay0oc078-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require

# Google Gemini AI Key
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE

# JWT Secret
JWT_SECRET=super_secret_neet_jwt_key_2026
```

---

## 📡 API Reference

### AI Generation Routes
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/ai/generate-question` | Generates a real-time NCERT NEET question via Gemini AI |

### Exam & Question Routes
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/exams` | Fetches all available mock test papers |
| `GET` | `/api/questions` | Retrieves question bank items |
| `POST` | `/api/attempts/submit` | Submits a completed CBT attempt for evaluation |

### Predictor Routes
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/predictor/counseling-advice` | Generates AI medical college counseling recommendations |

---

## 📄 License & Ownership

Copyright © 2026 Abhisek. All Rights Reserved.

This repository and its codebase are private property. Unauthorized copying, distribution, or commercial use is strictly prohibited without explicit written consent.

---

<div align="center">
  <sub>Built with ❤️ for Indian Medical Aspirants. Replicating NTA Test Center Excellence.</sub>
</div>
