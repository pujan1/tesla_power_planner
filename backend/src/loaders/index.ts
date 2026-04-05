import express from 'express';
import expressLoader from './express';
import mongooseLoader from './mongoose';

const init = async ({ expressApp }: { expressApp: express.Application }) => {
  await mongooseLoader();
  console.log('DB loaded and connected!');

  await expressLoader({ app: expressApp });
  console.log('Express App loaded!');
};

export default { init };
