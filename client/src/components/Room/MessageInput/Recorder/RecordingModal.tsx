/** @format */

import useStore from '../../../../hooks/useStore';
import React, { useRef, useState } from 'react';
import {
  BsFillPauseFill,
  BsFillPlayFill,
  BsFillStopFill,
} from 'react-icons/bs';
import {
  audioConstraints,
  constrainT,
  isRecordingStarted,
  pauseRecording,
  resumeRecording,
  startRecording,
  stopRecording,
  videoConstraints,
} from '../../../../utils/recording';

interface propT {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function RecordingModal({ setShowModal }: propT) {
  // извлекаем метод для обновления файла из хранилища
  const setFile = useStore(({ setFile }) => setFile);
  // локальное состояние для требований к потоку данных
  // по умолчания создаётся аудиозапись
  const [constrains, setConstraints] = useState<constrainT>(audioConstraints);
  // локальный индикатор начала записи
  const [recording, setRecording] = useState(false);
  // иммутабельная ссылка на элемент для выбора типа записи
  const selectBlockRef = useRef<HTMLDivElement | null>(null);
  // иммутабельная ссылка на элемент 'video'
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // функция для обновлений требований к потоку на основе типа запроса
  const onChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLSelectElement>) => {
    value === 'audio'
      ? setConstraints(audioConstraints)
      : setConstraints(videoConstraints);
  };

  // функция для приостановки/продолжения записи
  const pauseResume = () => {
    if (recording) {
      pauseRecording();
    } else {
      resumeRecording();
    }
  };

  // функция для начала записи
  const start = async () => {
    if (isRecordingStarted()) {
      return pauseResume();
    }
    // получаем поток
    const stream = await startRecording(constrains);

    // обновляем локальный индикатор для начала записи
    setRecording(true);

    // скрываем элемент для выбора типа записи
    if (selectBlockRef.current) {
      selectBlockRef.current.style.display = 'none';
    }

    // если создаётся видеозапись
    if (constrains.video && stream) {
      if (videoRef.current) {
        videoRef.current.style.display = 'block';
        // направляем поток в элемент 'video'
        videoRef.current.srcObject = stream;
      }
    }
  };

  // функция для завершения записи
  const stop = () => {
    // получаем файл
    const file = stopRecording();
    // обновляем локальный индикатор начала записи
    setRecording(false);
    setFile(file);
    setShowModal(false);
  };
  return (
    <>
      <div
        className='overlay'
        onClick={({ target }) => {
          const divTarget = target as HTMLDivElement;
          if (divTarget.className === 'overlay') {
            return setShowModal(false);
          }
        }}
      >
        <div className='modal'>
          <div ref={selectBlockRef}>
            <h2>Select type</h2>
            <select onChange={onChange} className='hello'>
              <option value='audio'>Audio</option>
              <option value='video'>Video</option>
            </select>
          </div>
          {/* два индикатора начала записи */}
          {isRecordingStarted() && (
            <p>{recording ? 'Recording...' : 'Pause'}</p>
          )}
          <video ref={videoRef} autoPlay muted />
          <div className='controls'>
            <button className='btn play' onClick={start}>
              {recording ? (
                <BsFillPauseFill className='icon' />
              ) : (
                <BsFillPlayFill className='icon' />
              )}
            </button>
            {isRecordingStarted() && (
              <button className='btn stop' onClick={stop}>
                <BsFillStopFill className='icon' />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
