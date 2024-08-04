import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../network/api';
import { initializeSocket, closeSocket } from '../network/websocket';
import ListCodeBlock from '../components/ListCodeBlock';

const LobbyPage = () => {
  const [codeBlocks, setCodeBlocks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    initializeSocket();

    const fetchCodeBlocks = async () => {
      try {
        const response = await api.getCodeBlocks();
        setCodeBlocks(response.data);
      } catch (error) {
        console.error('Failed to fetch code blocks:', error);
      }
    };

    fetchCodeBlocks();

    return () => {
      closeSocket();
    };
  }, []);

  const handleCodeBlockClick = (id) => {
    navigate(`/codeblock/${id}`);
  };//TODO: change to relevant dada 2 cases

  return (
    <div>
      <h1>Lobby</h1>
      <ListCodeBlock codeBlocks={codeBlocks} onCodeBlockClick={handleCodeBlockClick} />
    </div>
  );
};

export default LobbyPage;
