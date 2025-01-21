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

## 產生 JWT 密鑰

你可以使用以下指令產生安全的 JWT 密鑰：

```bash
openssl rand -base64 32

# 或者

node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 安裝步驟

1. 複製專案

```bash
git clone [repository-url]
```

2. 安裝相依套件

```bash
npm install
# 或
yarn install
```

3. 啟動開發伺服器

```bash
npm run dev
# 或
yarn dev
```

## API 端點

### 身份驗證

- `POST /api/auth/register` - 註冊新使用者
- `POST /api/auth/login` - 使用者登入
- `POST /api/auth/logout` - 使用者登出
- `PUT /api/auth/updateProfile` - 更新使用者頭像
- `GET /api/auth/check` - 檢查身份驗證狀態

### 訊息

- `GET /api/messages/users` - 取得側邊欄使用者列表
- `GET /api/messages/:id` - 取得與特定使用者的聊天記錄
- `POST /api/messages/send/:id` - 發送訊息給使用者
- `PUT /api/messages/:id` - 編輯訊息
- `DELETE /api/messages/:id` - 刪除訊息

## WebSocket 事件

### 伺服器事件 (發送)

- `getOnlineUsers` - 廣播在線使用者列表
- `newMessage` - 通知新訊息
- `messageEdited` - 通知訊息編輯
- `messageDeleted` - 通知訊息刪除

### 客戶端事件 (監聽)

- `connection` - 使用者連線
- `disconnect` - 使用者斷線

## 錯誤處理

應用程式實作全域錯誤處理中間件，使用自定義 AppError 類別確保一致的錯誤回應。

## 資料模型

### 使用者模型

- email (唯一)
- fullName
- password (雜湊處理)
- profilePicture
- timestamps

### 訊息模型

- senderId
- receiverId
- text
- image
- isEdited
- editHistory
- isDeleted
- deletedAt
- status (sent/delivered/read)
- readBy

## 參與貢獻

1. Fork 此專案
2. 建立功能分支
3. 提交變更
4. 推送到分支
5. 建立新的 Pull Request

## 授權條款

MIT
