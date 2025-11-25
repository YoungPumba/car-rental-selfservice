const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/authMiddleware');
const Reservation = require('../models/Reservation');
const Car = require('../models/Car');

const router = express.Router();

// Wszystko poniżej wymaga zalogowania
router.use(auth);

/**
 * Pomocnicza funkcja do obliczania liczby dni
 */
const calculateNumberOfDays = (startDate, endDate) => {
  const msInDay = 1000 * 60 * 60 * 24;
  const diff = endDate.getTime() - startDate.getTime();
  // minimalnie 1 dzień
  return Math.max(1, Math.ceil(diff / msInDay));
};

/**
 * POST /api/reservations
 * Tworzenie nowej rezerwacji
 */
router.post(
  '/',
  [
    body('carId').notEmpty().withMessage('carId jest wymagane'),
    body('startDate')
      .notEmpty()
      .withMessage('Data początku jest wymagana'),
    body('endDate')
      .notEmpty()
      .withMessage('Data końca jest wymagana'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { carId, startDate, endDate } = req.body;

    try {
      const car = await Car.findById(carId);
      if (!car) {
        return res
          .status(404)
          .json({ message: 'Wybrany samochód nie istnieje' });
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res
          .status(400)
          .json({ message: 'Nieprawidłowy format daty' });
      }

      if (end <= start) {
        return res
          .status(400)
          .json({ message: 'Data końca musi być późniejsza niż początek' });
      }

      const days = calculateNumberOfDays(start, end);
      const totalPrice = days * car.dailyRate;

      // Wersja demo: brak sprawdzania konfliktów rezerwacji,
      // opiszesz w pracy, że w pełnej wersji trzeba by to zaimplementować.

      const pickupCode = Math.random().toString().slice(2, 8); // 6 cyfr

      const reservation = await Reservation.create({
        userId: req.user.id,
        carId: car._id,
        startDate: start,
        endDate: end,
        totalPrice,
        status: 'pending',
        pickupCode,
      });

      const populated = await reservation.populate('carId', 'brand model');

      return res.status(201).json(populated);
    } catch (err) {
      console.error('Create reservation error:', err);
      return res
        .status(500)
        .json({ message: 'Błąd serwera podczas tworzenia rezerwacji' });
    }
  }
);

/**
 * GET /api/reservations/my
 * Lista rezerwacji zalogowanego użytkownika
 */
router.get('/my', async (req, res) => {
  try {
    const reservations = await Reservation.find({
      userId: req.user.id,
    })
      .populate('carId', 'brand model registrationNumber')
      .sort({ startDate: -1 });

    return res.json(reservations);
  } catch (err) {
    console.error('Get my reservations error:', err);
    return res
      .status(500)
      .json({ message: 'Błąd serwera podczas pobierania rezerwacji' });
  }
});

/**
 * DELETE /api/reservations/:id
 * Anulowanie rezerwacji przez użytkownika (tylko jeśli pending i jego)
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res
        .status(404)
        .json({ message: 'Rezerwacja nie została znaleziona' });
    }

    if (reservation.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: 'Nie masz uprawnień do tej rezerwacji' });
    }

    if (reservation.status !== 'pending') {
      return res.status(400).json({
        message: 'Tę rezerwację można już anulować tylko przez obsługę',
      });
    }

    reservation.status = 'cancelled';
    await reservation.save();

    return res.json({ message: 'Rezerwacja została anulowana' });
  } catch (err) {
    console.error('Cancel reservation error:', err);
    return res
      .status(500)
      .json({ message: 'Błąd serwera podczas anulowania rezerwacji' });
  }
});

module.exports = router;
