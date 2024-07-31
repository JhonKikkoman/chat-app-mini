/** @format */

import useStore from '../../../../hooks/useStore';
import { useEffect, useRef } from 'react';
import { MdAttachFile } from 'react-icons/md';
import FilePreview from './FilePreview';

export default function FileInput() {
  // извлекаем файл и метод для его обновления из хранилища
  const { file, setFile } = useStore(({ file, setFile }) => ({
    file,
    setFile,
  }));
  // иммутабельная ссылка на инпут для добавления файла
  // скрываем инпут за кнопкой
  const inputRef = useRef<HTMLInputElement | null>(null);

  // cбрасываем значение инпута при отсутствии файла
  useEffect(() => {
    if (!file) {
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  }, [file]);

  return (
    <>
      <div className='container file'>
        <input
          type='file'
          accept='image/*, audio/* video/*'
          onChange={(e) => (e.target.files ? setFile(e.target.files[0]) : null)}
          className='visually-hidden'
          ref={inputRef}
        />
        <button
          type='button'
          className='btn'
          // передаём клик инпуту
          onClick={() => inputRef.current?.click()}
        >
          <MdAttachFile className='icon' />
        </button>
        {file && <FilePreview />}
      </div>
    </>
  );
}
