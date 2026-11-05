const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const seedAll = require('./seed/seedData');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const practiceRoutes = require('./routes/practiceRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const companyRoutes = require('./routes/companyRoutes');
const adminRoutes = require('./routes/adminRoutes');
const assistantRoutes = require('./routes/assistantRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Real-Time Action Logger for Terminal Visibility
app.use((req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toLocaleTimeString();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const icon = status >= 400 ? '⚠️' : '⚡';
    console.log(`[${timestamp}] ${icon} ${req.method} ${req.originalUrl} | Status: ${status} (${duration}ms)`);
  });
  
  next();
});

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Smart Career Coach API is running smooth!', timestamp: new Date() });
});

// Mounting API Routes
app.use('/api/auth', authRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/assistant', assistantRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[SERVER] ❌ Unhandled error:', err.stack);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Initialize DB and Start Server
const startServer = async () => {
  try {
    await connectDB();
    
    // Run seed check for both questions and users
    const Question = require('./models/Question');
    const User = require('./models/User');

    const [qCount, uCount] = await Promise.all([
      Question.countDocuments(),
      User.countDocuments()
    ]);

    if (qCount === 0 || uCount === 0) {
      console.log('[DATABASE] 🔄 Seeding questions & default demo accounts (student@smartcareer.com / admin@smartcareer.com)...');
      await seedAll();
      console.log('[DATABASE] ✅ Seeding complete!');
    } else {
      console.log(`[DATABASE] 📊 Database initialized with ${qCount} questions and ${uCount} user records.`);
    }

    const server = app.listen(PORT, () => {
      console.log(`\n========================================================================`);
      console.log(`🚀 SMART CAREER COACH BACKEND ONLINE ON PORT ${PORT}`);
      console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
      console.log(`🐶 Barkley AI Companion Connected & Logging Actions`);
      console.log(`⚡ Ready for User Actions: Login, Tests, Mock Interviews, Resumes`);
      console.log(`========================================================================\n`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`[SERVER] ❌ Port ${PORT} is already in use. The API may already be running. Stop the other server or set PORT to an unused port, then try again.`);
      } else {
        console.error('[SERVER] ❌ Failed to start HTTP server:', err);
      }
      process.exit(1);
    });
  } catch (err) {
    console.error('[SERVER] ❌ Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();
