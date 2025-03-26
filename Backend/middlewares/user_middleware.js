const jwt = require('jsonwebtoken');
const Member = require('../models/member');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      console.log('Decoded Token:', decoded); // Check the token payload

      // Attach the user to the request object
      req.user = await Member.findById(decoded.id).select('-password'); // Fetch user without password

      if (!req.user) {
        return res.status(401).json({ message: 'User not found, invalid token' });
      }

      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
