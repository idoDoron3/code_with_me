import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../network/api';
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { javascript } from '@codemirror/lang-javascript';
import { Button, Container, Row, Col } from 'react-bootstrap';
import './CodeBlockPage.css';
import { listenForCodeUpdates,
   sendCodeUpdate,
   listenForTitleUpdates,
    initializeSocket,
     closeSocket,
      listenForRoleAssignment,
       listenForMentorLeft,
        listenForSolutionMatched, listenForSolutionFailed, listenForClientCount, emitBackToLobby  } from '../network/websocket';
import SuccessModal from '../components/SuccessModal';


const CodeBlockPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [codeBlock, setCodeBlock] = useState(null);
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [role, setRole] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [clientCount, setClientCount] = useState(0);
//////////
  const getCurrentCode = () => code; // Function to get the current code

  useEffect(() => {
    initializeSocket(id, setCode, getCurrentCode);

    listenForRoleAssignment((assignedRole) => {
      setRole(assignedRole);
    });

    listenForCodeUpdates((newCode) => {
      if (!codeBlock) {
        setCodeBlock(true);
      }
      setCode(newCode);
    });

    listenForTitleUpdates((newTitle) => {
      setTitle(newTitle);
    });

    listenForMentorLeft(() => {
      alert('Mentor has left the room. Returning to lobby.');
      navigate('/');
    });

    listenForSolutionFailed(() => {
      alert('Solution is incorrect. Please try again.');
    });

    listenForSolutionMatched(() => {
      setShowSuccessModal(true);
      setTimeout(() => {
        navigate('/');
      }, 3000); // 3 seconds delay before redirect
    });
 

    // listenForRedirectLobby(() => {
    //   navigate('/');
    // });


    listenForClientCount((count) => {
      setClientCount(count);
    });

    return () => {
      closeSocket();
    };
  }, [id]);

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
    emitBackToLobby(id, role);
    navigate('/');
  };

  window.addEventListener('beforeunload', (event) => {
    emitBackToLobby(id, role);
  });

  if (!codeBlock) return <div>Loading...</div>;

return (
  <Container className="code-block-page">
    <Row>
      <Col className="text-center">
        <h1 className="code-block-title">{title}</h1>
      </Col>
    </Row>
    <Row>
      <Col>
        <CodeMirror
          value={code}
          extensions={[javascript({ jsx: true }), oneDark]}
          editable={role === 'student'} // Make editor read-only for mentor
          onChange={handleCodeChange}
          className="code-editor"
        />
      </Col>
    </Row>
    <Row className="button-row">
      <Col>
        <div className="button-container">
          {role === 'student' && <Button onClick={handleSubmit} variant="primary">Submit</Button>}
          <Button onClick={handleBackToLobby} variant="secondary">Back to Lobby</Button>
        </div>
      </Col>
    </Row>
    <SuccessModal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} />
    <div className="role-indicator">Role: {role}</div>
    <div className="client-count">Clients Connected: {clientCount}</div>
  </Container>
);
};
export default CodeBlockPage;
