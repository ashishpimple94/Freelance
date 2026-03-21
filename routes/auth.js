const express = require('express');
const router = express.Router();

const ADMIN_EMAIL = 'admin@freelancemanager.com';
const ADMIN_PASSWORD = 'FL@Manager#9408';

let activeSession = false;

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD)
    return res.status(400).json({ message: 'Invalid email or password' });

  if (activeSession)
    return res.status(403).json({ message: 'Already logged in from another device' });

  activeSession = true;
  res.json({ success: true, user: { name: 'Admin', email } });
});

router.post('/logout', (req, res) => {
  activeSession = false;
  res.json({ success: true });
});

module.exports = router;
