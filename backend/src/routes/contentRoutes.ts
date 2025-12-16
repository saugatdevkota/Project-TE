import { Router } from 'express';
import { createContent, getContent } from '../controllers/contentController';
import {
    createCollection,
    getCollections,
    getCollectionById,
    updateCollection,
    deleteCollection
} from '../controllers/contentCollectionController';

const router = Router();

// Content Items (Single Files/Resources)
router.post('/items', createContent);
router.get('/items', getContent);

// Content Collections (Courses/Series)
router.post('/collections', createCollection);
router.get('/collections', getCollections);
router.get('/collections/:id', getCollectionById);
router.put('/collections/:id', updateCollection);
router.delete('/collections/:id', deleteCollection);

export default router;
