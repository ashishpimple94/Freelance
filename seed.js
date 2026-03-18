const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);

  const email = 'admin@freelance.com';
  const existing = await User.findOne({ email });

  if (existing) {
    console.log('Admin user already exists:', email);
    process.exit(0);
  }

  const hashed = await bcrypt.hash('Fr33l@nce#Secure$2024!', 10);
  await User.create({ name: 'Admin', email, password: hashed });

  console.log('✅ Admin user created!');
  console.log('Email:', email);
  console.log('Password: Fr33l@nce#Secure$2024!');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
