const express = require('express');
const Client = require('../models/Client');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const clients = await Client.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(clients);
  } catch (err) {
    console.error('Get clients error:', err);
    res.status(500).json({ message: 'Failed to fetch clients' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { name, email } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const client = new Client({ ...req.body, userId: req.user.userId });
    await client.save();
    res.json(client);
  } catch (err) {
    console.error('Create client error:', err);
    res.status(500).json({ message: 'Failed to create client' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    res.json(client);
  } catch (err) {
    console.error('Update client error:', err);
    res.status(500).json({ message: 'Failed to update client' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const client = await Client.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    res.json({ message: 'Client deleted successfully' });
  } catch (err) {
    console.error('Delete client error:', err);
    res.status(500).json({ message: 'Failed to delete client' });
  }
});

module.exports = router;
