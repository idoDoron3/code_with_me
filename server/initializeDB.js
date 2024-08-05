// server/initializeDatabase.js

const mongoose = require('mongoose');
const CodeBlock = require('./models/CodeBlock');
require('dotenv').config();

const codeBlocks = [
  {
    title: 'Async/Await Example',
    content: `async function fetchUserData() {
  // Complete here: Fetch user data from the API
  const response = await fetch(''); // Add API URL
  const data = await response.json();
  console.log(data);
}

// Complete here: Call the function
fetchUserData();
`,
    solution: `async function fetchUserData() {
  try {
    const response = await fetch('https://api.example.com/user');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}

fetchUserData();
`
  },
  {
    title: 'Synchronous Loop Example',
    content: `for (let i = 1; i <= 5; i++) {
  // Complete here: Print each number
  console.log(); // Add the variable to print
}
`,
    solution: `for (let i = 1; i <= 5; i++) {
  console.log(i);
}
`
  },
  {
    title: 'Promise Example',
    content: `const myPromise = new Promise((resolve, reject) => {
  // Complete here: Determine success or failure
  const success = ; // Set to true or false
  if (success) {
    resolve('Operation was successful');
  } else {
    reject('Operation failed');
  }
});

// Complete here: Handle the promise
myPromise.then(result => {
  console.log(result);
}).catch(error => {
  console.error(error);
});
`,
    solution: `const myPromise = new Promise((resolve, reject) => {
  const success = true;
  if (success) {
    resolve('Operation was successful');
  } else {
    reject('Operation failed');
  }
});

myPromise.then(result => {
  console.log(result);
}).catch(error => {
  console.error(error);
});
`
  },
  {
    title: 'Event Loop Example',
    content: `console.log('Start');

// Complete here: Schedule a delayed operation
setTimeout(() => {
  console.log('Timeout');
}, ); // Add delay in milliseconds

console.log('End');
`,
    solution: `console.log('Start');

setTimeout(() => {
  console.log('Timeout');
}, 1000);

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
