// // client/src/components/ListCodeBlock.js
// import React from 'react';
// import { Col } from 'react-bootstrap';
// import PreviewCodeBlock from './PreviewCodeBlock';

// const ListCodeBlock = ({ blocks, onSelect }) => {
//   return 
//     <>
//       {blocks.map((block) => (
//         <Col md={4} key={block._id}>
//           <PreviewCodeBlock block={block} onSelect={onSelect} />
//         </Col>
//       ))}
//     </>
//   );
// };

// export default ListCodeBlock;
// a
// client/src/components/ListCodeBlock.js
import React from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import PreviewCodeBlock from './PreviewCodeBlock';

const ListCodeBlock = ({ codeBlocks, onCodeBlockClick }) => {
  return (
    <Container>
      <Row>
        {codeBlocks.map((codeBlock) => (
          <Col key={codeBlock._id} md={4} onClick={() => onCodeBlockClick(codeBlock._id)}>
            <Card>
              <Card.Body>
                <PreviewCodeBlock title={codeBlock.title} />
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ListCodeBlock;
