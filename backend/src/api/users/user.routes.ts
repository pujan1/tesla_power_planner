import { Router } from 'express';
import userController from './user.controller';
import { authenticateToken } from '../../middlewares/authMiddleware';

const router = Router();

router.get('/users', userController.getAllUsers);
router.post('/users', userController.createUser);

// Secure explicit payload parameters forcing authentications mechanically!
router.get('/users/:username', authenticateToken, userController.getUser);
router.put('/users/:username', authenticateToken, userController.updateUser);

router.post('/login', userController.login);
router.get('/auth/me', authenticateToken, userController.getMe);
router.post('/auth/sites', authenticateToken, userController.saveSite);
router.get('/auth/sites', authenticateToken, userController.getSites);

export default router;
