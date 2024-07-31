/** @format */

export interface constrainT {
  audio: {
    echoCancellation: boolean;
    autoGainControl: boolean;
    noiseSuppression: boolean;
  };
  video?: {
    width: number;
    height: number;
    frameRate: number;
  };
  type?: string;
}

interface onDataT {
  data: {
    size: number;
    type: string;
  };
}

// https://www.w3.org/TR/mediastream-recording/
// переменные для рекордера, частей данных и требований к потоку данных
let mediaRecorder: any = null;
let mediaChunks: any = [];
let mediaConstraints: any = null;

// https://w3c.github.io/mediacapture-main/#constrainable-interface
// требования к аудиопотоку
export const audioConstraints: constrainT = {
  audio: {
    echoCancellation: true,
    autoGainControl: true,
    noiseSuppression: true,
  },
};

// требования к медиапотоку (aудио + видео)
export const videoConstraints: constrainT = {
  ...audioConstraints,
  video: {
    width: 1920,
    height: 1080,
    frameRate: 60.0,
  },
};

export const isRecordingStarted = () => !!mediaRecorder;

export const pauseRecording = () => {
  mediaRecorder.pause();
};

export const resumeRecording = () => {
  mediaRecorder.resume();
};

// метод для начала записи
// принимает требования к потоку

export const startRecording = async (constraints: constrainT) => {
  mediaConstraints = constraints;

  try {
    // https://w3c.github.io/mediacapture-main/#dom-mediadevices-getusermedia
    // получаем поток с устройств пользователя
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    const type = constraints.type ? 'video' : 'audio';

    // https://www.w3.org/TR/mediastream-recording/#mediarecorder-constructor
    // создаем экземпляр рекордера
    mediaRecorder = new MediaRecorder(stream, { mimeType: `${type}/webm` });

    // обрабатываем запись данных
    mediaRecorder.ondataavailable = ({ data }: onDataT) => {
      mediaChunks.push(data);
    };
    // запускаем запись
    mediaRecorder.start(250);
    // возвращаем поток
    return stream;
  } catch (e) {
    console.error(e);
  }
};

// метод для завершения записи
export const stopRecording = () => {
  mediaRecorder.stop();
  // остановить треки из потока
  mediaRecorder.stream.getTracks().forEach((t: any) => t.stop());
  const type = mediaConstraints.video ? 'video' : 'audio';
  // https://w3c.github.io/FileAPI/#file-constructor
  // создаем новый файл
  const file = new File(mediaChunks, 'my_record.webm', {
    type: `${type}/webm`,
  });
  // без этого запись можно будет создать только один раз
  mediaRecorder.ondataavailable = null;
  // обнуляем рекордер
  mediaRecorder = null;
  // очищаем массив с данными
  mediaChunks = [];

  return file;
};
