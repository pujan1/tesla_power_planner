import express from 'express';
import config from './config';
import loaders from './loaders';

async function startServer() {
  const app = express();

  await loaders.init({ expressApp: app });

  app.listen(config.port, () => {
    console.log(`Backend server running on http://localhost:${config.port}`);
  });
}

startServer();
