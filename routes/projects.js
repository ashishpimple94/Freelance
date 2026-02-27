const express = require('express');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error('Get projects error:', err);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { client, website } = req.body;
    
    if (!client || !website) {
      return res.status(400).json({ message: 'Client and website name are required' });
    }

    const project = new Project({ ...req.body, userId: req.user.userId });
    await project.save();
    res.json(project);
  } catch (err) {
    console.error('Create project error:', err);
    res.status(500).json({ message: 'Failed to create project' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
  } catch (err) {
    console.error('Update project error:', err);
    res.status(500).json({ message: 'Failed to update project' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('Delete project error:', err);
    res.status(500).json({ message: 'Failed to delete project' });
  }
});

module.exports = router;
