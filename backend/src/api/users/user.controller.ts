import { Request, Response } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';
import jwt from 'jsonwebtoken';
import catchAsync from '../../utils/catchAsync';
import userService from './user.service';
import config from '../../config';
import { AuthRequest } from '../../middlewares/authMiddleware';

const generateToken = (username: string) => {
  return jwt.sign({ username }, config.jwtSecret, { expiresIn: '1h' });
};

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  const token = generateToken(user.username);
  res.status(201).json({ message: 'User created successfully', user, token });
});

const getMe = catchAsync<ParamsDictionary, any, any, Query>(async (req: AuthRequest, res: Response) => {
  // Safe access because authenticateToken guarantees req.user
  const user = await userService.getUserByUsername(req.user!.username);
  res.json({ user });
});

const getUser = catchAsync<{ username: string }>(async (req: Request<{ username: string }>, res: Response) => {
  const user = await userService.getUserByUsername(req.params.username);
  res.json({ user });
});

const updateUser = catchAsync<{ username: string }>(async (req: Request<{ username: string }>, res: Response) => {
  const user = await userService.updateUser(req.params.username, req.body);
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
  getAllUsers,
};
