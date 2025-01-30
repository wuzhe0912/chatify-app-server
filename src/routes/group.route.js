import { Router } from 'express';
import {
  createGroup,
  getUserGroups,
  sendMessageToGroup,
  getGroupMessages,
} from '../controllers/group.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = Router();

// Create a group
router.post('/', protectRoute, createGroup);
// Get user's groups
router.get('/', protectRoute, getUserGroups);
// Send message to group
router.post('/:groupId/message', protectRoute, sendMessageToGroup);
// Get group messages
router.get('/:groupId/messages', protectRoute, getGroupMessages);

export default router;
