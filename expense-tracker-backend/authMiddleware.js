const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // 1. Get token from the request header
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  // 2. Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // 3. Verify the token
  try {
    const secret = process.env.JWT_SECRET || 'fallback_secret_key';
    const decoded = jwt.verify(token, secret);

    // 4. Add user ID from token payload to the request object
    req.userId = decoded.userId;
    next(); // Pass control to the next function (the actual route handler)

  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = authMiddleware;