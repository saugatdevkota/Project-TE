import { Router } from 'express';
import { getWallet, addFunds } from '../controllers/walletController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticateToken, getWallet);
router.post('/add', authenticateToken, addFunds);

export default router;
