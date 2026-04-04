const express = require('express');
const config = require('./config');
const loaders = require('./loaders');

async function startServer() {
  const app = express();

  // Initialize loaders (express middlewares, routes, etc.)
  await loaders.init({ expressApp: app });

  app.listen(config.port, () => {
    console.log(`Backend server running on http://localhost:${config.port}`);
  });
}

startServer();
