/** @format */

import { userT } from '../hooks/useChat';

interface storageT {
  get: (key: string) => userT | null;
  set: (key: string, value: userT | null) => void;
}

const storage: storageT = {
  get: (key) =>
    window.localStorage.getItem(key)
      ? JSON.parse(window.localStorage.getItem(key) as string)
      : null,
  set: (key, value) => window.localStorage.setItem(key, JSON.stringify(value)),
};

export default storage;
