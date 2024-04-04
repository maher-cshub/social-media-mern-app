const jwt = require('jsonwebtoken');
const config = require('../config/config');
const Token = require("../models/tokenModel")

module.exports = async (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });
  const isBlacklisted = await Token.findOne({token:token})
  if (isBlacklisted) return res.status(401).json({message: "Acces denied!"})
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token.' });
  }
};
