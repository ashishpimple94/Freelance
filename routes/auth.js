const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const ADMIN_EMAIL = 'admin@freelancemanager.com';
const ADMIN_PASSWORD = 'FL@Manager#9408';

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD)
    return res.status(400).json({ message: 'Invalid email or password' });

  const token = jwt.sign(
    { email, name: 'Admin' },
    process.env.JWT_SECRET || 'fallback_secret_key_2024',
    { expiresIn: '7d' }
  );

  res.json({ token, user: { name: 'Admin', email } });
});

module.exports = router;
