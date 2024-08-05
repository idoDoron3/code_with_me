import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../network/api';
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { javascript } from '@codemirror/lang-javascript';
import './CodeBlockPage.css';
import { listenForCodeUpdates, sendCodeUpdate, initializeSocket, closeSocket, listenForRoleAssignment, listenForMentorLeft, listenForSolutionFailed, listenForSolutionMatched, listenForRedirectLobby } from '../network/websocket';

const CodeBlockPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [codeBlock, setCodeBlock] = useState(null);
  const [code, setCode] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    const loadCodeBlock = async () => {
      try {
        const response = await api.getCodeBlock(id);
        console.log('API response:', response.data);

        setCodeBlock(response.data);
        setCode(response.data.content);
      } catch (error) {
        console.error('Failed to load code block:', error);
      }
    };

    loadCodeBlock();
  }, [id]);

  useEffect(() => {
    initializeSocket(id);

    listenForRoleAssignment((assignedRole) => {
      setRole(assignedRole);
    });

    listenForCodeUpdates((newCode) => {
      setCode(newCode);
    });

    listenForMentorLeft(() => {
      if (role === 'student') {
        alert('Mentor has left the room. Returning to lobby.');
        navigate('/');
      }
    });

    listenForSolutionFailed(() => {
      alert('Solution is incorrect. Please try again.');
    });

    listenForSolutionMatched(() => {
      alert('Well done!');
    });

    listenForRedirectLobby(() => {
      navigate('/');
    });

    return () => {
      closeSocket();
    };
  }, [id, role, navigate]);

  const handleCodeChange = (value) => {
    if (role === 'student') {
      setCode(value);
      sendCodeUpdate(id, value, false);
    }
  };

  const handleSubmit = () => {
    if (role === 'student') {
      sendCodeUpdate(id, code, true); // Pass an additional parameter to indicate submission
    }
  };

  const handleBackToLobby = () => {
    navigate('/');
  };

  if (!codeBlock) return <div>Loading...</div>;

  return (
    <div className="code-block-page">
      <h1>{codeBlock.title}</h1>
      <CodeMirror
        value={code}
        extensions={[javascript({ jsx: true }), oneDark]}
        editable={role === 'student'} // Make editor read-only for mentor
        onChange={handleCodeChange}
      />
      <div className="button-container">
        {role === 'student' && <button onClick={handleSubmit}>Submit</button>}
        <button onClick={handleBackToLobby}>Back to Lobby</button>
      </div>
    </div>
  );
};

export default CodeBlockPage;
