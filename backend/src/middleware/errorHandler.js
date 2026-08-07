const responseHandler = require('../utils/responseHandler');

module.exports = (err, req, res, next) => {
  console.error('🔥 Server Error Catch:', err.stack || err.message);
  return responseHandler.error(
    res,
    err.message || 'Internal Server Error',
    err.statusCode || 500,
    process.env.NODE_ENV === 'development' ? err.stack : null
  );
};
