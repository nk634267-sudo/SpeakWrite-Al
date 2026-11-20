const errorHandler = (err, req, res, next) => {
  console.error('API Error:', err.message || err);

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  
  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected server error occurred. Please try again.',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
};

const notFound = (req, res, next) => {
  const error = new Error(`Resource not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = { errorHandler, notFound };
