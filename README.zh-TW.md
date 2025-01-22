# Chatify Server

_其他語言版本：[English](README.md)_

這是一個使用 Node.js、Express、Socket.IO 和 MongoDB 建構的即時聊天應用後端。

## 功能特色

- [x] 使用 Socket.IO 實現即時訊息
- [x] 一對一聊天功能
- [x] 訊息歷史記錄
- [x] 訊息編輯與歷史記錄
- [x] 訊息軟刪除
- [x] 使用 Cloudinary 整合圖片訊息支援
- [ ] 訊息狀態追蹤（已發送、已送達、已讀）

## 技術架構

- Node.js
- Express.js
- MongoDB 搭配 Mongoose
- Socket.IO
- JWT 身份驗證
- Cloudinary 圖片儲存
- Joi 資料驗證

## 環境需求

- Node.js (建議 v18 以上)
- MongoDB 資料庫
- Cloudinary 帳號
- 環境變數設定

## 環境變數設定

在根目錄建立 `.env` 檔案，並設定以下變數：

```env
PORT=5001
MONGODB_URI=你的_mongodb_連線字串
JWT_SECRET=你的_jwt_密鑰
JWT_EXPIRATION_TIME=24h
CLIENT_URLS=["http://localhost:5173", 你的_client_url]
CLOUDINARY_CLOUD_NAME=你的_cloud_name
CLOUDINARY_API_KEY=你的_api_key
CLOUDINARY_API_SECRET=你的_api_secret
```
