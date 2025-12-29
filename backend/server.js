import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDatabase, closeDatabase } from './db.js';
import examsRouter from './routes/exams.js';
import summariesRouter from './routes/summaries.js';
import videosRouter from './routes/videos.js';
import livesRouter from './routes/lives.js';
import chatRouter from './routes/chat.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security: Restrict CORS to specific origins
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:5173').split(',');
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' })); // Reduced from 500mb for security
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Security: Add security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'EduFlow Backend is running' });
});

// Routes
app.use('/api/exams', examsRouter);
app.use('/api/summaries', summariesRouter);
app.use('/api/videos', videosRouter);
app.use('/api/lives', livesRouter);
app.use('/api/chat', chatRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  // Don't expose internal error details to client
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
async function startServer() {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`\n🚀 EduFlow Backend running on http://localhost:${PORT}`);
      console.log(`📊 API endpoints:`);
      console.log(`   - GET  /api/exams`);
      console.log(`   - POST /api/exams`);
      console.log(`   - GET  /api/summaries`);
      console.log(`   - POST /api/summaries`);
      console.log(`   - GET  /api/videos`);
      console.log(`   - POST /api/videos`);
      console.log(`   - GET  /api/lives`);
      console.log(`   - POST /api/lives`);
      console.log(`   - POST /api/chat\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n📛 Shutting down...');
  await closeDatabase();
  process.exit(0);
});

startServer();
