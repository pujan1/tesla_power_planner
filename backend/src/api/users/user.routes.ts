import { Router } from 'express';
import userController from './user.controller';

const router = Router();

router.get('/users', userController.getAllUsers);
router.post('/users', userController.createUser);
router.get('/users/:username', userController.getUser);
router.put('/users/:username', userController.updateUser);

router.post('/login', userController.login);

export default router;
