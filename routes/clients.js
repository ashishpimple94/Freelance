const express = require('express');
const Client = require('../models/Client');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch clients' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ message: 'Name and email are required' });
    const client = new Client(req.body);
    await client.save();
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create client' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update client' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json({ message: 'Client deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete client' });
  }
});

module.exports = router;
