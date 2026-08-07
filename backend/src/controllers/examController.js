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
    let sql = 'SELECT * FROM exams ORDER BY created_at DESC';
    let params = [];
    if (category && category !== 'All') {
      sql = 'SELECT * FROM exams WHERE category = $1 ORDER BY created_at DESC';
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
      allowedStudentEmails: (r.allowed_student_emails || '').split(',').filter(Boolean),
      questionIds: (r.question_ids || '').split(',')
    }));

    // Merge memory exams with database exams
    const allExams = [...formatted, ...memoryExams];
    res.json(allExams);
  } catch (err) {
    const filtered = memoryExams.filter(e => category === 'All' || !category || e.category === category);
    res.json(filtered);
  }
};

exports.createExam = async (req, res) => {
  const exam = req.body;
  try {
    const id = exam.id || `exam_${Date.now()}`;
    const allowedEmailsStr = (exam.allowedStudentEmails || []).join(',');
    const sectionsStr = (exam.sections || ['Physics']).join(',');
    const qIdsStr = (exam.questionIds || []).join(',');

    await pool.query(
      `INSERT INTO exams (id, title, category, code, duration_min, total_marks, question_count, marking_scheme, sections, proctoring_level, created_by, allowed_student_emails, question_ids)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title`,
      [
        id,
        exam.title || 'Teacher Custom Exam',
        exam.category || 'Subject-Wise',
        exam.code || `EXP-${Date.now().toString().slice(-4)}`,
        exam.durationMin || 30,
        exam.totalMarks || 40,
        exam.questionCount || 10,
        '+4 / -1',
        sectionsStr,
        'Strict AI',
        exam.createdBy || 'Teacher HOD',
        allowedEmailsStr,
        qIdsStr
      ]
    );

    res.json({ success: true, examId: id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
