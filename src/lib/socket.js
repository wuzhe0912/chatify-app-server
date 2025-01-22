import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);
const allowedOrigins = JSON.parse(
  process.env.CLIENT_URLS || '["http://localhost:5173"]',
);

// init socket.io and set client url
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// save user socket id
const userSocketMap = {};

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  // 從連接的請求中取得使用者 id(由前端提供)
  const userId = socket.handshake.query.userId;
  if (userId) {
    // 將使用者的 id 和 socket id 存入 userSocketMap
    userSocketMap[userId] = socket.id;
  }

  // 向所有在線的使用者推播，當前線上的使用者列表
  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  // 當使用者斷開連接時，移除其在 userSocketMap 中的記錄，並向所有線上的使用者推播，更新當前線上的使用者列表
  socket.on('disconnect', () => {
    console.log(`A user disconnected: ${socket.id}`);
    delete userSocketMap[userId];
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });

  // 監聽訊息已讀事件
  socket.on('markMessageAsRead', async ({ messageId, readerId }) => {
    try {
      const message = await Message.findById(messageId);
      if (message) {
        // 檢查是否已經標記為已讀
        const alreadyRead = message.readBy.some(
          (read) => read.userId.toString() === readerId.toString(),
        );

        if (!alreadyRead) {
          // 更新訊息的已讀狀態
          message.readBy.push({ userId: readerId, readAt: new Date() });
          message.status = 'read';
          await message.save();

          // 取得發送者的 socket id
          const senderSocketId = getReceiverSocketId(
            message.senderId.toString(),
          );

          // 如果發送者在線上，發送已讀通知
          if (senderSocketId) {
            io.to(senderSocketId).emit('messageRead', {
              messageId: message._id,
              readBy: message.readBy,
            });
          }
        }
      }
    } catch (error) {
      console.error('Error in markMessageAsRead socket event:', error);
    }
  });
});

// tool function, 取得接收者的 socket id
export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

export { io, app, server };
