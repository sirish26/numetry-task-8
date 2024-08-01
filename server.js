const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios'); 

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());


mongoose.connect('mongodb+srv://root:root@numerty.t7qkzms.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const ticketSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  source: String,
  destination: String,
  seats: Number,
  date: Date,
  transport: String,
  ticketNumber: Number,
});

const Ticket = mongoose.model('Ticket', ticketSchema);

app.use(express.json());

app.post('/tickets', async (req, res) => {
  try {
    console.log('Received data:', req.body); 
    const { name, phone, email, source, destination, seats, date, transport, ticketNumber } = req.body;
    const newTicket = new Ticket({ name, phone, email, source, destination, seats, date, transport, ticketNumber });
    await newTicket.save();
    res.status(201).json({ message: 'Ticket booked successfully!' });
  } catch (error) {
    console.error('Error saving ticket:', error);
    res.status(500).json({ error: 'Please Try Again After Some Time' });
  }
});

app.get('/tickets', async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.status(200).json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'An error occurred while fetching the tickets.' });
  }
});

app.delete('/tickets/:ticketNumber', async (req, res) => {
  try {
    const { ticketNumber } = req.params;
    const deletedTicket = await Ticket.findOneAndDelete({ ticketNumber });
    if (!deletedTicket) {
      return res.status(404).json({ error: 'Ticket not found.' });
    }
    res.status(200).json({ message: 'Ticket cancelled successfully.' });
  } catch (error) {
    console.error('Error cancelling ticket:', error);
    res.status(500).json({ error: 'An error occurred while cancelling the ticket.' });
  }
});

app.get('/download-pdf/:ticketNumber', async (req, res) => {
  try {
    const { ticketNumber } = req.params;
    const ticket = await Ticket.findOne({ ticketNumber });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found.' });
    }

    const pdfUrl = 'http://localhost:5000/download-pdf';
    const pdfResponse = await axios.get(pdfUrl, { responseType: 'blob' });

    res.setHeader('Content-Disposition', 'attachment; filename="ticket.pdf"');
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfResponse.data);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'An error occurred while generating the PDF.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
