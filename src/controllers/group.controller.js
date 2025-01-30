import {
  createGroup as createGroupService,
  getUserGroups as getUserGroupsService,
  sendMessageToGroup as sendMessageToGroupService,
} from '../services/group.service.js';
import Group from '../models/group.model.js';
import Message from '../models/message.model.js';
import { AppError } from '../utils/error.utils.js';

export const createGroup = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { name, members } = req.body;

    const group = await createGroupService(userId, name, members);
    res.status(201).json({
      message: 'Group created successfully',
      group,
    });
  } catch (err) {
    next(err);
  }
};

export const getUserGroups = async (req, res, next) => {
  try {
    const userId = req.user._id;
    // 回傳群組及未讀訊息數
    const groups = await getUserGroupsService(userId);
    res.status(200).json({ groups });
  } catch (err) {
    next(err);
  }
};

export const sendMessageToGroup = async (req, res, next) => {
  try {
    const senderId = req.user._id;
    const { groupId } = req.params;
    const { text, image } = req.body;

    const newMessage = await sendMessageToGroupService(senderId, groupId, {
      text,
      image,
    });

    res.status(200).json({
      message: 'Group message sent successfully',
      success: true,
      data: newMessage,
    });
  } catch (err) {
    next(err);
  }
};

export const getGroupMessages = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;

    // 1. 先檢查群組是否存在
    const group = await Group.findById(groupId);
    if (!group) {
      throw new AppError('該群組不存在或已被刪除', 404);
    }

    // 2. 檢查是否為群組成員
    const isMember = group.members.some(
      (member) => member.toString() === userId.toString(),
    );
    if (!isMember) {
      throw new AppError('您無權查看此群組的訊息', 403);
    }

    // 3. 取回群組訊息
    const messages = await Message.find({
      groupId,
      chatType: 'group',
      isDeleted: { $ne: true },
    }).sort({ createdAt: 1 });

    res.status(200).json({ messages });
  } catch (err) {
    next(err);
  }
};
