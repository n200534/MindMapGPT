const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/auth');
const prisma = require('../config/database');

const authenticateToken = async (req, res, next) => {
  // Check for token in cookies first (for same-domain requests)
  // Then check Authorization header (for cross-domain requests)
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

module.exports = {
  authenticateToken
}; 