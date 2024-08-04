const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const socketManager = require('./socketManager');

class AppServer {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    // // this.io = socketIo(this.server, {
    // //   cors: {
    // //     origin: "http://localhost:3000",
    // //     methods: ["GET", "POST"]
    // //   }
    // // });
    // this.io = socketIo(this.server); // Initialize socket.io without specific CORS settings
    this.io = socketIo(this.server, {
      cors: {
        origin: '*', // Allow all origins
        methods: ["GET", "POST"]
      }
    });
    this.connectToDatabase();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupWebSocket();
    this.startServer();
  }

  connectToDatabase() {
    mongoose.connect(process.env.MONGODB_URI, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    })
      .then(() => console.log('MongoDB connected'))
      .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
      });
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(morgan('combined'));
  }

  setupRoutes() {
    const codeBlockRoutes = require('./routes/codeblocks');
    this.app.use('/api/codeblocks', codeBlockRoutes);
    this.app.get('/', (req, res) => {
      res.send('Hello World!');
    });
  }

  setupWebSocket() {
    socketManager(this.io);
  }

  startServer() {
    const PORT = process.env.PORT || 5000;
    this.server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
}

new AppServer();
