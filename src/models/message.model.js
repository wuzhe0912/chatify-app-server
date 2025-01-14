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
    // 是否已讀
    readStatus: {
      isRead: { type: Boolean, default: false },
      readAt: { type: Date, default: null },
    },
    // 刪除訊息
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

const Message = mongoose.model('Message', messageSchema);

export default Message;
