import { Outlet } from 'react-router-dom';
import Header from './components/Header';

const Layout = () => {
  return (
    <>
      <Header />
      <div className="mt-20">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
