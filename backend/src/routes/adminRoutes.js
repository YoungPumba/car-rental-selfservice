const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth, requireAdmin } = require('../middleware/authMiddleware');
const Car = require('../models/Car');
const Reservation = require('../models/Reservation');

const router = express.Router();

// Wszystkie trasy w tym routerze wymagają zalogowanego admina
router.use(auth);
router.use(requireAdmin);

/**
 * GET /api/admin/cars
 * Lista wszystkich samochodów (dla admina)
 */
router.get('/cars', async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    return res.json(cars);
  } catch (err) {
    console.error('Admin get cars error:', err);
    return res
      .status(500)
      .json({ message: 'Błąd serwera podczas pobierania listy samochodów' });
  }
});

/**
 * POST /api/admin/cars
 * Dodanie nowego samochodu
 */
router.post(
  '/cars',
  [
    body('brand').trim().notEmpty().withMessage('Marka jest wymagana'),
    body('model').trim().notEmpty().withMessage('Model jest wymagany'),
    body('year')
      .isInt({ min: 1980 })
      .withMessage('Rok produkcji musi być liczbą >= 1980'),
    body('segment')
      .isIn(['economy', 'compact', 'standard', 'premium', 'suv', 'van'])
      .withMessage('Nieprawidłowy segment'),
    body('dailyRate')
      .isFloat({ min: 0 })
      .withMessage('Stawka dzienna musi być liczbą >= 0'),
    body('registrationNumber')
      .trim()
      .notEmpty()
      .withMessage('Numer rejestracyjny jest wymagany'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      brand,
      model,
      year,
      segment,
      dailyRate,
      registrationNumber,
      isAvailable,
    } = req.body;

    try {
      const existing = await Car.findOne({ registrationNumber });
      if (existing) {
        return res.status(409).json({
          message:
            'Samochód z takim numerem rejestracyjnym już istnieje',
        });
      }

      const car = await Car.create({
        brand,
        model,
        year,
        segment,
        dailyRate,
        registrationNumber,
        isAvailable:
          typeof isAvailable === 'boolean' ? isAvailable : true,
      });

      return res.status(201).json(car);
    } catch (err) {
      console.error('Admin create car error:', err);
      return res
        .status(500)
        .json({ message: 'Błąd serwera podczas dodawania samochodu' });
    }
  }
);

/**
 * PUT /api/admin/cars/:id
 * Edycja samochodu
 */
router.put(
  '/cars/:id',
  [
    body('brand').optional().trim().notEmpty(),
    body('model').optional().trim().notEmpty(),
    body('year').optional().isInt({ min: 1980 }),
    body('segment')
      .optional()
      .isIn(['economy', 'compact', 'standard', 'premium', 'suv', 'van']),
    body('dailyRate').optional().isFloat({ min: 0 }),
    body('registrationNumber').optional().trim().notEmpty(),
    body('isAvailable').optional().isBoolean(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    try {
      const car = await Car.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!car) {
        return res
          .status(404)
          .json({ message: 'Samochód nie został znaleziony' });
      }
      return res.json(car);
    } catch (err) {
      console.error('Admin update car error:', err);
      return res
        .status(500)
        .json({ message: 'Błąd serwera podczas aktualizacji samochodu' });
    }
  }
);

/**
 * DELETE /api/admin/cars/:id
 * Usunięcie samochodu
 */
router.delete('/cars/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Car.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ message: 'Samochód nie został znaleziony' });
    }
    return res.json({ message: 'Samochód został usunięty' });
  } catch (err) {
    console.error('Admin delete car error:', err);
    return res
      .status(500)
      .json({ message: 'Błąd serwera podczas usuwania samochodu' });
  }
});

/**
 * GET /api/admin/reservations
 * Lista wszystkich rezerwacji (dla admina)
 */
router.get('/reservations', async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('userId', 'firstName lastName email')
      .populate('carId', 'brand model registrationNumber')
      .sort({ createdAt: -1 });

    return res.json(reservations);
  } catch (err) {
    console.error('Admin get reservations error:', err);
    return res
      .status(500)
      .json({ message: 'Błąd serwera podczas pobierania rezerwacji' });
  }
});

/**
 * GET /api/admin/reservations/:id
 * Szczegóły konkretnej rezerwacji
 */
router.get('/reservations/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const reservation = await Reservation.findById(id)
      .populate('userId', 'firstName lastName email phone')
      .populate('carId', 'brand model registrationNumber');

    if (!reservation) {
      return res
        .status(404)
        .json({ message: 'Rezerwacja nie została znaleziona' });
    }

    return res.json(reservation);
  } catch (err) {
    console.error('Admin get reservation details error:', err);
    return res
      .status(500)
      .json({ message: 'Błąd serwera podczas pobierania rezerwacji' });
  }
});

/**
 * PATCH /api/admin/reservations/:id/status
 * Zmiana statusu rezerwacji przez admina
 */
router.patch(
  '/reservations/:id/status',
  [
    body('status')
      .isIn(['pending', 'confirmed', 'cancelled', 'completed'])
      .withMessage('Nieprawidłowy status rezerwacji'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status } = req.body;

    try {
      const reservation = await Reservation.findById(id);
      if (!reservation) {
        return res
          .status(404)
          .json({ message: 'Rezerwacja nie została znaleziona' });
      }

      reservation.status = status;
      await reservation.save();

       await reservation.populate([
        { path: 'userId', select: 'firstName lastName email' },
        {
          path: 'carId',
          select: 'brand model registrationNumber',
        },
      ]);

      return res.json(reservation);
    } catch (err) {
      console.error('Admin update reservation status error:', err);
      return res
        .status(500)
        .json({ message: 'Błąd serwera podczas zmiany statusu rezerwacji' });
    }
  }
);

module.exports = router;
