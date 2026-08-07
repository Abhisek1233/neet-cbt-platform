const responseHandler = require('../utils/responseHandler');

exports.requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    req.user = { id: 'usr_guest', role: 'student', isGuest: true };
    return next();
  }
  req.user = { id: 'usr_logged_in', role: 'student', isGuest: false };
  next();
};

exports.requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return responseHandler.error(res, 'Unauthorized Access: Role restriction', 403);
    }
    next();
  };
};
