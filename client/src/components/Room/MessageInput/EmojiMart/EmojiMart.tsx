/** @format */

import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import useStore from '../../../../hooks/useStore';
import { useCallback, useEffect } from 'react';
import { BsEmojiSmile } from 'react-icons/bs';

interface propT {
  setText: React.Dispatch<React.SetStateAction<string>>;
  messageInput: HTMLInputElement | null;
}

export default function EmojiMart({ setText, messageInput }: propT) {
  // извлекаем соответствующие методы из хранилища
  const { showEmoji, setShowEmoji, showPreview } = useStore(
    ({ showEmoji, setShowEmoji, showPreview }) => ({
      showEmoji,
      setShowEmoji,
      showPreview,
    })
  );
  // обработчик нажатия клавши Esc
  const onKeydown = useCallback(
    (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        setShowEmoji(false);
      }
    },
    [setShowEmoji]
  );

  // регистрируем обработчик(onKeydown) на объекте window
  useEffect(() => {
    window.addEventListener('keydown', onKeydown);

    return () => {
      window.removeEventListener('keydown', onKeydown);
    };
  }, [onKeydown]);

  // метод для добавления эмодзи к тексту сообщения
  const onEmojiSelect = ({ native }: { native: string }) => {
    setText((text) => text + native);
    if (messageInput !== null) {
      messageInput.focus();
    }
  };

  return (
    <>
      <div className='container emoji'>
        <button
          type='button'
          className='btn'
          // * отображаем скрываем эмодзи при нажатии кнопки
          onClick={() => setShowEmoji(!showEmoji)}
          disabled={showPreview}
        >
          <BsEmojiSmile className='icon' />
        </button>
        {showEmoji && (
          <>
            <Picker
              data={data}
              onEmojiSelect={onEmojiSelect}
              emojiSize={20}
              showPreview={false}
              perLine={6}
            />
          </>
        )}
      </div>
    </>
  );
}
