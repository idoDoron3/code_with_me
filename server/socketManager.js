const CodeBlock = require('./models/CodeBlock');
const mongoose = require('mongoose');

module.exports = (io) => {
  // A map to store the participants of each room
  const roomParticipants = new Map();

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

      // socket.on('joinRoom', ({ roomId }) => {
    socket.on('joinRoom', async ({ roomId }) => {
      socket.join(roomId);

      if (!roomParticipants.has(roomId)) {
        // If the room does not exist, create it with the current socket as the mentor
        roomParticipants.set(roomId, { mentor: socket.id, students: new Set() });
      } else {
        // If the room exists, add the socket as a student
        roomParticipants.get(roomId).students.add(socket.id);

         // Notify the new student with the current code/////////////////////////////////////////
         const mentorId = roomParticipants.get(roomId).mentor;
         if (mentorId) {
           io.to(mentorId).emit('requestCurrentCode', socket.id);
         }
         ////////////////////////////////////////////////////////
      }

      // Determine the role of the socket (mentor or student) and notify the client
      const role = roomParticipants.get(roomId).mentor === socket.id ? 'mentor' : 'student';
      socket.emit('assignedRole', role);

      console.log(`Client ${socket.id} joined room ${roomId} as ${role}`);

      /////////////////////////////////////////
      // Fetch and send the initial code block to the newly joined client
      try {
        const codeBlock = await CodeBlock.findById(roomId);
        if (codeBlock) {
          socket.emit('initialCode', codeBlock.content);
        }
      } catch (error) {
        console.error('Failed to load code block:', error);
      }
    });

    socket.on('sendCurrentCode', ({ studentId, currentCode }) => {
      io.to(studentId).emit('currentCode', currentCode);
    });
    //////////////////////////////////////////////////////
    // });

    socket.on('changeCode', async ({ roomId, newCode }) => {
      const room = roomParticipants.get(roomId);
      if (room && room.students.has(socket.id)) { // Ensure only students can update the code
        socket.to(roomId).emit('codeUpdated', newCode); // Broadcast to all clients except the sender
        try {
          await CodeBlock.findByIdAndUpdate(roomId, { code: newCode });
          console.log(`Code updated in room ${roomId}`);
        } catch (error) {
          console.error('Failed to update code block:', error);
        }
      }
    });




//     // When a client disconnects

socket.on('disconnect', () => {
  roomParticipants.forEach((room, roomId) => {
    if (room.mentor === socket.id) {
      room.mentor = null; // Remove the mentor if the disconnected socket was the mentor
      io.in(roomId).emit('mentorLeft'); // Notify all students that the mentor left
      room.students.forEach(studentId => {
        io.sockets.sockets.get(studentId)?.leave(roomId);
      });
      roomParticipants.delete(roomId); // Delete the room if it has no participants
    } else {
      room.students.delete(socket.id); // Remove the student
    }
  });
  console.log(`Client disconnected: ${socket.id}`);
});
});
};
