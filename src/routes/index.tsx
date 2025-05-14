import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '../Layout.tsx';
import HomePage from '../pages/index';
import Test from '../pages/test.tsx';

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
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
