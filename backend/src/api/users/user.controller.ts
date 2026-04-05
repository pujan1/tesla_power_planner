import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import userService from './user.service';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  res.status(201).json({ message: 'User created successfully', user });
});

const getUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.getUserByUsername(req.params.username as string);
  res.json({ user });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.updateUser(req.params.username as string, req.body);
  res.json({ message: 'User updated successfully', user });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.loginUser(req.body.username, req.body.password);
  res.json({ message: 'Login successful', user });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  res.json({ count: users.length, users });
});

export default {
  createUser,
  getUser,
  updateUser,
  login,
  getAllUsers
};
