/**
 * Error handling middleware
 */

/**
 * 404 Not Found handler
 */
function notFoundHandler(req, res, next) {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`,
    path: req.url
  });
}

/**
 * Global error handler
 */
function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  // Default error status and message
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Development vs production error response
  const isDevelopment = process.env.NODE_ENV === 'development';

  const errorResponse = {
    error: err.name || 'Error',
    message,
    ...(isDevelopment && { stack: err.stack })
  };

  res.status(status).json(errorResponse);
}

module.exports = {
  notFoundHandler,
  errorHandler
};
