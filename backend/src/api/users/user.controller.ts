import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import catchAsync from '../../utils/catchAsync';
import userService from './user.service';
import config from '../../config';

const generateToken = (username: string) => {
  return jwt.sign({ username }, config.jwtSecret, { expiresIn: '1h' });
};

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  const token = generateToken(user.username);
  res.status(201).json({ message: 'User created successfully', user, token });
});

const getMe = catchAsync(async (req: any, res: Response) => {
  const user = await userService.getUserByUsername(req.user.username);
  res.json({ user });
});

const getUser = catchAsync(async (req: Request /* technically AuthRequest, safe */, res: Response) => {
  const user = await userService.getUserByUsername(req.params.username as string);
  res.json({ user });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.updateUser(req.params.username as string, req.body);
  res.json({ message: 'User updated successfully', user });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.loginUser(req.body.username, req.body.password);
  const token = generateToken(user.username);
  res.json({ message: 'Login successful', user, token });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  res.json({ count: users.length, users });
});

export default {
  createUser,
  getMe,
  getUser,
  updateUser,
  login,
  getAllUsers
};
