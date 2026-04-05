import userRepository from './user.repository';
import ApiError from '../../utils/ApiError';

const createUser = async (userData: any) => {
  const { username, password, name } = userData;

  if (!username || !password || !name) {
    throw new ApiError(400, 'Username, password, and name are required');
  }

  const exists = await userRepository.checkUserExists(username);
  if (exists) {
    throw new ApiError(409, 'User already exists');
  }

  userData.language = 'en';
  userData.theme = 'dark';

  return userRepository.createUser(userData);
};

const getUserByUsername = async (username: string) => {
  const user = await userRepository.getUserByUsername(username);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};

const updateUser = async (username: string, updateData: any) => {
  const exists = await userRepository.checkUserExists(username);
  if (!exists) {
    throw new ApiError(404, 'User not found');
  }

  const payload: any = {};
  if (updateData.password !== undefined) payload.password = updateData.password;
  if (updateData.name !== undefined) payload.name = updateData.name;
  if (updateData.language !== undefined) payload.language = updateData.language;
  if (updateData.theme !== undefined) payload.theme = updateData.theme;

  return userRepository.updateUser(username, payload);
};

const loginUser = async (username: string, password: string) => {
  const user = await userRepository.getUserByUsername(username);
  if (!user) {
    throw new ApiError(401, 'Invalid username or password');
  }

  if (user.password !== password) {
    throw new ApiError(401, 'Invalid username or password');
  }

  return user;
};

const getAllUsers = async () => {
  return userRepository.getAllUsers();
};

export default {
  createUser,
  getUserByUsername,
  updateUser,
  loginUser,
  getAllUsers
};
