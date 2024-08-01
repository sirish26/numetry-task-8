import React, { useState } from 'react';
import optionsData from './options';
import Modal from 'react-modal';
import axios from 'axios';

const Available = ({ transport = 'car', userDetails }) => {
  const options = optionsData[transport.toLowerCase() + 's'] || [];
  const modeDetails = {
    car: 'Available Cars',
    bus: 'Available Buses',
    train: 'Available Trains',
  };

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [ticketNumber] = useState(generateTicketNumber());
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  function generateTicketNumber() {
    return Math.floor(10000000 + Math.random() * 90000000);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBookTicket = async () => {
    try {
      const ticketPrice = generateTprice(); 
      console.log('Ticket Price:', ticketPrice); 
  
      await axios.post('http://localhost:5000/tickets', {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        source: userDetails.source,
        destination: userDetails.destination,
        seats: userDetails.seats,
        date: userDetails.date,
        transport: userDetails.transport,
        ticketNumber: ticketNumber,
        price: ticketPrice, 
      });
  
      alert('Ticket booked successfully!');
      closeModal();
    } catch (error) {
      console.error('Error booking ticket:', error);
      alert('Failed to book ticket. Please try again.');
    }
  };
  

  function generateTprice() {
    return Math.floor(500 + Math.random() * 90);
  }

  const handleSelect = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="available-options">
      <h2>{modeDetails[transport]}</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Time</th>
            <th>Seats</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {options.map((option, index) => (
            <tr key={index}>
              <td>{option.name}</td>
              <td>{option.departureTime}</td>
              <td>{option.availableSeats}</td>
              <td>{option.price}</td>
              <td>
                <button onClick={handleSelect}>Select</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={modalStyles}>
        <h2><center>Journey Details</center></h2>
        <button onClick={closeModal}>Back</button>
        <hr />
        <form>
          <div>
            <h3>{userDetails.source} to {userDetails.destination}</h3>
            <p>Depature Time: {userDetails.date}</p>
            <p>Seats: {userDetails.seats}</p>
            <p>Travel By: {userDetails.transport}</p>
            <p>Ticket Number: {ticketNumber}</p>
            <p>Price: {generateTprice()}</p>
            <hr />
          </div>
          <h3>Passenger Details</h3>
          <label htmlFor="name" style={inputLabelStyle}>Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            style={inputStyle}
            value={formData.name}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="phone" style={inputLabelStyle}>Phone:</label>
          <input
            type="text"
            id="phone"
            name="phone"
            style={inputStyle}
            value={formData.phone}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="email" style={inputLabelStyle}>Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            style={inputStyle}
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <button onClick={handleBookTicket}>Book Ticket</button>
        </form>
      </Modal>
    </div>
  );
};

export default Available;

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    background: '#fff',
    overflow: 'auto',
  },
};
const inputStyle = {
  width: '100%',
  padding: '8px',
  margin: '8px 0',
  boxSizing: 'border-box',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const inputLabelStyle = {
  marginBottom: '5px',
  flex: 2,
};
