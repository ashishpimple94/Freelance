const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  agency: { type: String, required: true },
  project: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['Project', 'Monthly'], default: 'Project' },
  status: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
  dueDate: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);
