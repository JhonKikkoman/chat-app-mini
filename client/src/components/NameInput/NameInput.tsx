/** @format */

import { USER_KEY } from '../../constants';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import storage from '../../utils/storage';

interface onChangeT {
  target: {
    name: string;
    value: string;
  };
}

export const NameInput = () => {
  const [formData, setFormData] = useState({
    userName: '',
    // hardcode название идентиификатора команты
    roomId: 'main_room',
  });
  const [submitDis, setSubmitDis] = useState(true);
  // поля формы являются обязательными для заполнения
  useEffect(() => {
    const isSomeFieldEmpty = Object.values(formData).some((el) => !el.trim());
    setSubmitDis(isSomeFieldEmpty);
  }, [formData]);

  const onChange = ({ target: { name, value } }: onChangeT) => {
    setFormData({ ...formData, [name]: value });
  };

  // функция для отправки формы
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitDis) return;
    const userId = String(nanoid());
    // записываем данные пользователя в локальное хранилище
    storage.set(USER_KEY, {
      userId,
      userName: formData.userName,
      roomId: formData.roomId,
    });

    // перезагружаем приложение для перехода в команту
    window.location.reload();
  };
  return (
    <>
      <div className='container name-input'>
        <h2>Welcome</h2>
        <form onSubmit={onSubmit} className='form name-room'>
          <div>
            <label htmlFor='userName'>Enter your name</label>
            <input
              type='text'
              name='userName'
              id='userName'
              minLength={2}
              required
              value={formData.userName}
              onChange={onChange}
            />
          </div>
          <div className='visually-hidden'>
            <label htmlFor='roomId'>Enter room ID</label>
            <input
              type='text'
              name='roomId'
              id='roomId'
              minLength={4}
              required
              value={formData.roomId}
              onChange={onChange}
            />
          </div>
          <button type='submit' disabled={submitDis} className='btn chat'>
            Chat
          </button>
        </form>
      </div>
    </>
  );
};
