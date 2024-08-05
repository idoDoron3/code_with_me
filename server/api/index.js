const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const socketManager = require('../socketManager');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*', // Allow all origins
    methods: ["GET", "POST"]
  }
});

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Routes setup
const codeBlockRoutes = require('../routes/codeblocks');
app.use('/api/codeblocks', codeBlockRoutes);
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// WebSocket setup
socketManager(io);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = (req, res) => {
  // Check if the request path does not start with '/api' or is exactly '/'
  if ((req && typeof req.path === 'string') && (!req.path.startsWith('/api') || req.path === '/')) {
    console.log(`WEBSOCKET ${req.path}`)
    server.emit('request', req, res); // Emit 'request' event to handle the WebSocket upgrade
  } else {
    app(req, res);
  }
};
