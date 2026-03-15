const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Simple password auth middleware
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Freelance@2024';

const checkAuth = (req, res, next) => {
  const password = req.header('X-Password');
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

// Login route
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, password: ADMIN_PASSWORD });
  } else {
    res.status(401).json({ message: 'Invalid password' });
  }
});

app.use('/api/clients', checkAuth, require('./routes/clients'));
app.use('/api/projects', checkAuth, require('./routes/projects'));
app.use('/api/tasks', checkAuth, require('./routes/tasks'));
app.use('/api/payments', checkAuth, require('./routes/payments'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
