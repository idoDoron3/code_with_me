import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../network/api';
import ListCodeBlock from '../components/ListCodeBlock';
import './LobbyPage.css';


const LobbyPage = () => {
  const [codeBlocks, setCodeBlocks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
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
    };
  }, []);

  const handleCodeBlockClick = (id) => {
    navigate(`/codeblock/${id}`);
  };//TODO: change to relevant dada 2 cases

  return (
    <div className="lobby-page">
    <h1 className="lobby-title">JavaScript with Tom!</h1>
    <ListCodeBlock codeBlocks={codeBlocks} onCodeBlockClick={handleCodeBlockClick} />
  </div>
  );
};

export default LobbyPage;
