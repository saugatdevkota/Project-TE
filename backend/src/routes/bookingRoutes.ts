import { Router } from 'express';
import { createBooking, getMyBookings, completeSession, respondToBooking, releaseFunds } from '../controllers/bookingController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken); // Protect all booking routes

router.post('/', createBooking);
router.get('/', getMyBookings);
router.post('/:bookingId/respond', respondToBooking); // Accept/Reject
router.post('/:bookingId/complete', completeSession);
router.post('/:bookingId/release', releaseFunds);

export default router;
