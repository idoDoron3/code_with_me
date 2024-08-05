import React from 'react';
import { Modal } from 'react-bootstrap';
import './SuccessModal.css';

const SuccessModal = ({ show, onHide }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Body className="success-modal-body">
        <div className="smiley-face">😊</div>
        <h2>Well Done!</h2>
      </Modal.Body>
    </Modal>
  );
};

export default SuccessModal;
