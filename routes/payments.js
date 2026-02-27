const express = require('express');
const Payment = require('../models/Payment');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    console.error('Get payments error:', err);
    res.status(500).json({ message: 'Failed to fetch payments' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { agency, project, amount } = req.body;
    
    if (!agency || !project) {
      return res.status(400).json({ message: 'Agency and project are required' });
    }
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid amount is required' });
    }

    const payment = new Payment({ ...req.body, userId: req.user.userId });
    await payment.save();
    res.json(payment);
  } catch (err) {
    console.error('Create payment error:', err);
    res.status(500).json({ message: 'Failed to create payment' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const payment = await Payment.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    res.json(payment);
  } catch (err) {
    console.error('Update payment error:', err);
    res.status(500).json({ message: 'Failed to update payment' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const payment = await Payment.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    res.json({ message: 'Payment deleted successfully' });
  } catch (err) {
    console.error('Delete payment error:', err);
    res.status(500).json({ message: 'Failed to delete payment' });
  }
});

module.exports = router;
