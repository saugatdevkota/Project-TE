import { Router } from 'express';
import { createBooking, getMyBookings, completeSession } from '../controllers/bookingController';

const router = Router();

router.post('/', createBooking);
router.get('/', getMyBookings);
router.post('/:bookingId/complete', completeSession);

export default router;
