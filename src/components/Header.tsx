import ReactLogo from '../assets/logo.jpg';

const Header = () => {
  return (
    <div className='fixed top-0 h-20 w-screen py-4 px-6 shadow-[0_2px_4px_0_rgba(128,128,128,0.3)] bg-white z-50'>
      <img src={ReactLogo} alt='logo' className='h-full cursor-pointer' />
    </div>
  );
};
export default Header;
