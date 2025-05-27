import ReactLogo from '../assets/logo.jpg';

const Header = () => {
  return (
    <div
      className="
        fixed top-0 w-screen h-20 
        shadow-[0_2px_4px_0_rgba(128,128,128,0.3)] 
        bg-white z-50
        flex items-center justify-center 
        px-6
        relative
      "
    >
      {/* 왼쪽에 고정될 로고 */}
      <img
        src={ReactLogo}
        alt="logo"
        className="absolute left-6 h-12 cursor-pointer"
      />

      {/* 중앙 정렬될 텍스트 */}
      <div className="text-[2rem] font-semibold">👋 Clido</div>
    </div>
  );
};
export default Header;
