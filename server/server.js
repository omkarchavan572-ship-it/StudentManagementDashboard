const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');
const User = require('./models/User');

// Load env vars
dotenv.config();

// Connect to Database
connectDB().then(async () => {
  // Auto-seed admin user if no users exist
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('No admin user found. Automatically triggering seed database...');
      const seeder = require('./utils/seeder');
    }
  } catch (err) {
    console.log('Auto-seed check note:', err.message);
  }
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/exams', require('./routes/examRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    app: 'Student Management Dashboard Backend',
    timestamp: new Date().toISOString()
  });
});

// Central Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
