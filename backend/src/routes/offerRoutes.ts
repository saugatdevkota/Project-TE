import { Router } from 'express';
import { createOffer, respondToOffer, getOffers } from '../controllers/offerController';

const router = Router();

router.post('/', createOffer);
router.post('/:offerId/respond', respondToOffer);
router.get('/', getOffers);

export default router;
