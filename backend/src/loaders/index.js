const expressLoader = require('./express');
const mongooseLoader = require('./mongoose');

const init = async ({ expressApp }) => {
  await mongooseLoader();
  console.log('DB loaded and connected!');

  await expressLoader({ app: expressApp });
  console.log('Express App loaded!');
};

module.exports = {
  init
};
