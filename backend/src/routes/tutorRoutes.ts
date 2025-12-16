import { Router } from 'express';
import { getTutorProfile, updateTutorProfile, uploadVerificationDocs, getAllTutors, verifyTutor, togglePremium } from '../controllers/tutorController';

const router = Router();

router.get('/', getAllTutors);
router.get('/:id', getTutorProfile);
router.put('/:id', updateTutorProfile);
router.post('/:id/verify', uploadVerificationDocs);
router.post('/:id/approve', verifyTutor);
router.post('/:id/premium', togglePremium);

export default router;
