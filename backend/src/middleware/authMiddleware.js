const jwt = require('jsonwebtoken');

/**
 * Sprawdza token JWT w nagłówku Authorization: Bearer <token>
 */
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ message: 'Brak tokenu autoryzacyjnego (Authorization header)' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'dev_jwt_secret_do_zmiany'
    );

    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (err) {
    console.error('JWT verify error:', err);
    return res
      .status(401)
      .json({ message: 'Nieprawidłowy lub wygasły token autoryzacyjny' });
  }
};

/**
 * Middleware do ochrony tras tylko dla administratora
 */
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Brak uprawnień administratora' });
  }
  next();
};

module.exports = {
  auth,
  requireAdmin,
};
