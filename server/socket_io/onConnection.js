/** @format */

import userHandlers from './handlers/user.handler.js';
import messageHandlers from './handlers/message.handlers.js';

export default function onConnection(io, socket) {
  // извлекаем идентификатор и имя пользователя
  const { userName, roomId } = socket.handshake.query;

  // записываем их в объект сокета

  socket.roomId = roomId;
  socket.userName = userName;

  socket.join(roomId);

  // обработчик событий для пользователей
  userHandlers(io, socket);

  // обработчик событий для сообщений
  messageHandlers(io, socket);
}
