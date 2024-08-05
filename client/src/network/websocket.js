// client/src/network/websocket.js
import { io } from 'socket.io-client';

const SERVER_URL = 'http://localhost:5000';
let socketConnection = null;

// Opens a WebSocket connection and subscribes to a room
export const initializeSocket = (roomId) => {
  if (socketConnection) {
    console.log('WebSocket already connected:', socketConnection.id);
    return;
  }
  
  socketConnection = io(SERVER_URL);
  console.log('Establishing WebSocket connection...');
  if (socketConnection && roomId) {
    socketConnection.on('connect', () => {
      console.log('WebSocket connected:', socketConnection.id);
      socketConnection.emit('joinRoom', { roomId });
    });

    socketConnection.on('connect_error', (err) => {
      console.error('WebSocket connection error:', err);
    });

    socketConnection.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', socketConnection.id, 'Reason:', reason);
    });

    // //////
    // // Listen for initial code from the server
    // socketConnection.on('initialCode', (initialCode) => {
    //   if (typeof initialCode === 'string') {
    //     console.log('Received initial code:', initialCode);
    //     // setCode(initialCode); // Ensure the code is set correctly

    //   } else {
    //     console.error('Received initial code is not a string:', initialCode);
    //   }
    // });
    // /////////
  }
};

// Terminates the WebSocket connection
export const closeSocket = () => {
  console.log('Terminating WebSocket connection...');
  if (socketConnection) {
    socketConnection.disconnect();
    socketConnection = null;
  }
};

// Listens for code update messages from the WebSocket server
export const listenForCodeUpdates = (callback) => {
  if (!socketConnection) {
    console.warn('Socket connection not established');
    return;
  }
  socketConnection.on('codeUpdated', (newCode) => {
    console.log('Received code update:', newCode);
    callback(newCode);
  });
};

// Emits a code update message to the WebSocket server
// export const sendCodeUpdate = (roomId, code) => {
//   if (socketConnection) {
//     socketConnection.emit('changeCode', { roomId, newCode: code }, (ack) => {
//       console.log('Code update acknowledged by server:', ack);
//     });
//   }
// };
// Emits a code update message to the WebSocket server
export const sendCodeUpdate = (roomId, code, isSubmit) => {
  if (socketConnection) {
    socketConnection.emit('changeCode', { roomId, newCode: code, isSubmit }, (ack) => {
      console.log('Code update acknowledged by server:', ack);
    });
  }
};

// Listens for role assignment messages from the WebSocket server
export const listenForRoleAssignment = (callback) => {
  if (!socketConnection) {
    console.warn('Socket connection not established');
    return;
  }
  socketConnection.on('assignedRole', (role) => {
    console.log('Assigned role:', role);
    callback(role);
  });
};

// Listens for mentor leaving the room
export const listenForMentorLeft = (callback) => {
  if (!socketConnection) {
    console.warn('Socket connection not established');
    return;
  }
  socketConnection.on('mentorLeft', () => {
    callback();
  });
};

///////////////////new
// Listens for solution submission failure
export const listenForSolutionFailed = (callback) => {
  if (!socketConnection) {
    console.warn('Socket connection not established');
    return;
  }
  socketConnection.on('solutionFailed', () => {
    callback();
  });
};

// Listens for solution submission success
export const listenForSolutionMatched = (callback) => {
  if (!socketConnection) {
    console.warn('Socket connection not established');
    return;
  }
  socketConnection.on('solutionMatched', () => {
    callback();
  });
};

// Listens for redirect to lobby
export const listenForRedirectLobby = (callback) => {
  if (!socketConnection) {
    console.warn('Socket connection not established');
    return;
  }
  socketConnection.on('redirectLobby', () => {
    callback();
  });
};