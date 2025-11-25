const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

/**
 * POST /api/auth/register
 * Rejestracja nowego użytkownika
 */
router.post(
  '/register',
  [
    body('firstName').trim().notEmpty().withMessage('Imię jest wymagane'),
    body('lastName').trim().notEmpty().withMessage('Nazwisko jest wymagane'),
    body('email').isEmail().withMessage('Podaj poprawny adres email'),
    body('phone').trim().notEmpty().withMessage('Telefon jest wymagany'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Hasło musi mieć co najmniej 6 znaków'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // 400 = błędne dane wejściowe
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, phone, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        // 409 = conflict
        return res
          .status(409)
          .json({ message: 'Użytkownik z takim adresem email już istnieje' });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await User.create({
        firstName,
        lastName,
        email,
        phone,
        passwordHash,
        role: 'user',
      });

      const userSafe = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      };

      return res.status(201).json({ user: userSafe });
    } catch (err) {
      console.error('Register error:', err);
      return res
        .status(500)
        .json({ message: 'Błąd serwera podczas rejestracji użytkownika' });
    }
  }
);

/**
 * POST /api/auth/login
 * Logowanie użytkownika
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Podaj poprawny adres email'),
    body('password').notEmpty().withMessage('Hasło jest wymagane'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        // specjalnie nie mówimy, czy zły email czy hasło
        return res
          .status(401)
          .json({ message: 'Nieprawidłowy email lub hasło' });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: 'Nieprawidłowy email lub hasło' });
      }

      const payload = {
        userId: user._id,
        role: user.role,
      };

      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET || 'dev_jwt_secret_do_zmiany',
        {
          expiresIn: '1d',
        }
      );

      const userSafe = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      };

      return res.json({ token, user: userSafe });
    } catch (err) {
      console.error('Login error:', err);
      return res
        .status(500)
        .json({ message: 'Błąd serwera podczas logowania użytkownika' });
    }
  }
);

module.exports = router;
