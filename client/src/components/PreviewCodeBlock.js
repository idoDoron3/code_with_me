// import React from 'react';
// import { Card } from 'react-bootstrap';

// const PreviewCodeBlock = ({ title, onSelect }) => {
//   return (
//     <Card.Title className="text-center" onClick={onSelect} style={{ cursor: 'pointer' }}>
//       {title}
//     </Card.Title>
//   );
// };

// export default PreviewCodeBlock;
// client/src/components/PreviewCodeBlock.js
import React from 'react';
import { Card } from 'react-bootstrap';

const PreviewCodeBlock = ({ title }) => {
  return (
    <Card.Title className="text-center">{title}</Card.Title>
  );
};

export default PreviewCodeBlock;
