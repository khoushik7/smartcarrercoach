const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'smart_career_coach_secret_key_2026';

const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (err) {
      return res.status(401).json({ error: 'Not authorized, invalid token.' });
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token provided.' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ error: 'Access denied: Admin privileges required.' });
};

const optionalProtect = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      // Proceed without user if token is invalid
    }
  }
  next();
};

module.exports = { protect, optionalProtect, adminOnly };
