const { Pool } = require('pg');

const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:secretpassword@localhost:5432/neet_cbt_db';
const isCloudDb = dbUrl.includes('neon.tech') || dbUrl.includes('sslmode=require');

const pool = new Pool({
  connectionString: dbUrl,
  ssl: isCloudDb ? { rejectUnauthorized: false } : false
});

async function initPgDatabase() {
  const statements = [
    `CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(100) PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role VARCHAR(50) DEFAULT 'student',
      phone VARCHAR(50),
      avatar TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS questions (
      id VARCHAR(100) PRIMARY KEY,
      subject VARCHAR(100),
      chapter VARCHAR(150),
      difficulty VARCHAR(50),
      type VARCHAR(50),
      text TEXT,
      options TEXT,
      correct_option INT,
      explanation TEXT,
      is_ai_predicted BOOLEAN DEFAULT FALSE,
      probability_weight VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS exams (
      id VARCHAR(100) PRIMARY KEY,
      title VARCHAR(200),
      category VARCHAR(50),
      code VARCHAR(50),
      duration_min INT,
      total_marks INT,
      question_count INT,
      marking_scheme VARCHAR(100),
      sections TEXT,
      proctoring_level VARCHAR(50),
      created_by VARCHAR(100),
      allowed_student_emails TEXT,
      question_ids TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS attempts (
      id VARCHAR(100) PRIMARY KEY,
      exam_id VARCHAR(100),
      student_name VARCHAR(100),
      student_email VARCHAR(100),
      score INT,
      total_possible_score INT,
      correct_count INT,
      incorrect_count INT,
      unattempted_count INT,
      accuracy INT,
      submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      responses TEXT,
      proctor_logs TEXT
    );`,

    `CREATE TABLE IF NOT EXISTS teams (
      id VARCHAR(100) PRIMARY KEY,
      name VARCHAR(150),
      description TEXT,
      avatar VARCHAR(255),
      type VARCHAR(100),
      member_count INT,
      target_score VARCHAR(100),
      rank VARCHAR(100),
      creator VARCHAR(100),
      members TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,

    `ALTER TABLE exams ADD COLUMN IF NOT EXISTS allowed_student_emails TEXT;`,
    `ALTER TABLE attempts ADD COLUMN IF NOT EXISTS student_email VARCHAR(100);`,
    `ALTER TABLE exams ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;`,
    `ALTER TABLE questions ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;`,
    `DELETE FROM questions WHERE id LIKE 'ai_%';`
  ];

  for (const stmt of statements) {
    try {
      await pool.query(stmt);
    } catch (err) {
      console.warn('⚠️ Statement Notice:', err.message);
    }
  }
  console.log('🐘 Live PostgreSQL Database Connected & Cleaned (0 Pre-loaded Questions)!');
}

module.exports = { pool, initPgDatabase };
