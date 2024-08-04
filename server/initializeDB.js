// server/initializeDatabase.js

const mongoose = require('mongoose');
const CodeBlock = require('./models/CodeBlock');
require('dotenv').config();

const codeBlocks = [
  {
    title: 'Async Case',
    content: 'console.log("Async Case");',
    solution: 'console.log("Async Solution");'
  },
  {
    title: 'Sync Case',
    content: 'console.log("Sync Case");',
    solution: 'console.log("Sync Solution");'
  },
  {
    title: 'Promise Case',
    content: 'console.log("Promise Case");',
    solution: 'console.log("Promise Solution");'
  },
  {
    title: 'Event Loop Case',
    content: 'console.log("Event Loop Case");',
    solution: 'console.log("Event Loop Solution");'
  }
];

async function initializeDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');

    await CodeBlock.deleteMany(); // Clear the collection
    console.log('Cleared existing code blocks');

    const createdCodeBlocks = await CodeBlock.insertMany(
      codeBlocks.map(block => ({
        ...block,
        _id: new mongoose.Types.ObjectId() // Automatically generate a new ObjectId
      }))
    );
    console.log('Code blocks created:', createdCodeBlocks);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase();
