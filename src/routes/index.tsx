import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '../Layout.tsx';
import HomePage from '../pages/index';
import Test from '../pages/test.tsx';
import RoomAdmin from '../pages/roomAdmin.tsx';
import RoomStudent from '../pages/roomStudent.tsx';

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
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
