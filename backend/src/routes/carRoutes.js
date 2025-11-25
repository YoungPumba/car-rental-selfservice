const express = require('express');
const Car = require('../models/Car');

const router = express.Router();

/**
 * GET /api/cars
 * Publiczna lista samochodów (z prostym filtrowaniem po marce i segmencie)
 */
router.get('/', async (req, res) => {
  try {
    const { segment, brand } = req.query;
    const filter = {};

    if (segment) {
      filter.segment = segment;
    }

    if (brand) {
      // prosty case-insensitive match po nazwie marki
      filter.brand = new RegExp(`^${brand}$`, 'i');
    }

    const cars = await Car.find(filter).sort({ brand: 1, model: 1 });
    return res.json(cars);
  } catch (err) {
    console.error('Get cars error:', err);
    return res
      .status(500)
      .json({ message: 'Błąd serwera podczas pobierania samochodów' });
  }
});

module.exports = router;
