import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);

// init socket.io and set client url
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173'],
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
});

// tool function, 取得接收者的 socket id
export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

export { io, app, server };
