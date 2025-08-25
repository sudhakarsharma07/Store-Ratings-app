const jwt = require('jsonwebtoken');
const User = require('../models/User');
const secret = process.env.JWT_SECRET || 'secret_placeholder';

module.exports = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ','') || req.query.token;
  if(!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, secret);
    req.user = await User.findById(decoded.id).select('-password');
    if(!req.user) return res.status(401).json({ message: 'Invalid token user not found' });
    next();
  } catch(err){
    return res.status(401).json({ message: 'Token is not valid' });
  }
};
