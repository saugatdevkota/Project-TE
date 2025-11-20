import { Router } from 'express';
import { getTutorProfile, updateTutorProfile, uploadVerificationDocs, getAllTutors } from '../controllers/tutorController';

const router = Router();

router.get('/', getAllTutors);
router.get('/:id', getTutorProfile);
router.put('/:id', updateTutorProfile);
router.post('/:id/verify', uploadVerificationDocs);

export default router;
