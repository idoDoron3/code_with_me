// import React from 'react';
// import { Card, Container, Row, Col } from 'react-bootstrap';
// import PreviewCodeBlock from './PreviewCodeBlock';

// const ListCodeBlock = ({ codeBlocks, onCodeBlockClick }) => {
//   return (
//     <Container>
//       <Row>
//         {codeBlocks.map((codeBlock) => (
//           <Col key={codeBlock._id} md={4} onClick={() => onCodeBlockClick(codeBlock._id)}>
//             <Card>
//               <Card.Body>
//                 <PreviewCodeBlock title={codeBlock.title} />
//               </Card.Body>
//             </Card>
//           </Col>
//         ))}
//       </Row>
//     </Container>
//   );
// };

// export default ListCodeBlock;
import React from 'react';
import { Card } from 'react-bootstrap';
import PreviewCodeBlock from './PreviewCodeBlock';
import './ListCodeBlock.css';

const ListCodeBlock = ({ codeBlocks, onCodeBlockClick }) => {
  return (
    <div className="list-code-block">
      {codeBlocks.map((codeBlock) => (
        <div key={codeBlock._id} className="code-block-card" onClick={() => onCodeBlockClick(codeBlock._id)}>
          <Card>
            <Card.Body>
              <PreviewCodeBlock title={codeBlock.title} />
            </Card.Body>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default ListCodeBlock;

