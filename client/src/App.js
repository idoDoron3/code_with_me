import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LobbyPage from './pages/LobbyPage';
import CodeBlockPage from './pages/CodeBlockPage';
import { initializeSocket, closeSocket } from './network/websocket';
// import './App.css';

const App = () => {
  useEffect(() => {
    initializeSocket();

    return () => {
      closeSocket();
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/codeblock/:id" element={<CodeBlockPage />} />
          <Route path="/" element={<LobbyPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
