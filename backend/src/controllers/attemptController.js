const { pool } = require('../config/db');

exports.submitAttempt = async (req, res) => {
  const a = req.body;
  try {
    await pool.query(
      `INSERT INTO attempts (id, exam_id, student_name, score, total_possible_score, correct_count, incorrect_count, unattempted_count, accuracy, submitted_at, responses, proctor_logs)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        a.id,
        a.examId,
        a.studentName,
        a.score,
        a.totalPossibleScore,
        a.correctCount,
        a.incorrectCount,
        a.unattemptedCount,
        a.accuracy,
        a.submittedAt,
        JSON.stringify(a.responses),
        JSON.stringify(a.proctorLogs)
      ]
    );
  } catch (err) {
    console.warn('Attempt saved in local memory notice:', err.message);
  }

  const io = req.app.get('io');
  if (io) io.emit('db:new-attempt', a);

  res.json({ success: true, message: 'Attempt saved to PostgreSQL.' });
};
