# 🩺 NEET CBT Platform — NTA-Pattern Mock Exam & AI Proctoring Portal

A production-grade, full-stack **National Eligibility cum Entrance Test (NEET UG)** Mock Computer-Based Test (CBT) platform replicating official NTA test center standards, Section A & B choices, Google Gemini AI question generation, and real-time camera/mic proctoring.

---

## 🌟 Key Features

* **Official NTA CBT Exam Engine**: 5-state question palette (Answered, Not Answered, Marked for Review), +4/-1 scoring scheme, 200-minute timer, Section A (35 mandatory questions) & Section B (15 questions, select 10).
* **Google Gemini AI Question Generator**: Real-time NCERT high-yield predicted question generation matching Assertion-Reason, Statement I & II, and chapter-wise weightage.
* **Category & Per-Section Tests**:
  * Full Mocks (200Q, 720 Marks)
  * Subject-Wise Mocks (Physics, Chemistry, Botany, Zoology)
  * Topic Speed Tests (Chapter-wise quizzes)
  * AI High-Yield Predicted Series
* **AI Camera & Mic Proctoring**: Real-time webcam face-tracking, tab switch detection, and audio anomaly guard.
* **AI Medical Admission Predictor**: MCC All-India 15% Quota and State 85% closing rank analytics for AIIMS New Delhi, MAMC, VMMC, JIPMER, and top Govt Medical Colleges.
* **1080p Animated AI Video Classroom**: Interactive dual-avatar explainer with bilingual voiceover in **Hindi 🇮🇳** and **English 🇬🇧**.

---

## 🛠️ Tech Stack

* **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Web Speech API.
* **Backend**: Node.js, Express (MVC Architecture), WebSockets (`socket.io`).
* **Database**: Neon Cloud PostgreSQL (`pg` SSL pool).
* **AI Intelligence**: `@google/generative-ai` (Google Gemini SDK).

---

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/Abhisek1233/neet-cbt-platform.git
cd neet-cbt-platform
```

### 2. Start Backend Server
```bash
cd backend
npm install
npm start
```
* Backend REST API runs on `http://localhost:4000`.

### 3. Start Frontend Web App
```bash
cd frontend
npm install
npm run dev
```
* Open `http://localhost:3000` in your browser!

---

## 📜 License

Distributed under the MIT License.
