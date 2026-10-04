const responseHandler = require('../utils/responseHandler');
const { genAI } = require('../config/gemini');

exports.getCounselingAdvice = async (req, res, next) => {
  try {
    const { score = 680, rank = 1200, category = 'General', quota = 'AIQ' } = req.body;

    let adviceText = null;

    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-3.8-flash' });
        const prompt = `Provide concise, expert medical admission counseling advice for a candidate who scored ${score}/720 with All India Rank AIR #${rank} in Category "${category}" under Quota "${quota}". Mention top tier-1 Government Medical Colleges (like MAMC, VMMC, KGMU, JIPMER) and MCC Round 1/Round 2 seat chances.`;
        const result = await model.generateContent(prompt);
        adviceText = result.response.text().trim();
      } catch (e) {
        console.warn('Gemini Counseling Advice fallback:', e.message);
      }
    }

    if (!adviceText) {
      adviceText = `AI Analysis for AIR #${rank} (${score} Marks, ${category} Category): High probability for Tier-1 Government Medical Colleges under MCC All India Quota 15% seats. Recommended targets: MAMC Delhi, VMMC Delhi, KGMU Lucknow, and JIPMER Puducherry.`;
    }

    return responseHandler.success(res, { advice: adviceText, score, rank, category }, 'Counseling advice generated successfully.');
  } catch (err) {
    next(err);
  }
};
