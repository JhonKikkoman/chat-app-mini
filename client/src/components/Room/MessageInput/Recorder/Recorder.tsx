/** @format */

import useStore from '../../../../hooks/useStore';
import { useState } from 'react';
import { RiRecordCircleLine } from 'react-icons/ri';
import RecordingModal from './RecordingModal';

export default function Recorder() {
  // извлекаем индикатор отображения превью файла их хранилища
  const showPreview = useStore(({ showPreview }) => showPreview);
  // локальное состояние для индикатора
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <div className='container recorder'>
        <button
          type='button'
          className='btn'
          onClick={() => setShowModal(true)}
          // блокируем кнопку при отображении превью файла
          disabled={showPreview}
        >
          <RiRecordCircleLine className='icon' />
        </button>
        {showModal && <RecordingModal setShowModal={setShowModal} />}
      </div>
    </>
  );
}
