import { Router } from 'express';
import { suggestPrice, matchTutors } from '../controllers/aiController';
import { createContent, getContent } from '../controllers/contentController';

const router = Router();

// AI Routes
router.post('/pricing', suggestPrice);
router.post('/match', matchTutors);

// Content Routes
router.post('/content', createContent);
router.get('/content', getContent);

export default router;
