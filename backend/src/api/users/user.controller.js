const catchAsync = require('../../utils/catchAsync');
const userService = require('./user.service');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(201).json({ message: 'User created successfully', user });
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserByUsername(req.params.username);
  res.json({ user });
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUser(req.params.username, req.body);
  res.json({ message: 'User updated successfully', user });
});

const login = catchAsync(async (req, res) => {
  const user = await userService.loginUser(req.body.username, req.body.password);
  res.json({ message: 'Login successful', user });
});

const getAllUsers = catchAsync(async (req, res) => {
  const users = await userService.getAllUsers();
  res.json({ count: users.length, users });
});

module.exports = {
  createUser,
  getUser,
  updateUser,
  login,
  getAllUsers
};
