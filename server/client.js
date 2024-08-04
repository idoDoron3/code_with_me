const io = require('socket.io-client');
const mongoose = require('mongoose');

// Create a WebSocket connection
const socket = io('http://localhost:5000');

// Generate valid ObjectIds for the rooms
const roomId1 = new mongoose.Types.ObjectId().toString();
const roomId2 = new mongoose.Types.ObjectId().toString();

socket.on('connect', () => {
  console.log('Connected to WebSocket server');

  // Join a room as mentor
  socket.emit('joinRoom', roomId1);

  // Join another room as student
  socket.emit('joinRoom', roomId2);

  // Send code update to the first room
  socket.emit('updateCode', { roomId: roomId1, updatedCode: 'console.log("Updated Code for Room 1");' });

  // Send code update to the second room
  socket.emit('updateCode', { roomId: roomId2, updatedCode: 'console.log("Updated Code for Room 2");' });
});

socket.on('assignedRole', (role) => {
  console.log('Assigned role:', role);
});

socket.on('codeUpdated', (updatedCode) => {
  console.log('Code updated:', updatedCode);
});

socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server');
});

socket.on('error', (error) => {
  console.error('WebSocket error:', error);
});
