/** @format */
import { SERVER_URI, USER_KEY } from '../constants';
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import storage from '../utils/storage';
import { messageT } from '../components/Room/MessageInput/MessageInput';

export interface userT {
  userId: string;
  userName: string;
  roomId: string;
}

export default function useChat() {
  const user: userT | null = storage.get(USER_KEY);
  const [users, setUsers] = useState<userT[]>([]);
  const [messages, setMessages] = useState([]);
  const [log, setLog] = useState<string | null>(null);
  // иммутабельное состояние для сокета
  const { current: socket } = useRef(
    io(SERVER_URI, {
      query: {
        // отпрвляем id команты и имя пользователя на сервер
        roomId: user?.roomId,
        userName: user?.userName,
      },
    })
  );
  // регистрируем обработчик
  useEffect(() => {
    // сообщаем о подключении нового пользователя
    socket.emit('user:add', user);
    // запрашиваем сообщение из БД
    socket.emit('message:get');
    // обрабатываем получение системного сообщения
    socket.on('log', (log) => {
      setLog(log);
    });
    // обрабатываем получение обновленного списка пользователей
    socket.on('user_list:update', (users) => {
      setUsers(users);
    });
    // обрабатываем получение обновлённого списка сообщений
    socket.on('message_list:update', (messages) => {
      setMessages(messages);
    });
  }, [socket]);

  const sendMessage = (message: messageT) => {
    socket.emit('message:add', message);
  };
  const removeMessage = (message: messageT) => {
    socket.emit('message:remove', message);
  };

  return { users, messages, log, sendMessage, removeMessage };
}
