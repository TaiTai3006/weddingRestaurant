import React, { useState } from 'react';
import Iframe from 'react-iframe';
import Modal from 'react-modal';
import "../style/payment.css"
function BankPayment() {
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const [url, setUrl] = useState("http://www.youtube.com/embed/xDMP3i36naA"); 

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={() => setModalIsOpen(false)}
      contentLabel="Bank Payment Modal"
      className="bank-payment-modal"
    >
      <Iframe
        url={url}
        width="100%"
        height="100%"
        id="QRpayment"
        className="QRpayment"
        display="initial"
        position="relative"
        style={{ border: 'none' }}
      />
    </Modal>
  );
}

export default BankPayment;
