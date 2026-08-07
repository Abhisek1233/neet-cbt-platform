const jwt = require('jsonwebtoken');
const responseHandler = require('../utils/responseHandler');

const JWT_SECRET = process.env.JWT_SECRET || 'neet_cbt_super_secret_jwt_key_2026';

exports.requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    // Allow guest or public access for reading mock exams, but flag as guest
    req.user = { id: 'usr_guest', role: 'student', isGuest: true };
    return next();
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    req.user = { id: 'usr_guest', role: 'student', isGuest: true };
    next();
  }
};

exports.requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user || req.user.isGuest || !allowedRoles.includes(req.user.role)) {
      return responseHandler.error(res, 'Unauthorized Access: Role restriction. Faculty HOD permissions required.', 403);
    }
    next();
  };
};
