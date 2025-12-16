import { Router } from 'express';
import { captureSnapshot, getMarketRates } from '../controllers/pricingController';

const router = Router();

// Trigger a new snapshot (Admin or Scheduled Job would call this)
router.post('/snapshot', captureSnapshot);

// Get current market data
router.get('/market-rates', getMarketRates);

export default router;
