// In-memory data store for minimal setup currently
const usersMap = new Map();

// If we need to connect to DB, this is the single file we modify
const checkUserExists = async (username) => {
  return usersMap.has(username);
};

const createUser = async (userData) => {
  usersMap.set(userData.username, userData);
  return userData;
};

const getUserByUsername = async (username) => {
  return usersMap.get(username);
};

const updateUser = async (username, updateData) => {
  const existingUser = usersMap.get(username);
  const updatedUser = {
    ...existingUser,
    ...updateData
  };
  usersMap.set(username, updatedUser);
  return updatedUser;
};

module.exports = {
  checkUserExists,
  createUser,
  getUserByUsername,
  updateUser,
};
