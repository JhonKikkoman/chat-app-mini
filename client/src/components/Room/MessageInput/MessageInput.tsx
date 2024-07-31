/** @format */

import fileApi from '../../../api/file.api';
import { USER_KEY } from '../../../constants';
import useStore from '../../../hooks/useStore';
import { nanoid } from 'nanoid';
import { useEffect, useRef, useState } from 'react';
import { FiSend } from 'react-icons/fi';
import storage from '../../../utils/storage';
import EmojiMart from './EmojiMart/EmojiMart';
import FileInput from './FileInput/FileInput';
import Recorder from './Recorder/Recorder';
import { userT } from '../../../hooks/useChat';

interface propT {
  sendMessage: (message: messageT) => void;
}

export interface messageT {
  messageId: string;
  userId: string;
  userName: string;
  roomId: string;
  messageType?: string;
  textOrPathToFile?: string;
}

export default function MessageInput({ sendMessage }: propT) {
  const user: userT | null = storage.get(USER_KEY);
  const state = useStore((state) => state);
  const {
    file,
    setFile,
    showPreview,
    setShowEmoji,
    setShowPreview,
    showEmoji,
  } = state;
  // локальное состояние для текста сообщения
  const [text, setText] = useState('');
  // локальное состояние блокировки кнопки
  const [submitDis, setSubmitDis] = useState(true);
  // иммутабельная ссылка на инпут для ввода текста сообщения
  const inputRef = useRef<HTMLInputElement | null>(null);

  // для отправки сообщения требуется либо текст лиюо файл
  useEffect(() => {
    setSubmitDis(!text.trim() && !file);
  }, [text, file]);

  // отображаем превью при наличии файла
  useEffect(() => {
    setShowPreview(file);
  }, [file, setShowPreview]);

  // функция для отправки сообщения
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitDis) return;

    // извлекаем данные пользователя и формируем начальное сообщение
    if (user !== null) {
      const { userId, userName, roomId } = user;
      let message: messageT = {
        messageId: nanoid(),
        userId,
        userName,
        roomId,
      };

      if (!file) {
        // если не файл , то тип сообщения текст
        message.messageType = 'text';
        message.textOrPathToFile = text;
      } else {
        // иначе... тип сообщения файл
        try {
          // загружаем файл на сервер и получаем относительный путь к нему
          const path = await fileApi.upload({ file, roomId });
          // получаем тип файла
          const type = file.type.split('/')[0];

          message.messageType = type;
          message.textOrPathToFile = path;
        } catch (e) {
          console.error(e);
        }
      }
      // скрываем компонент с эмодзи
      if (showEmoji) {
        setShowEmoji(false);
      }
      sendMessage(message);
    }
    // сбрасываем состояние до начального
    setText('');
    setFile(null);
  };
  return (
    <>
      <form onSubmit={onSubmit} className='form message'>
        <EmojiMart setText={setText} messageInput={inputRef.current} />
        <FileInput />
        <Recorder />
        <input
          type='text'
          autoFocus
          placeholder='Message...'
          value={text}
          onChange={(e) => setText(e.target.value)}
          ref={inputRef}
          disabled={showPreview}
        />
        <button type='submit' className='btn' disabled={submitDis}>
          <FiSend className='icon' />
        </button>
      </form>
    </>
  );
}
