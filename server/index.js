/** @format */

import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import { ALLOWED_ORIGIN, MONGODB_URL } from './config.js';
import onConnection from './socket_io/onConnection.js';
import { getFilePath } from './utils/file.js';
import onError from './utils/onError.js';
import upload from './utils/upload.js';

const app = express();

app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use(express.json());

// обработка загрузки файлов(загрузка на сервер)
app.use('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.sendStatus(400);
  }
  // формируем относительный путь к файлу
  const relativeFilePath = req.file.path
    .replace(/\\/g, '/')
    .split('server/files')[1];
  res.status(201);
  res.json(relativeFilePath);
});

// обработка получение файлов(загрузка на клиент)
app.use('/files', (req, res) => {
  // получаем при помощи функции абсолютный путь
  const filePath = getFilePath(req.url);
  res.status(200);
  res.sendFile(filePath);
});

app.use(onError);

// подключение к BD
try {
  await mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(`------Connected to DB------------`);
} catch (error) {
  onError(error);
}

const server = createServer(app);

const io = new Server(server, {
  cors: ALLOWED_ORIGIN,
  serveClient: false,
});

io.on('connection', socket => {
  onConnection(io, socket);
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server - http://localhost:${PORT}`);
});
