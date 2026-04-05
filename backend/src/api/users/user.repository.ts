import User, { IUser } from './user.model';

const checkUserExists = async (username: string): Promise<boolean> => {
  const user = await User.findOne({ username });
  return !!user;
};

const createUser = async (userData: any): Promise<any> => {
  const newUser = await User.create(userData);
  return newUser.toJSON();
};

const getUserByUsername = async (username: string): Promise<any | null> => {
  const user = await User.findOne({ username });
  return user ? user.toJSON() : null;
};

const updateUser = async (username: string, updateData: any): Promise<any | null> => {
  const updatedUser = await User.findOneAndUpdate(
    { username },
    { $set: updateData },
    { new: true, runValidators: true }
  );
  return updatedUser ? updatedUser.toJSON() : null;
};

const getAllUsers = async (): Promise<any[]> => {
  const users = await User.find({});
  return users.map(user => user.toJSON());
};

export default {
  checkUserExists,
  createUser,
  getUserByUsername,
  updateUser,
  getAllUsers,
};
