const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  project: { type: String, required: true },
  taskList: [String],
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  deadline: Date,
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);
