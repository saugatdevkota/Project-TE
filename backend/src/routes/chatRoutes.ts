import { Router } from 'express';
import { getConversations, getMessages } from '../controllers/chatController';

const router = Router();

router.get('/:userId/conversations', getConversations);
router.get('/:userId/messages/:otherId', getMessages);

export default router;
