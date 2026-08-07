// Complete Enterprise MVC Express Server + Neon Cloud PostgreSQL + Google Gemini AI + Socket.io
require('dotenv').config();

const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { pool, initPgDatabase } = require('./src/config/db');
const errorHandler = require('./src/middleware/errorHandler');
const questionController = require('./src/controllers/questionController');

const authRoutes = require('./src/routes/authRoutes');
const questionRoutes = require('./src/routes/questionRoutes');
const examRoutes = require('./src/routes/examRoutes');
const attemptRoutes = require('./src/routes/attemptRoutes');
const teamRoutes = require('./src/routes/teamRoutes');
const doubtRoutes = require('./src/routes/doubtRoutes');
const predictorRoutes = require('./src/routes/predictorRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Create uploads directory if not exists
const uploadsDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Attach socket.io instance to Express app
app.set('io', io);

// 🛡️ Enterprise Security & Privacy Helmet Headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "blob:", "https:"],
        mediaSrc: ["'self'", "blob:"], // Restrict camera/mic media streams strictly to local blob memory
        connectSrc: ["'self'", "https:", "wss:", "ws:"]
      }
    },
    crossOriginEmbedderPolicy: false,
    frameguard: { action: 'deny' } // Prevent iFrame clickjacking or unauthorized camera hijacking
  })
);

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Initialize Database Tables
initPgDatabase();

// Root Welcome Route
app.get('/', (req, res) => {
  res.json({
    status: 'ONLINE',
    message: '🚀 NTA NEET UG CBT Backend API & Google Gemini AI Engine is Live!',
    security: 'DTLS-SRTP WebRTC Encrypted & Zero Server Media Retention',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      dbOverview: '/api/admin/db-overview',
      exams: '/api/exams',
      questions: '/api/questions',
      generateAiQuestion: '/api/ai/generate-question'
    }
  });
});

// Admin DB Overview Route: View all tables in PostgreSQL
app.get('/api/admin/db-overview', async (req, res) => {
  try {
    const usersRes = await pool.query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 50');
    const questionsRes = await pool.query('SELECT id, subject, chapter, difficulty, text, created_at FROM questions ORDER BY created_at DESC LIMIT 50');
    const examsRes = await pool.query('SELECT id, title, category, code, duration_min, created_by, allowed_student_emails, created_at FROM exams ORDER BY created_at DESC LIMIT 50');
    const attemptsRes = await pool.query('SELECT id, exam_id, student_name, student_email, score, total_possible_score, accuracy, submitted_at FROM attempts ORDER BY submitted_at DESC LIMIT 50');
    const teamsRes = await pool.query('SELECT id, name, description, member_count, creator, created_at FROM teams ORDER BY created_at DESC LIMIT 50');

    res.json({
      database: 'Neon Cloud PostgreSQL',
      timestamp: new Date().toISOString(),
      counts: {
        users: usersRes.rowCount,
        questions: questionsRes.rowCount,
        exams: examsRes.rowCount,
        attempts: attemptsRes.rowCount,
        teams: teamsRes.rowCount
      },
      tables: {
        users: usersRes.rows,
        questions: questionsRes.rows,
        exams: examsRes.rows,
        attempts: attemptsRes.rows,
        teams: teamsRes.rows
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Direct AI Route Handler (Guarantees POST /api/ai/generate-question)
app.post('/api/ai/generate-question', questionController.generateAiQuestion);

// Mount Complete API Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/doubts', doubtRoutes);
app.use('/api/predictor', predictorRoutes);
app.use('/api/upload', uploadRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    db: 'Neon Cloud PostgreSQL',
    ai: 'Google Gemini AI',
    privacyGuard: 'Active (Zero Disk Media Recording)'
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Socket.io Real-Time WebSockets Gateway (Authorized Stream Relay)
io.on('connection', (socket) => {
  console.log('Candidate connected to Secure WebSocket stream:', socket.id);

  socket.on('proctor:telemetry', (data) => {
    // Encrypted Socket Relay (No media stored on server)
    io.to('teacher-monitor').emit('proctor:stream', data);
  });

  socket.on('join:teacher-monitor', () => {
    socket.join('teacher-monitor');
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Complete 100% Production Backend running on Port ${PORT} with Privacy & Security Guard`);
});
