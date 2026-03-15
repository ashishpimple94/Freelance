const express = require('express');
const Payment = require('../models/Payment');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch payments' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { agency, project, amount } = req.body;
    if (!agency || !project) return res.status(400).json({ message: 'Agency and project are required' });
    if (!amount || amount <= 0) return res.status(400).json({ message: 'Valid amount is required' });
    const payment = new Payment(req.body);
    await payment.save();
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create payment' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update payment' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json({ message: 'Payment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete payment' });
  }
});

module.exports = router;
