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

const { initPgDatabase } = require('./src/config/db');
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

// Security & Logging Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Initialize Database Tables
initPgDatabase();

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
  res.json({ status: 'UP', timestamp: new Date().toISOString(), db: 'Neon Cloud PostgreSQL', ai: 'Google Gemini AI' });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Socket.io Real-Time WebSockets Gateway
io.on('connection', (socket) => {
  console.log('Candidate connected to WebSocket stream:', socket.id);

  socket.on('proctor:telemetry', (data) => {
    io.to('teacher-monitor').emit('proctor:stream', data);
  });

  socket.on('join:teacher-monitor', () => {
    socket.join('teacher-monitor');
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Complete 100% Production Backend running on Port ${PORT}`);
});
