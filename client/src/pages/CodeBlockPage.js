// // client/src/pages/CodeBlockPage.js
// // import React, { useEffect, useState } from 'react';
// // import { useParams, useNavigate } from 'react-router-dom';
// // import api from '../network/api';
// // import { Controlled as CodeMirror } from 'react-codemirror2';
// // import 'codemirror/lib/codemirror.css';
// // import 'codemirror/theme/material.css';
// // import 'codemirror/mode/javascript/javascript.js';
// // import './CodeBlockPage.css';
// // import { listenForCodeUpdates, sendCodeUpdate, joinRoom, leaveRoom, listenForRoleAssignment, listenForMentorLeft } from '../network/websocket';

// // const CodeBlockPage = () => {
// //   const { id } = useParams();
// //   const navigate = useNavigate();
// //   const [codeBlock, setCodeBlock] = useState(null);
// //   const [code, setCode] = useState('');
// //   const [role, setRole] = useState('');

// //   useEffect(() => {
// //     const loadCodeBlock = async () => {
// //       try {
// //         const response = await api.getCodeBlock(id);
// //         setCodeBlock(response.data);
// //         setCode(response.data.code);
// //       } catch (error) {
// //         console.error('Failed to load code block:', error);
// //       }
// //     };

// //     loadCodeBlock();
// //   }, [id]);

// //   useEffect(() => {
// //     joinRoom(id);

// //     listenForRoleAssignment((assignedRole) => {
// //       setRole(assignedRole);
// //     });

// //     listenForCodeUpdates((newCode) => {
// //       setCode(newCode);
// //     });

// //     listenForMentorLeft(() => {
// //       if (role === 'student') {
// //         alert('Mentor has left the room. Returning to lobby.');
// //         navigate('/');
// //       }
// //     });

// //     return () => {
// //       leaveRoom(id);
// //     };
// //   }, [id, role, navigate]);

// //   const handleCodeChange = (editor, data, value) => {
// //     if (role === 'student') {
// //       setCode(value);
// //       sendCodeUpdate(id, value);
// //     }
// //   };

// //   if (!codeBlock) return <div>Loading...</div>;

// //   return (
// //     <div className="code-block-page">
// //       <h1>{codeBlock.title}</h1>
// //       <CodeMirror
// //         value={code}
// //         options={{
// //           mode: 'javascript',
// //           lineNumbers: true,
// //           theme: 'material',
// //           readOnly: role === 'mentor' // Make editor read-only for mentor
// //         }}
// //         onBeforeChange={handleCodeChange}
// //       />
// //     </div>
// //   );
// // };

// // export default CodeBlockPage;

// client/src/pages/CodeBlockPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../network/api';
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { javascript } from '@codemirror/lang-javascript';
import './CodeBlockPage.css';
import { listenForCodeUpdates, sendCodeUpdate, initializeSocket, closeSocket, listenForRoleAssignment, listenForMentorLeft } from '../network/websocket';

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
        console.log('API response:', response.data); // Add this line

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


    return () => {
      closeSocket();
    };
  }, [id, role, navigate]);

  const handleCodeChange = (value) => {
    if (role === 'student') {
      setCode(value);
      sendCodeUpdate(id, value);
    }
  };
///new
  const handleSubmit = () => {
   if (role === 'student') {
     sendCodeUpdate(id, code, true); // Pass an additional parameter to indicate submission
    }
  };
////new
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
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={handleBackToLobby}>Back to Lobby</button>
      </div>
    </div>
  );
};

export default CodeBlockPage;


