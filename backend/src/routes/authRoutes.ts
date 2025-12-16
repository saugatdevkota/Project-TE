import { Router } from 'express';
import { register, login, updateProfile, refreshToken, logout } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.patch('/profile', authenticateToken, updateProfile);

export default router;
