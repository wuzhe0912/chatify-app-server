import Group from '../models/group.model.js';
import Message from '../models/message.model.js';
import { AppError } from '../utils/error.utils.js';

export const createGroup = async (userId, name, members) => {
  // 確保建立群組的 userId 也在成員名單裡
  if (!members.includes(userId)) {
    members.push(userId);
  }

  const newGroup = await Group.create({
    name,
    members,
    createdBy: userId,
  });
  return newGroup;
};

export const getUserGroups = async (userId) => {
  // 只找出含有該使用者的群組
  const groups = await Group.find({
    members: { $in: [userId] },
  })
    .populate('members', '-password')
    .populate('createdBy', '-password')
    .lean(); // 使用 .lean() 讓之後可以直接修改回傳結果

  // 取得所有該使用者尚未讀取的群組訊息數
  // 條件：chatType = 'group'、groupId 在使用者參與的群組裡、isDeleted != true
  // 且 readBy 不包含該 userId
  const unreadCounts = await Message.aggregate([
    {
      $match: {
        chatType: 'group',
        groupId: { $in: groups.map((g) => g._id) },
        isDeleted: { $ne: true },
        'readBy.userId': { $ne: userId },
      },
    },
    {
      $group: {
        _id: '$groupId',
        count: { $sum: 1 },
      },
    },
  ]);

  // 將 aggregation 結果轉成方便存取的 Map (groupId -> unreadCount)
  const unreadMap = unreadCounts.reduce((acc, item) => {
    acc[item._id.toString()] = item.count;
    return acc;
  }, {});

  // 將未讀訊息數注入到每個 group 裡
  const groupsWithUnread = groups.map((group) => {
    return {
      ...group,
      unreadCount: unreadMap[group._id.toString()] || 0,
    };
  });

  return groupsWithUnread;
};

/**
 * 發送群組訊息
 * @param {string} senderId - 發送者 User ID
 * @param {string} groupId - 群組 ID
 * @param {Object} payload - 訊息內容，例如 { text, image }
 */
export const sendMessageToGroup = async (senderId, groupId, payload) => {
  // 1. 先檢查群組是否存在
  const group = await Group.findById(groupId);
  if (!group) {
    throw new AppError('群組不存在或已被刪除', 404);
  }

  // 2. 檢查是否為群組成員
  const isMember = group.members.some(
    (member) => member.toString() === senderId.toString(),
  );

  if (!isMember) {
    throw new AppError('你並非此群組成員，無法發送訊息', 403);
  }

  // 3. 建立並儲存訊息
  const messageData = {
    senderId,
    receiverId: null,
    text: payload.text || '',
    image: payload.image || '',
    chatType: 'group',
    groupId,
  };

  const newMessage = await Message.create(messageData);
  return newMessage;
};
