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

// // Create a new code block
// router.post('/', async (req, res) => {
//   const { title, content, solution } = req.body;
//   const newCodeBlock = new CodeBlock({ title, content, solution });
//   try {
//     const savedCodeBlock = await newCodeBlock.save();
//     res.status(201).json(savedCodeBlock);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// Update a code block
router.put('/:id', async (req, res) => {
  try {
    const updatedCodeBlock = await CodeBlock.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCodeBlock) return res.status(404).json({ message: 'CodeBlock not found' });
    res.json(updatedCodeBlock);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a code block
// router.delete('/:id', async (req, res) => {
//   try {
//     const deletedCodeBlock = await CodeBlock.findByIdAndDelete(req.params.id);
//     if (!deletedCodeBlock) return res.status(404).json({ message: 'CodeBlock not found' });
//     res.json({ message: 'CodeBlock deleted' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

module.exports = router;
