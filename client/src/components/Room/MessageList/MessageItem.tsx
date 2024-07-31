/** @format */
import { SERVER_URI, USER_KEY } from '../../../constants';
import { CgTrashEmpty } from 'react-icons/cg';
import { GiSpeaker } from 'react-icons/gi';
// @ts-ignore
import { useSpeechSynthesis } from 'react-speech-kit';
import Timeago from 'react-timeago';
import storage from '../../../utils/storage';
import { messagesT } from './MessageList';

export interface propT {
  message: messagesT;
  removeMessage: (message: messagesT) => void;
}

export default function MessageItem({ message, removeMessage }: propT) {
  const user = storage.get(USER_KEY);
  // утилиты для переводы текста в речь
  const { speak, voices } = useSpeechSynthesis();
  // определяем язык приложения
  const lang = document.documentElement.lang || 'en';
  // голос гугла
  const voice = voices.find(
    (v: { lang: string; name: string }) =>
      v.lang.includes(lang) && v.name.includes('Google')
  );

  // элемент для рендеринга завист от типа сообщения
  let element: JSX.Element;
  const { messageType, textOrPathToFile } = message;
  // формируем абсолютный путь к файлу
  const pathToFile = `${SERVER_URI}/files${textOrPathToFile}`;
  // определяем элемент для рендеринга на основе типа сообщений
  switch (messageType) {
    case 'text':
      element = (
        <>
          <button
            className='btn'
            onClick={() => speak({ text: textOrPathToFile, voice })}
          >
            <GiSpeaker className='icon speak' />
          </button>
          <p>{textOrPathToFile}</p>
        </>
      );
      break;
    case 'image':
      element = <img src={pathToFile} alt='' />;
      break;
    case 'audio':
      element = <audio src={pathToFile} controls></audio>;
      break;
    case 'video':
      element = <video src={pathToFile} controls></video>;
      break;
    default:
      return null;
  }

  // определяем принадлежность сообщения текущему пользователю
  const isMyMessage = user?.userId === message.userId;
  return (
    <>
      <li className={`item message ${isMyMessage ? 'my' : ''}`}>
        <p className='username'>{isMyMessage ? 'Me' : message.userName}</p>
        <div className='inner'>
          {element}
          {isMyMessage && (
            <button className='btn' onClick={() => removeMessage(message)}>
              <CgTrashEmpty className='icon remove' />
            </button>
          )}
        </div>
        <p className='datetime'>
          <Timeago date={message.createAt} />
        </p>
      </li>
    </>
  );
}
