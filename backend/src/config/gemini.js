const { GoogleGenerativeAI } = require('@google/generative-ai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
let genAI = null;

if (GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  console.log('✅ Google Gemini AI Client Initialized');
} else {
  console.log('⚠️ GEMINI_API_KEY not set in .env file');
}

module.exports = { genAI };
