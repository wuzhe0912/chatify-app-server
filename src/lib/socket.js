import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import Message from '../models/message.model.js';
import { sendMessageToGroup } from '../services/group.service.js';

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

  // ---- 1. 加入群組房間 ----
  socket.on('joinGroup', ({ groupId }) => {
    // 讓當前使用者 (socket) 加入群組房間
    socket.join(`group_${groupId}`);
    console.log(`User(${socket.id}) joined group_${groupId}`);
  });

  // 離開群組房間
  socket.on('leaveGroup', ({ groupId }) => {
    socket.leave(`group_${groupId}`);
    console.log(`User(${socket.id}) left group_${groupId}`);
  });

  // ---- 2. 發送群組訊息 ----
  socket.on('sendGroupMessage', async ({ senderId, groupId, text, image }) => {
    try {
      // 先寫入DB (群組權限檢查、創建 Message)
      const newMessage = await sendMessageToGroup(senderId, groupId, {
        text,
        image,
      });
      // 用房間的方式，廣播給同群組所有人
      io.to(`group_${groupId}`).emit('newGroupMessage', newMessage);

      // 未來擴充：
      // 1. 通知線上成員中誰有新訊息
      // 2. 更新未讀數
    } catch (err) {
      console.log('Error in sendGroupMessage socket event:', err);
      // 如果出錯，可以回傳錯誤資訊給前端
      socket.emit('error', err?.message || 'Group message sending failed');
    }
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
      console.log('Error in markMessageAsRead socket event:', error);
    }
  });

  // 使用者斷線，移除其在 userSocketMap 中的記錄，並向所有線上的使用者推播，更新當前線上的使用者列表
  socket.on('disconnect', () => {
    console.log(`A user disconnected: ${socket.id}`);
    delete userSocketMap[userId];
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

// tool function, 取得接收者的 socket id
export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

export { io, app, server };
