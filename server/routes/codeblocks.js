const express = require('express');
const router = express.Router();
const CodeBlock = require('../models/CodeBlock');

// Get all code blocks
router.get('/', async (req, res) => {
  try {
    const codeBlocks = await CodeBlock.find();
    res.json(codeBlocks);
  } catch (err) {
    console.error('Error fetching code blocks:', err); // Add this line
    res.status(500).json({ message: err.message });
  }
});

// Get a specific code block
router.get('/:id', async (req, res) => {
  try {
    const codeBlock = await CodeBlock.findById(req.params.id);
    if (!codeBlock) return res.status(404).json({ message: 'CodeBlock not found' });
    res.json(codeBlock);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
