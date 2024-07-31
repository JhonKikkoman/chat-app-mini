/** @format */

import Message from '../../models/message.model.js';
import { removeFile } from '../../utils/file.js';
import onError from '../../utils/onError.js';

const messages = {};

export default function messageHandlers(io, socket) {
  // id команты
  const { roomId } = socket;

  const updateMessageList = () => {
    io.to(roomId).emit('message_list:update', messages[roomId]);
  };

  // обработка получение сообщений
  socket.on('message:get', async () => {
    try {
      // получаем сообщения по id из команты обращаясь к БД
      const _message = await Message.find({ roomId }).select('-__v');

      //  иницилизируем хранилище сообщения
      messages[roomId] = _message;

      updateMessageList();
    } catch (e) {
      onError(e);
    }
  });

  // обработка нового сообщения
  socket.on('message:add', (message) => {
    // это нужно для клиентской стороны
    message.createAt = Date.now();

    // пользователи не должны ждать записи сообщения в БД
    Message.create(message).catch(onError);

    // ! создаём сообщение оптимистически
    // ! предполагаем , что запись сообщения в БД будет успешна
    messages[roomId].push(message);

    updateMessageList();
  });

  // обработка удаления сообщения
  socket.on('message:remove', (message) => {
    // данные которые пропишем в клиенте (id, тип сообщения и путь)
    const { messageId, messageType, textOrPathToFile } = message;
    // пользователи не должны ждать удаления сообщения из БД
    // и файла на сервер (если сообщение - это файл)
    Message.deleteOne({ messageId })
      .then(() => {
        if (messageType !== 'text') {
          removeFile(textOrPathToFile);
        }
      })
      .catch(onError);

    // удаляем сообщение оптимистически
    messages[roomId] = messages[roomId].filter((m) => {
      return m.messageId !== messageId;
    });

    updateMessageList();
  });
}
