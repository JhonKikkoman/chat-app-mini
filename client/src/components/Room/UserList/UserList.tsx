/** @format */

import { AiOutlineUser } from 'react-icons/ai';
import { userT } from '../../../hooks/useChat';

export default function UserList({ users }: { users: userT[] }) {
  return (
    <>
      <div className='container user'>
        <h2>Users</h2>
        <ul className='list user'>
          {users.map(({ userId, userName }) => (
            <li key={`${userId}_${userName}`} className='item user'>
              <AiOutlineUser className='icon user' />
              {userName}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
