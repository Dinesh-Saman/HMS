const jwt = require('jsonwebtoken');
const Member = require('../models/member');

const protect = async (req, res, next) => {
    try {
        // Check for Authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                message: 'Not authorized, no token' 
            });
        }

        // Extract token
        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Find user and attach to request (excluding password)
        req.member = await Member.findById(decoded.id).select('-password');

        if (!req.member) {
            return res.status(401).json({ 
                message: 'Not authorized, member not found' 
            });
        }

        next();
    } catch (error) {
        console.error('Authentication Error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                message: 'Invalid token',
                error: error.message 
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: 'Token expired' 
            });
        }

        res.status(500).json({ 
            message: 'Authentication failed', 
            error: error.message 
        });
    }
};

module.exports = protect;