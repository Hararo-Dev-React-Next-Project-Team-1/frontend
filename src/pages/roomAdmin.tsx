import { useEffect, useState } from 'react';
import RoomHeader from '../components/RoomHeader';
import Sorting from '../assets/Sorting.svg?react';
import RoomFooter from '../components/RoomFooter';

const RoomAdmin = () => {
  const [userChat, setUserChat] = useState('');

  const [QCount, setQCount] = useState(2);
  const [isLive, setLive] = useState(false);

  useEffect(() => {
    console.log('userChat : ', userChat);
  }, [userChat]);

  const sendChat = () => {
    if (userChat.length == 0) {
      return;
    }
    // Todo : 채팅 추가 기능
    console.log(userChat);
    setUserChat('');
  };

  // Live 버튼 클릭
  const liveClick = () => {
    // Todo : 라이브 재생 기능
    setLive(true);
  };
  // 닫기 버튼 클릭
  const closeClick = () => {
    console.log('closeClick');
  };
  // view as participant 버튼 클릭
  const viewClick = () => {
    console.log('viewClick');
  };

  return (
    <div className="w-full flex flex-col items-center py-20 gap-12">
      <div
        className="w-4/5 min-h-[600px] py-8 px-8 flex flex-col items-center
    shadow-[0px_3px_10px_rgba(0,0,0,0.25)] rounded-2xl gap-8"
      >
        <RoomHeader title={'Hooks 파헤치기'} roomCode={1234} />
        {/* 정렬 및 질문 수 */}
        <div className="w-full flex justify-between items-center text-[16px] text-[#737373]">
          <div
            className="rounded-xl flex items-center relative
          px-12 py-3 font-medium border border-[#CFCFCF] cursor-pointer"
          >
            <Sorting className="absolute left-7" />
            <span>Recent</span>
          </div>
          <span className="font-semibold">{QCount} Questions</span>
        </div>
      </div>
      <div className="w-4/5">
        {/* 하단 버튼 모음 div */}
        <RoomFooter
          isLive={isLive}
          liveClick={liveClick}
          closeClick={closeClick}
          viewClick={viewClick}
        />
      </div>
    </div>
  );
};
export default RoomAdmin;
