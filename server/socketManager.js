const CodeBlock = require('./models/CodeBlock');
const mongoose = require('mongoose');

module.exports = (io) => {
  // A map to store the participants of each room
  const roomParticipants = new Map();
  var serverCurrentCode = new Map();

  io.on('connection', (socket) => {

    const updateClientCount = (roomId) => {
      const room = roomParticipants.get(roomId);
      if (room) {
        const clientCount = 1 + room.students.size; // 1 for the mentor
        console.log(`Emitting client count for room ${roomId}: ${clientCount}`);

        io.to(roomId).emit('clientCount', clientCount);
      }
    };

    socket.on('joinRoom', async ({ roomId }) => {
      socket.join(roomId);

      if (!roomParticipants.has(roomId)) {
        // If the room does not exist, create it with the current socket as the mentor
        roomParticipants.set(roomId, { mentor: socket.id, students: new Set(), title: "" });

        // Fetch and send the initial code block to the mentor
        try {
          const codeBlock = await CodeBlock.findById(roomId);
          if (codeBlock) {
            serverCurrentCode.set(roomId, codeBlock.content);
            roomParticipants.get(roomId).title = codeBlock.title;
          }
        } catch (error) {
          console.error('Failed to load code block:', error);
        }
      } else {
        // If the room exists, add the socket as a student
        roomParticipants.get(roomId).students.add(socket.id);
      }

      // Determine the role of the socket (mentor or student) and notify the client
      const role = roomParticipants.get(roomId).mentor === socket.id ? 'mentor' : 'student';
      socket.emit('assignedRole', role);
      updateClientCount(roomId);

      console.log(`Client ${socket.id} joined room ${roomId} as ${role}`);
      io.to(socket.id).emit('titleUpdated', roomParticipants.get(roomId).title);
      io.to(socket.id).emit('codeUpdated', serverCurrentCode.get(roomId));
    });

    socket.on('sendCurrentCode', ({ studentId, currentCode }) => {
      io.to(studentId).emit('currentCode', currentCode);
    });


    socket.on('changeCode', async ({ roomId, newCode, isSubmit }) => {
      serverCurrentCode.set(roomId, newCode);
      const room = roomParticipants.get(roomId);
      if (room && room.students.has(socket.id)) { // Ensure only students can update the code
        socket.to(roomId).emit('codeUpdated', newCode); // Broadcast to all clients except the sender
        if (isSubmit) {
          try {
            const codeBlock = await CodeBlock.findById(roomId);
            const cleanCode = (code) => {
              return code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '') // Remove comments
                .replace(/\s+/g, '') // Remove all whitespace (spaces, tabs, newlines)
                .trim();
            };
            const cleanedNewCode = cleanCode(newCode);
            const cleanedSolution = cleanCode(codeBlock.solution);

            if (cleanedNewCode === cleanedSolution) {
              io.to(roomId).emit('solutionMatched');
              setTimeout(() => {
                io.to(roomId).emit('redirectLobby');
                roomParticipants.delete(roomId);
              }, 3000); // 3 seconds delay before redirect
            } else {
              socket.emit('solutionFailed');
            }
          } catch (error) {
            console.error('Failed to check solution:', error);
          }
        }
      }
    });

// When a client disconnects

socket.on('backToLobby', (backToLobby) => {
  const room = roomParticipants.get(backToLobby.roomId);
  if (room) {
    if (backToLobby.role === "mentor") {
      room.students.forEach(studentId => {
        io.to(studentId).emit('mentorLeft');
      });
      roomParticipants.delete(backToLobby.roomId);
      serverCurrentCode.delete(backToLobby.roomId);
    } else {
      room.students.delete(socket.id);
      io.to(backToLobby.roomId).emit('clientCount', room.students.size +1);
    }
  }
});


});
};
