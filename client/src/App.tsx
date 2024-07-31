/** @format */

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import './App.scss';
import Home from './pages/Home/Home';

const router = createBrowserRouter(
  createRoutesFromElements(<Route path='/' element={<Home />} />)
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
