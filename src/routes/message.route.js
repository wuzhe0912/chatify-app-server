import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  markMessageAsRead,
} from '../controllers/message.controller.js';

const router = express.Router();

// 取得所有使用者(用於側邊欄)
router.get('/users', protectRoute, getUsersForSidebar);
// 取得與特定使用者的聊天紀錄
router.get('/:id', protectRoute, getMessages);
// 允許編輯訊息
router.put('/:id', protectRoute, editMessage);
// 發送訊息
router.post('/send/:id', protectRoute, sendMessage);
// 刪除訊息
router.delete('/:id', protectRoute, deleteMessage);
// 標記訊息為已讀
router.put('/:messageId/markAsRead', protectRoute, markMessageAsRead);

export default router;
