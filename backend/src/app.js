const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Prosty endpoint testowy
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// TODO: tutaj później podepniemy routes: auth, cars, reservations, admin

module.exports = app;
