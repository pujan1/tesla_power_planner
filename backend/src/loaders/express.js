const express = require('express');
const cors = require('cors');
const userRoutes = require('../api/users/user.routes');
const errorHandler = require('../middlewares/errorHandler');
const ApiError = require('../utils/ApiError');

module.exports = async ({ app }) => {
  // Global middlewares
  app.use(cors());
  app.use(express.json());

  // Mount API paths
  app.use('/api', userRoutes);

  // Catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new ApiError(404, 'Not Found');
    next(err);
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
