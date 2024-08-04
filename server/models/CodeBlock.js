const mongoose = require('mongoose');

const CodeBlockSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  solution: { type: String, required: true },
  // mentorId: { type: String },
  // students: { type: [String], default: [] },
  // isSolved: { type: Boolean, default: false },
},{ collection: 'codeblocks' });

module.exports = mongoose.model('CodeBlock', CodeBlockSchema);
