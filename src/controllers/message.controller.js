import User from '../models/user.model.js';
import Message from '../models/message.model.js';
import cloudinary from '../lib/cloudinary.js';
import { getReceiverSocketId, io } from '../lib/socket.js';

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    // 取得除了登入使用者以外的所有使用者
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select('-password');

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log('Error in getUsersForSidebar controller', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatWithId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatWithId },
        { senderId: userToChatWithId, receiverId: myId },
      ],
      isDeleted: { $ne: true }, // 排除已刪除的訊息
    }).sort({ createdAt: 1 }); // 按照創建時間排序，採升序排列，方便前端顯示最新的消息

    res.status(200).json(messages);
  } catch (error) {
    console.log('Error in getMessages controller', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl = null;
    if (image) {
      const result = await cloudinary.uploader.upload(image);
      imageUrl = result.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log('Error in sendMessage controller', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 編輯訊息
export const editMessage = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const { text } = req.body;
    const senderId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // 檢查發送者是否是訊息的發送者
    if (message.senderId.toString() !== senderId.toString()) {
      return res
        .status(403)
        .json({ message: 'Not authorized to edit this message' });
    }

    // 儲存原始訊息到編輯歷史
    message.editHistory.push({
      text: message.text,
      image: message.image,
      editedAt: new Date(),
    });

    // 更新訊息
    message.text = text;
    message.isEdited = true;
    await message.save();

    // 透過 socket 通知接收者訊息已編輯
    const receiverSocketId = getReceiverSocketId(message.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('messageEdited', message);
    }

    res.status(200).json(message);
  } catch (error) {
    console.log('Error in editMessage controller', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const senderId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // 確認是否為訊息發送者
    if (message.senderId.toString() !== senderId.toString()) {
      return res
        .status(403)
        .json({ message: 'Not authorized to delete this message' });
    }

    // 軟刪除訊息
    message.isDeleted = true;
    message.deletedAt = new Date();
    await message.save();

    // 透過 Socket.io 通知接收者訊息已被刪除
    const receiverSocketId = getReceiverSocketId(message.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('messageDeleted', message._id);
    }

    res.status(200).json(message);
  } catch (error) {
    console.log('Error in deleteMessage controller', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
