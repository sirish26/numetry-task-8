import React, { useState } from 'react';
import './App.css';
import Available from './components/available';
import axios from 'axios'; 
import MyTickets from './components/MyTickets';

const BookingForm = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [seats, setSeats] = useState(1);
  const [date, setDate] = useState('');
  const [transport, setTransport] = useState('car');
  const [selectedOption, setSelectedOption] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [bookedTickets, setBookedTickets] = useState([]);
  const [showBookedTickets, setShowBookedTickets] = useState(false);

  const handleSourceChange = (e) => {
    setSource(e.target.value);
  };

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
  };

  const handleSeatsChange = (e) => {
    setSeats(parseInt(e.target.value, 10));
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleTransportChange = (selectedTransport) => {
    setTransport(selectedTransport);
    setSelectedOption(`Search ${selectedTransport.charAt(0).toUpperCase()}${selectedTransport.slice(1)}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (source === destination) {
      alert('Source and destination must be different.');
      return;
    }
    const currentDate = new Date();
    const selectedDate = new Date(date);
    if (selectedDate < currentDate.setHours(0, 0, 0, 0)) {
      alert('Please select a future date.');
      return;
    }
    setShowOptions(true);
  };
  const handleMyTickets = async () => {
    try {
      console.log('Fetching tickets...');
      const response = await axios.get('http://localhost:5000/tickets');
      console.log('Response:', response.data);
      setBookedTickets(response.data);
      setShowBookedTickets((prevShowBookedTickets) => !prevShowBookedTickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };
  

  return (
    <div className="App">
      <div className="top-right">
        <button onClick={handleMyTickets}>My Tickets</button>
      </div>
      <form onSubmit={handleSubmit} className="booking-form">
        <div><h1><center>Booking App</center></h1></div>
        <br />
        <div className="form-group">
          <label htmlFor="source">Source:</label>
          <input
            type="text"
            id="source"
            value={source}
            onChange={handleSourceChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="destination">Destination:</label>
          <input
            type="text"
            id="destination"
            value={destination}
            onChange={handleDestinationChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="seats">Number of Seats:</label>
          <input
            type="number"
            id="seats"
            value={seats}
            onChange={handleSeatsChange}
            min="1"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={handleDateChange}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>
        <div className="form-group">
          <label>Choose Transport:</label>
          <div className="transport-buttons">
            <button
              type="button"
              className={transport === 'car' ? 'active' : ''}
              onClick={() => handleTransportChange('car')}
            >
              Car
            </button>
            <button
              type="button"
              className={transport === 'bus' ? 'active' : ''}
              onClick={() => handleTransportChange('bus')}
            >
              Bus
            </button>
            <button
              type="button"
              className={transport === 'train' ? 'active' : ''}
              onClick={() => handleTransportChange('train')}
            >
              Train
            </button>
          </div>
        </div>
        <center>
          <button type="submit" className="book-button">
            {selectedOption ? selectedOption : 'Search'}
          </button>
        </center>
      </form>
      <div className="details">
        {showOptions && (
          <Available
            transport={transport}
            userDetails={{
              source,
              destination,
              seats,
              date,
              transport,
            }}
          />
        )}
        {showBookedTickets && <MyTickets bookedTickets={bookedTickets} />}
      </div>
    </div>
  );
};

export default BookingForm;
