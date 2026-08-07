const { pool } = require('../config/db');

class Question {
  static async findAll() {
    try {
      const result = await pool.query('SELECT * FROM questions ORDER BY created_at DESC');
      return result.rows.map(r => ({
        id: r.id,
        subject: r.subject,
        chapter: r.chapter,
        difficulty: r.difficulty,
        type: r.type,
        text: r.text,
        options: JSON.parse(r.options || '[]'),
        correctOption: r.correct_option,
        explanation: r.explanation,
        isAiPredicted: r.is_ai_predicted,
        probabilityWeight: r.probability_weight
      }));
    } catch (e) {
      return [];
    }
  }

  static async create(q) {
    try {
      await pool.query(
        `INSERT INTO questions (id, subject, chapter, difficulty, type, text, options, correct_option, explanation, is_ai_predicted, probability_weight)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [q.id, q.subject, q.chapter, q.difficulty, q.type, q.text, JSON.stringify(q.options), q.correctOption, q.explanation, q.isAiPredicted, q.probabilityWeight]
      );
    } catch (e) {
      console.warn('Question Model Save:', e.message);
    }
    return q;
  }
}

module.exports = Question;
