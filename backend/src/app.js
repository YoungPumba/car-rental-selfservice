const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reservationRoutes = require('./routes/reservationRoutes');



const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reservations', reservationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

module.exports = app;
