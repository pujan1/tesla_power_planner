const User = require('./user.model');

const checkUserExists = async (username) => {
  const user = await User.findOne({ username });
  return !!user;
};

const createUser = async (userData) => {
  const newUser = await User.create(userData);
  return newUser.toJSON();
};

const getUserByUsername = async (username) => {
  const user = await User.findOne({ username });
  return user ? user.toJSON() : null;
};

const updateUser = async (username, updateData) => {
  const updatedUser = await User.findOneAndUpdate(
    { username },
    { $set: updateData },
    { new: true, runValidators: true }
  );
  return updatedUser ? updatedUser.toJSON() : null;
};

const getAllUsers = async () => {
  const users = await User.find({});
  return users.map(user => user.toJSON());
};

module.exports = {
  checkUserExists,
  createUser,
  getUserByUsername,
  updateUser,
  getAllUsers,
};
