import React, { useState } from 'react';
import axios from 'axios';

const TicketDetailsModal = ({ ticket, closeModal }) => {
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');

  const downloadPDF = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/download-pdf', { ticket });
      setPdfUrl(response.data.url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Ticket Details</h2>
        <p>Ticket Number: {ticket.ticketNumber}</p>
        <p>Source: {ticket.source}</p>
        <p>Destination: {ticket.destination}</p>
        <button onClick={downloadPDF} disabled={loading}>
          {loading ? 'Downloading PDF...' : 'Download PDF'}
        </button>
        <button onClick={closeModal}>Close</button>
        {pdfUrl && (
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
            Open PDF
          </a>
        )}
      </div>
    </div>
  );
};

export default TicketDetailsModal;
