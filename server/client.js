const io = require('socket.io-client');
const mongoose = require('mongoose');

// Create multiple socket.io connections
const socket1 = io('http://localhost:5000');
const socket2 = io('http://localhost:5000');
const socket3 = io('http://localhost:5000');
const socket4 = io('http://localhost:5000');

// Generate valid ObjectIds for the rooms
const roomId1 = new mongoose.Types.ObjectId().toString();
const roomId2 = new mongoose.Types.ObjectId().toString();

const setupSocket = (socket, clientNumber, roomId) => {
  socket.on('connect', () => {
    console.log(`Client ${clientNumber} connected to WebSocket server`);

    // Join a room
    socket.emit('joinRoom', roomId);

    // Send code update after joining
    setTimeout(() => {
      socket.emit('updateCode', { roomId, updatedCode: `console.log("Client ${clientNumber} updated code for Room");` });
    }, 2000);
  });

  socket.on('codeUpdated', (data) => {
    console.log(`Message from server to Client ${clientNumber} in Room ${roomId}:`, data);
  });

  socket.on('error', (error) => {
    console.error(`WebSocket error for Client ${clientNumber}:`, error);
  });

  socket.on('disconnect', () => {
    console.log(`Client ${clientNumber} disconnected from WebSocket server`);
  });
};

// Setup WebSocket connections for multiple clients in the same room
setupSocket(socket1, 1, roomId1);
setupSocket(socket2, 2, roomId1);

// Setup WebSocket connections for multiple clients in another room
setupSocket(socket3, 3, roomId2);
setupSocket(socket4, 4, roomId2);
