import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: { type: String },
    image: { type: String },
    // 編輯訊息
    isEdited: { type: Boolean, default: false },
    editHistory: [
      {
        text: { type: String },
        image: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    // 刪除訊息
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    // 訊息狀態追蹤
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read'],
      default: 'sent',
    },
    // 已讀狀態追蹤
    readBy: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // 送達狀態追蹤
    deliveredTo: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        deliveredAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // 訊息類型 (後續可以擴充開發群組聊天)
    chatType: {
      type: String,
      enum: ['private', 'group'],
      default: 'private',
    },
    // 群組 ID
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      default: null,
    },
  },
  { timestamps: true },
);

const Message = mongoose.model('Message', messageSchema);

export default Message;
