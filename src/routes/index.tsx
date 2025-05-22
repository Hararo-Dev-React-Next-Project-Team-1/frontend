import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '../Layout.tsx';
import HomePage from '../pages/index';
import Test from '../pages/test.tsx';
import RoomAdmin from '../pages/roomAdmin.tsx';
import RoomStudent from '../pages/roomStudent.tsx';

import AdminRooms from '../pages/admin/rooms.tsx';
import AdminQuestions from '../pages/admin/questions.tsx';
import SocketTest from '../pages/socketTest.tsx';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <HomePage />,
      },
      {
        path: '/test',
        element: <Test />,
      },
      {
        path: '/room-admin',
        element: <RoomAdmin />,
      },
      {
        path: '/room-student',
        element: <RoomStudent />,
      },
      {

        path: '/admin/rooms',
        element: <AdminRooms />,
      },
      {
        path: '/admin/questions/*',
        element: <AdminQuestions />,
      },
      {
        path: '/socketTest',
        element: <SocketTest />,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
