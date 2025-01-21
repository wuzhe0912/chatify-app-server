# Chatify Server

_Read this in other languages: [繁體中文](README.zh-TW.md)_

A real-time chat application backend built with Node.js, Express, Socket.IO, and MongoDB.

## Features

- [x] Real-time messaging using Socket.IO
- [x] One-on-one chat functionality
- [x] Message history
- [x] Message editing with edit history
- [x] Soft delete messages
- [x] Image message support with Cloudinary integration
- [ ] Message status tracking (sent, delivered, read)

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.IO
- JWT for authentication
- Cloudinary for image storage
- Joi for validation

## Prerequisites

- Node.js (v18+ recommended)
- MongoDB database
- Cloudinary account
- Environment variables setup

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION_TIME=24h
CLIENT_URLS=["http://localhost:5173", your_client_url]
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
