/** @format */

import useStore from '../../../../hooks/useStore';
import { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

export default function FilePreview() {
  // извлекаем файл и метод для обновление
  const { file, setFile } = useStore(({ file, setFile }) => ({
    file,
    setFile,
  }));
  // локальное состояние для источника файла
  const [src, setSrc] = useState<string>();
  const [type, setType] = useState<string>();

  // при наличии файла обновляем источник и тип файла
  useEffect(() => {
    if (file) {
      setSrc(URL.createObjectURL(file));
      setType(file.type.split('/')[0]);
    }
  }, [file]);

  // элемент для рендеринга зависит от тип файла
  let element: JSX.Element | null;

  switch (type) {
    case 'image':
      element = <img src={src} alt={file.name} />;
      break;
    case 'audio':
      element = <audio src={src} controls></audio>;
      break;
    case 'video':
      element = <video src={src}></video>;
      break;
    default:
      element = null;
      break;
  }

  return (
    <>
      <div className='container preview'>
        {element}
        <button
          type='button'
          className='btn close'
          onClick={() => setFile(null)}
        >
          <AiOutlineClose className='icon close' />
        </button>
      </div>
    </>
  );
}
