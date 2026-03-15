const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  client: { type: String, required: true },
  website: { type: String, required: true },
  domain: String,
  type: { type: String, enum: ['One-time', 'Monthly'], default: 'One-time' },
  cost: Number,
  deadline: Date,
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);
