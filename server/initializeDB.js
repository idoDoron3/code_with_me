// server/initializeDatabase.js

const mongoose = require('mongoose');
const CodeBlock = require('./models/CodeBlock');
require('dotenv').config();

const codeBlocks = [
  {
    title: 'Async Case',
    content: `
      // Task: Complete the async function to fetch data from an API.
      async function fetchData() {
        // Complete the code here
      }
      
      fetchData().then(data => console.log(data)).catch(error => console.error(error));
    `,
    solution: `
      async function fetchData() {
        const response = await fetch('https://api.example.com/data');
        return response.json();
      }
      
      fetchData().then(data => console.log(data)).catch(error => console.error(error));
    `
  },
  {
    title: 'Sync Case',
    content: `
      // Task: Complete the function to calculate the sum of an array synchronously.
      function calculateSum(arr) {
        // Complete the code here
      }
      
      const numbers = [1, 2, 3, 4, 5];
      console.log(calculateSum(numbers));
    `,
    solution: `
      function calculateSum(arr) {
        return arr.reduce((sum, num) => sum + num, 0);
      }
      
      const numbers = [1, 2, 3, 4, 5];
      console.log(calculateSum(numbers));
    `
  },
  {
    title: 'Promise Case',
    content: `
      // Task: Complete the function to return a promise that resolves with a greeting message.
      function getGreeting(name) {
        // Complete the code here
      }
      
      getGreeting('John').then(message => console.log(message)).catch(error => console.error(error));
    `,
    solution: `
      function getGreeting(name) {
        return new Promise((resolve, reject) => {
          if (name) {
            resolve('Hello, ' + name + '!');
          } else {
            reject('Name is required.');
          }
        });
      }
      
      getGreeting('John').then(message => console.log(message)).catch(error => console.error(error));
    `
  },
  {
    title: 'Event Loop Case',
    content: `
      // Task: Complete the code to demonstrate the event loop in JavaScript.
      console.log('Start');
      
      setTimeout(() => {
        console.log('Timeout');
        // Complete the code here
      }, 0);
      
      console.log('End');
    `,
    solution: `
      console.log('Start');
      
      setTimeout(() => {
        console.log('Timeout');
        console.log('More work');
      }, 0);
      
      console.log('End');
    `
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
