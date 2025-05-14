import RedDot from '../assets/RedDot.tsx';
type Props = {
  isLive: boolean;
  liveClick: () => void;
  closeClick: () => void;
  viewClick: () => void;
};
const RoomFooter = ({ isLive, liveClick, closeClick, viewClick }: Props) => {
  return (
    <div
      className="w-full py-8 px-8 flex items-center  justify-between
    shadow-[0px_3px_10px_rgba(0,0,0,0.25)] rounded-2xl gap-8"
    >
      <button
        className="text-center px-8 py-3 text-[16px] font-semibold
    text-white rounded-md bg-[var(--color-primary)] cursor-pointer"
        onClick={closeClick}
      >
        Q&A 닫기
      </button>
      <div
        className={`flex gap-3 justify-center items-center cursor-pointer
      ${isLive ? 'text-[#FF0000]' : 'text-[var(--color-gray)] '}`}
        onClick={liveClick}
      >
        <RedDot />
        <span className="text-black text-xl font-semibold">Live</span>
      </div>
      <span
        className="cursor-pointer text-[#737373] text-[16px] "
        onClick={viewClick}
      >
        view as participant
      </span>
    </div>
  );
};

export default RoomFooter;
