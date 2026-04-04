const expressLoader = require('./express');

const init = async ({ expressApp }) => {
  // If we had a database, we would load it here:
  // await mongooseLoader();
  // console.log('DB loaded and connected!');

  await expressLoader({ app: expressApp });
  console.log('Express App loaded!');
};

module.exports = {
  init
};
