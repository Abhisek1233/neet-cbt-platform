const { pool } = require('../config/db');

const memoryExams = [
  {
    id: 'exam-full-01',
    title: 'NTA Official NEET UG 2026 Grand All-India Mock Test #1',
    category: 'Full-Length',
    code: 'NTA-NEET-2026-MOCK1',
    durationMin: 200,
    totalMarks: 720,
    questionCount: 200,
    markingScheme: '+4 / -1',
    sections: ['Physics', 'Chemistry', 'Botany', 'Zoology'],
    proctoringLevel: 'Strict AI',
    createdBy: 'Dr. R.K. Sharma',
    questionIds: ['p1', 'p2', 'c1', 'b1', 'z1']
  },
  {
    id: 'exam-ai-predicted-01',
    title: 'NEET 2026 AI Predicted High-Yield Question Paper',
    category: 'AI-Predicted',
    code: 'AI-PREDICTED-2026',
    durationMin: 200,
    totalMarks: 720,
    questionCount: 200,
    markingScheme: '+4 / -1',
    sections: ['Physics', 'Chemistry', 'Botany', 'Zoology'],
    proctoringLevel: 'Strict AI',
    createdBy: 'Google Gemini AI Model',
    questionIds: ['p1', 'p2', 'c1', 'b1', 'z1']
  }
];

exports.getExams = async (req, res) => {
  const { category } = req.query;
  try {
    let sql = 'SELECT * FROM exams';
    let params = [];
    if (category && category !== 'All') {
      sql += ' WHERE category = $1';
      params.push(category);
    }
    const result = await pool.query(sql, params);
    if (result.rows.length === 0) {
      const filtered = memoryExams.filter(e => category === 'All' || !category || e.category === category);
      return res.json(filtered);
    }

    const formatted = result.rows.map(r => ({
      id: r.id,
      title: r.title,
      category: r.category,
      code: r.code,
      durationMin: r.duration_min,
      totalMarks: r.total_marks,
      questionCount: r.question_count,
      markingScheme: r.marking_scheme,
      sections: (r.sections || '').split(','),
      proctoringLevel: r.proctoring_level,
      createdBy: r.created_by,
      questionIds: (r.question_ids || '').split(',')
    }));
    res.json(formatted);
  } catch (err) {
    const filtered = memoryExams.filter(e => category === 'All' || !category || e.category === category);
    res.json(filtered);
  }
};
