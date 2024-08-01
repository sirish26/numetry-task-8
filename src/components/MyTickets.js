import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TicketDetailsModal from './handleView';


const MyTickets = ({ fetchBookedTickets }) => {
  const [bookedTickets, setBookedTickets] = useState([]);
  const [ticketModalContent, setTicketModalContent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/tickets');
        setBookedTickets(response.data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    fetchData();
  }, [fetchBookedTickets]);

  const handleCancel = async (ticketNumber) => {
    try {
      const confirmed = window.confirm('Are you sure you want to cancel this ticket?');
      if (confirmed) {
        await axios.delete(`http://localhost:5000/tickets/${ticketNumber}`);
        alert('Ticket cancelled successfully!');
        
        // Update the state to remove the cancelled ticket
        setBookedTickets((prevTickets) =>
          prevTickets.filter((ticket) => ticket.ticketNumber !== ticketNumber)
        );
      } else {
        // User clicked "Cancel" in the confirmation dialog
        alert('Ticket cancellation cancelled.');
      }
    } catch (error) {
      console.error('Error cancelling ticket:', error);
      alert('Failed to cancel ticket. Please try again.');
    }
  };
  

  const handleView = (ticketNumber) => {
    const ticket = bookedTickets.find((ticket) => ticket.ticketNumber === ticketNumber);
    if (ticket) {
      setTicketModalContent(
        <TicketDetailsModal ticket={ticket} closeModal={() => setTicketModalContent(null)} />
      );
    }
  };
  

  return (
    <div>
      <h2>My Tickets</h2>
      <table>
        <thead>
          <tr>
            <th>Ticket Number</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Source</th>
            <th>Destination</th>
            <th>Seats</th>
            <th>Date</th>
            <th>Transport</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookedTickets.map((ticket) => (
            <tr key={ticket.ticketNumber}>
              <td>{ticket.ticketNumber}</td>
              <td>{ticket.name}</td>
              <td>{ticket.phone}</td>
              <td>{ticket.email}</td>
              <td>{ticket.source}</td>
              <td>{ticket.destination}</td>
              <td>{ticket.seats}</td>
              <td>{ticket.date}</td>
              <td>{ticket.transport}</td>
              <td>
                <button onClick={() => handleCancel(ticket.ticketNumber)}>Cancel</button>
                <button onClick={() => handleView(ticket.ticketNumber)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {ticketModalContent && ticketModalContent}
    </div>
  );
};

export default MyTickets;
