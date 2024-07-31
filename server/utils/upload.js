/** @format */

import { existsSync, mkdirSync } from 'fs';
import multer from 'multer';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const _dirname = dirname(fileURLToPath(import.meta.url));

const upload = multer({
  storage: multer.diskStorage({
    // директория для записи файлов
    destination: async (req, _, clbk) => {
      // извлекаем id команды из headers HTTP-заголовка
      const roomId = req.headers['x-room-id'];
      // файлы хранятся по комнатам
      // название директории - идентификатор команты
      const dirPath = join(_dirname, '../files', roomId);

      // создаём директорию при отсутствии
      if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true });
      }
      clbk(null, dirPath);
    },
    filename: (_, file, clbk) => {
      // названия файлов могут быть одиныковыми
      // добавляем к названия время  и дефис
      const fileName = `${Date.now()}-${file.originalname}`;
      clbk(null, fileName);
    },
  }),
});

export default upload;
