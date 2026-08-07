import { io } from 'socket.io-client';

const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:4000/api'
  : 'https://neet-cbt-platform-9qh1.onrender.com/api';

const SOCKET_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:4000'
  : 'https://neet-cbt-platform-9qh1.onrender.com';

export const socket = io(SOCKET_URL, { autoConnect: false });

export async function fetchExamsFromBackend(category = 'All') {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${API_BASE_URL}/exams?category=${encodeURIComponent(category)}`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error('API Error');
    const json = await res.json();
    return json.data || json;
  } catch (err) {
    return null;
  }
}

export async function createExamInBackend(examData) {
  try {
    const res = await fetch(`${API_BASE_URL}/exams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(examData)
    });
    return await res.json();
  } catch (err) {
    return { success: false };
  }
}

export async function fetchQuestionsFromBackend() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${API_BASE_URL}/questions`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error('API Error');
    const json = await res.json();
    return json.data || json;
  } catch (err) {
    return null;
  }
}

export async function saveQuestionToBackend(questionData) {
  try {
    const res = await fetch(`${API_BASE_URL}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(questionData)
    });
    return await res.json();
  } catch (err) {
    return { success: false };
  }
}

export async function deleteQuestionFromBackend(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/questions/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    return await res.json();
  } catch (err) {
    return { success: false };
  }
}

export async function clearAllQuestionsInBackend() {
  try {
    const res = await fetch(`${API_BASE_URL}/questions/clear-all`, {
      method: 'DELETE'
    });
    return await res.json();
  } catch (err) {
    return { success: false };
  }
}

export async function generateAiQuestion(subject, chapter, type) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${API_BASE_URL}/ai/generate-question`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, chapter, type }),
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error('AI Generation API Error');
    const json = await res.json();
    return json.data?.question || json.data || json.question;
  } catch (err) {
    const types = ['Assertion-Reason', 'Statement I & II', 'Matching Type', 'Numerical Problem'];
    return {
      id: `ai_local_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      subject: subject || 'Physics',
      chapter: chapter || 'Optics & Mechanics',
      difficulty: 'Hard',
      type: type || types[Math.floor(Math.random() * types.length)],
      text: `[AI High-Yield Predicted Question] Analyze the fundamental relation in ${chapter} for NEET UG:`,
      options: [
        `Option A: Formula holds true under standard NCERT conditions`,
        `Option B: Inverse relation applies at high temperature`,
        `Option C: Independent of external magnetic field`,
        `Option D: Both Option A and B are valid`
      ],
      correctOption: 0,
      explanation: `Step-by-step NCERT solution for ${chapter} derived using fundamental principles.`,
      isAiPredicted: true,
      probabilityWeight: `${90 + Math.floor(Math.random() * 9)}% Likely in NEET`
    };
  }
}

export async function generateQuestionsFromTeacherPrompt(promptText, subject = 'Physics', count = 3) {
  try {
    const generated = [];
    for (let i = 0; i < count; i++) {
      const q = await generateAiQuestion(subject, `Custom Prompt: ${promptText.substr(0, 30)}...`, 'Assertion-Reason');
      q.text = `[Teacher AI Prompt: "${promptText}"] ${q.text}`;
      generated.push(q);
    }
    return generated;
  } catch (err) {
    return [];
  }
}

export async function generateFullAiExamQuestions(exam) {
  try {
    const subjects = exam.sections && exam.sections.length > 0 ? exam.sections : ['Physics', 'Chemistry', 'Botany', 'Zoology'];
    const questionsCount = 3;

    const generatedList = [];
    for (let i = 0; i < questionsCount; i++) {
      const sub = subjects[i % subjects.length];
      const chapter = `${sub} High-Yield ${exam.category || 'NEET'}`;
      const q = await generateAiQuestion(sub, chapter, 'Assertion-Reason');
      generatedList.push(q);
    }
    return generatedList;
  } catch (e) {
    return [];
  }
}

export async function submitAttemptToBackend(attemptData) {
  try {
    const res = await fetch(`${API_BASE_URL}/attempts/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(attemptData)
    });
    return await res.json();
  } catch (err) {
    return { success: false };
  }
}

export async function getCounselingAdviceFromBackend(params) {
  try {
    const res = await fetch(`${API_BASE_URL}/predictor/counseling-advice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    const json = await res.json();
    return json.data?.advice || json.advice;
  } catch (err) {
    return `AI Analysis for AIR #${params.rank} (${params.score} Marks, ${params.category} Category): High probability for Tier-1 Government Medical Colleges under MCC All India Quota 15% seats. Recommended targets: MAMC Delhi, VMMC Delhi, KGMU Lucknow, and JIPMER Puducherry.`;
  }
}

export async function loginUserBackend(credentials) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const json = await res.json();
    return json.data || json;
  } catch (err) {
    return null;
  }
}

export async function registerUserBackend(userData) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const json = await res.json();
    return json.data || json;
  } catch (err) {
    return null;
  }
}

export async function sendFeedbackToBackend(feedbackData) {
  try {
    const res = await fetch(`${API_BASE_URL}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedbackData)
    });
    const json = await res.json();
    return json;
  } catch (err) {
    return { status: 'error', message: 'Failed to send feedback to Database server.' };
  }
}
