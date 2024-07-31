/** @format */

import { Room } from '../../components/Room/Room';
import { NameInput } from '../../components/NameInput/NameInput';
import { USER_KEY } from '../../constants';
import storage from '../../utils/storage';

const Home = () => {
  const user = storage.get(USER_KEY);
  return user ? <Room /> : <NameInput />;
};

export default Home;
