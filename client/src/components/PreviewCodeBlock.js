import React from 'react';
import { Card, Button } from 'react-bootstrap';
import './PreviewCodeBlock.css';

const PreviewCodeBlock = ({ title, onClick }) => {
  return (
    <Card className="preview-code-block">
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Button variant="primary" onClick={onClick}>
          Open
        </Button>
      </Card.Body>
    </Card>
  );
};

export default PreviewCodeBlock;
