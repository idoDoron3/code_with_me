import { io } from 'socket.io-client';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

let socketConnection = null;

// Opens a WebSocket connection and subscribes to a room
export const initializeSocket = (roomId, setCode,  getCurrentCode) => {
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
    callback(newCode);
  });
};

export const listenForTitleUpdates = (callback) => {
  if (!socketConnection) {
    console.warn('Socket connection not established');
    return;
  }
  socketConnection.on('titleUpdated', (newTitle) => {
    console.log(`listenForTitleUpdates ${newTitle}`);
    callback(newTitle);
  });
};

// Emits a code update message to the WebSocket server
export const sendCodeUpdate = (roomId, code, isSubmit) => {
  if (socketConnection) {
    socketConnection.emit('changeCode', { roomId, newCode: code, isSubmit }, (ack) => {
      console.log('Code update acknowledged by server:', ack);
    });
  }
};

// Emits an event to notify the server that the mentor wants to go back to the lobby
export const emitBackToLobby = (roomId, role) => {
  if (socketConnection) {
    socketConnection.emit('backToLobby', {roomId, role});
  }
};

// Listens for role assignment messages from the WebSocket server
export const listenForRoleAssignment = (callback) => {
  if (!socketConnection) {
    console.warn('Socket connection not established');
    return;
  }
  socketConnection.on('assignedRole', (role) => {
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


// Listens for client count updates
export const listenForClientCount = (callback) => {
  if (!socketConnection) {
    console.warn('Socket connection not established');
    return;
  }
  socketConnection.on('clientCount', (count) => {
    callback(count);
  });
};

