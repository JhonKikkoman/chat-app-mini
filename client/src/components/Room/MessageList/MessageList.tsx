/** @format */

import { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import { messageT } from '../MessageInput/MessageInput';

export interface messagesT extends messageT {
  createAt: number;
  _id: string;
  updatedAt: string;
  createdAt: string;
}

interface propT {
  log: string | null;
  messages: messagesT[];
  removeMessage: (message: messageT) => void;
}

export default function MessageList({ log, messages, removeMessage }: propT) {
  // иммутабельная ссылка на элемент для логов
  const logRef = useRef<HTMLParagraphElement | null>(null);
  // иммутабельная ссылка на конец списка сообщений
  const bottomRef = useRef<HTMLParagraphElement | null>(null);
  // выполняем прокрутку к концу списка при добавлнеии нового  сообщения
  // это может стать пробемой при большом количестве пользователей
  // когда участники чата не будут успевать читать сообщения
  useEffect(() => {
    if (bottomRef !== null) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // отображаем и скрываем логи
  useEffect(() => {
    if (log) {
      if (logRef.current !== null) {
        logRef.current.style.opacity = ' 0.8';
        logRef.current.style.zIndex = '1';
      }
    }
    const timerId = setTimeout(() => {
      if (logRef.current !== null) {
        logRef.current.style.opacity = '0';
        logRef.current.style.zIndex = '-1';
      }
      clearTimeout(timerId);
    }, 1500);
  }, [log]);

  return (
    <>
      <div className='container message'>
        <h2>Messages</h2>
        <ul className='list message'>
          {messages.map((message: messagesT) => {
            return (
              <MessageItem
                key={message.messageId}
                message={message}
                removeMessage={removeMessage}
              />
            );
          })}
          <p ref={bottomRef}></p>
          <p ref={logRef} className='log'>
            {log}
          </p>
        </ul>
      </div>
    </>
  );
}
