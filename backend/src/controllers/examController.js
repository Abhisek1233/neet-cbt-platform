const { pool } = require('../config/db');

const memoryExams = [
  {
    id: 'exam-full-01',
    title: 'NTA Official NEET UG Grand All-India Mock Test #1',
    category: 'Full-Length',
    code: 'NTA-NEET-MOCK1',
    durationMin: 200,
    totalMarks: 720,
    questionCount: 200,
    markingScheme: '+4 / -1',
    sections: ['Physics', 'Chemistry', 'Botany', 'Zoology'],
    proctoringLevel: 'Strict AI',
    createdBy: 'Dr. R.K. Sharma',
    questionIds: []
  },
  {
    id: 'exam-full-02',
    title: 'All-India National Level NEET Grand Test #2 (200Q Pattern)',
    category: 'Full-Length',
    code: 'NTA-NEET-GRAND-02',
    durationMin: 200,
    totalMarks: 720,
    questionCount: 200,
    markingScheme: '+4 / -1',
    sections: ['Physics', 'Chemistry', 'Botany', 'Zoology'],
    proctoringLevel: 'Strict AI',
    createdBy: 'NTA National Board (Simulated)',
    questionIds: []
  },
  {
    id: 'exam-sub-physics',
    title: 'NEET Physics Special: Electrodynamics & Ray Optics',
    category: 'Subject-Wise',
    code: 'SUB-PHY-50Q',
    durationMin: 50,
    totalMarks: 180,
    questionCount: 50,
    markingScheme: '+4 / -1',
    sections: ['Physics'],
    proctoringLevel: 'Strict AI',
    createdBy: 'Prof. V. K. Mehta',
    questionIds: []
  },
  {
    id: 'exam-sub-chemistry',
    title: 'NEET Chemistry Master Mock: Organic & Physical Equilibrium',
    category: 'Subject-Wise',
    code: 'SUB-CHEM-50Q',
    durationMin: 50,
    totalMarks: 180,
    questionCount: 50,
    markingScheme: '+4 / -1',
    sections: ['Chemistry'],
    proctoringLevel: 'Moderate',
    createdBy: 'Dr. S. K. Roy',
    questionIds: []
  },
  {
    id: 'exam-sub-botany',
    title: 'NEET Botany & Genetics Special Mock Test',
    category: 'Subject-Wise',
    code: 'SUB-BOTANY-50Q',
    durationMin: 50,
    totalMarks: 180,
    questionCount: 50,
    markingScheme: '+4 / -1',
    sections: ['Botany'],
    proctoringLevel: 'Basic',
    createdBy: 'Dr. Ananya Verma',
    questionIds: []
  },
  {
    id: 'exam-sub-zoology',
    title: 'NEET Zoology Human Physiology & Biotechnology Special',
    category: 'Subject-Wise',
    code: 'SUB-ZOO-50Q',
    durationMin: 50,
    totalMarks: 180,
    questionCount: 50,
    markingScheme: '+4 / -1',
    sections: ['Zoology'],
    proctoringLevel: 'Strict AI',
    createdBy: 'Dr. R.K. Sharma',
    questionIds: []
  },
  {
    id: 'exam-topic-optics',
    title: 'Ray Optics & Optical Instruments Chapter Speed Test',
    category: 'Topic-Wise',
    code: 'TOPIC-OPTICS-20Q',
    durationMin: 25,
    totalMarks: 80,
    questionCount: 20,
    markingScheme: '+4 / -1',
    sections: ['Physics'],
    proctoringLevel: 'Standard',
    createdBy: 'AI Speed Test Engine',
    questionIds: []
  },
  {
    id: 'exam-topic-genetics',
    title: 'Mendelian Genetics & Molecular Inheritance Speed Quiz',
    category: 'Topic-Wise',
    code: 'TOPIC-GEN-20Q',
    durationMin: 25,
    totalMarks: 80,
    questionCount: 20,
    markingScheme: '+4 / -1',
    sections: ['Botany'],
    proctoringLevel: 'Standard',
    createdBy: 'Botany Department',
    questionIds: []
  },
  {
    id: 'exam-ai-predicted-01',
    title: 'NEET AI Predicted High-Yield Question Paper',
    category: 'AI-Predicted',
    code: 'AI-PREDICTED-PAPER',
    durationMin: 200,
    totalMarks: 720,
    questionCount: 200,
    markingScheme: '+4 / -1',
    sections: ['Physics', 'Chemistry', 'Botany', 'Zoology'],
    proctoringLevel: 'Strict AI',
    createdBy: 'Google Gemini AI Model',
    questionIds: []
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
