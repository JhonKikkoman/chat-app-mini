/** @format */

import { customFileT } from '../hooks/useStore';

const { SERVER_URI } = require('../constants');

interface uploadT {
  file: customFileT;
  roomId: string;
}

const upload = async ({ file, roomId }: uploadT) => {
  try {
    const body = new FormData();
    body.append('file', file);
    const response = await fetch(`${SERVER_URI}/upload`, {
      method: 'POST',
      body,
      headers: {
        'x-room-id': roomId,
      },
    });
    if (!response.ok) {
      throw response;
    }
    const pathToFile = await response.json();
    return pathToFile;
  } catch (e) {
    throw e;
  }
};

const fileApi = { upload };
export default fileApi;
