require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const errorHandler = require('./middleware/errorHandler');

const authRoutes       = require('./routes/auth');
const careersRoutes    = require('./routes/careers');
const examsRoutes      = require('./routes/exams');
const collegesRoutes   = require('./routes/colleges');
const skillsRoutes     = require('./routes/skills');
const userRoutes       = require('./routes/user');
const assessmentRoutes = require('./routes/assessment');
const progressRoutes   = require('./routes/progress');
const dashboardRoutes  = require('./routes/dashboard');
const adminRoutes      = require('./routes/admin');

const app = express();

const originsEnv = process.env.CORS_ORIGINS || '*';
const corsOrigins = originsEnv === '*' ? '*' : originsEnv.split(',');

app.use(cors({
  origin: corsOrigins,
  credentials: corsOrigins !== '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.use('/api/auth',        authRoutes);
app.use('/api/careers',     careersRoutes);
app.use('/api/exams',       examsRoutes);
app.use('/api/colleges',    collegesRoutes);
app.use('/api/skills',      skillsRoutes);
app.use('/api/user',        userRoutes);
app.use('/api/assessment',  assessmentRoutes);
app.use('/api/progress',    progressRoutes);
app.use('/api/dashboard',   dashboardRoutes);
app.use('/api/admin',       adminRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use((req, res) => res.status(404).json({ detail: 'Route not found' }));

app.use(errorHandler);

module.exports = app;
