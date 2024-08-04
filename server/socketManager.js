const CodeBlock = require('./models/CodeBlock');
const mongoose = require('mongoose');

module.exports = (io) => {
  // A map to store the participants of each room
  const roomParticipants = new Map();

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // When a client joins a room
    // socket.on('joinRoom', async (roomId) => {
    //   if (!mongoose.Types.ObjectId.isValid(roomId)) {
    //     console.error(`Invalid roomId: ${roomId}`);
    //     socket.emit('error', 'Invalid room ID');
    //     return;
    //   }

    //   socket.join(roomId);
        socket.on('joinRoom', ({ roomId }) => {
      socket.join(roomId);

      if (!roomParticipants.has(roomId)) {
        // If the room does not exist, create it with the current socket as the mentor
        roomParticipants.set(roomId, { mentor: socket.id, students: new Set() });
      } else {
        // If the room exists, add the socket as a student
        roomParticipants.get(roomId).students.add(socket.id);
      }

      // Determine the role of the socket (mentor or student) and notify the client
      const role = roomParticipants.get(roomId).mentor === socket.id ? 'mentor' : 'student';
      socket.emit('assignedRole', role);

      console.log(`Client ${socket.id} joined room ${roomId} as ${role}`);
    });

    // When a client sends a code update
    // socket.on('updateCode', async ({ roomId, updatedCode }) => {
    //   if (!mongoose.Types.ObjectId.isValid(roomId)) {
    //     console.error(`Invalid roomId: ${roomId}`);
    //     socket.emit('error', 'Invalid room ID');
    //     return;
    //   }
        //   const room = roomParticipants.get(roomId);
    //   if (room && (room.students.has(socket.id) || room.mentor === socket.id)) {
    //     // Broadcast the updated code to other participants in the room
    //     socket.to(roomId).emit('codeUpdated', updatedCode);
    //     try {
    //       // Update the code block in the database
    //       await CodeBlock.findByIdAndUpdate(roomId, { code: updatedCode });
    //       console.log(`Code updated in room ${roomId}`);
    //     } catch (error) {
    //       console.error('Failed to update code block:', error);
    //     }
    //   }
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
//     socket.on('disconnect', () => {
//       roomParticipants.forEach((room, roomId) => {
//         if (room.mentor === socket.id) {
//           room.mentor = null; // Remove the mentor if the disconnected socket was the mentor
//         } else {
//           room.students.delete(socket.id); // Remove the student
//         }

//         // Delete the room if it no longer has any participants
//         if (!room.mentor && room.students.size === 0) {
//           roomParticipants.delete(roomId);
//         }
//       });
//       console.log(`Client disconnected: ${socket.id}`);
//     });
//   });
// };
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
