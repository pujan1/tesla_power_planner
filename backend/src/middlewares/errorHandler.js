const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  
  if (!statusCode) {
    statusCode = 500;
  }
  
  res.locals.errorMessage = err.message;

  const response = {
    error: message || 'Internal Server Error'
  };

  res.status(statusCode).send(response);
};

module.exports = errorHandler;
