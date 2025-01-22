import Message from '../models/message.model.js';
import { AppError } from '../utils/error.utils.js';

export const updateMessageReadStatus = async (messageId, userId) => {
  const message = await Message.findById(messageId);

  if (!message) {
    throw new AppError('Message not found', 404);
  }

  // 確認使用者是否為訊息接收者
  if (message.receiverId.toString() !== userId.toString()) {
    throw new AppError('Not authorized to mark this message as read', 403);
  }

  // 檢查是否已經標記為已讀
  const alreadyRead = message.readBy.some(
    (read) => read.userId.toString() === userId.toString(),
  );

  if (!alreadyRead) {
    message.readBy.push({ userId, readAt: new Date() });
    message.status = 'read';
    await message.save();
  }

  return message;
};
