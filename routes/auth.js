const express = require('express');
const router = express.Router();

const ADMIN_EMAIL = 'admin@freelancemanager.com';
const ADMIN_PASSWORD = 'FL@Manager#9408';

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    res.json({ success: true, user: { name: 'Admin', email } });
  } else {
    res.status(400).json({ message: 'Invalid email or password' });
  }
});

module.exports = router;
