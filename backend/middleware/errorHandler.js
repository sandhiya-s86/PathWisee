function errorHandler(err, req, res, next) {
  console.error(err.stack || err.message || err);
  const status = err.status || 500;
  res.status(status).json({ detail: err.message || 'Internal server error' });
}

module.exports = errorHandler;
