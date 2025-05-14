// Header Test Page
import RoomHeader from '../components/RoomHeader';
import ChatInput from '../components/ChatInput.tsx';
import RoomFooter from '../components/RoomFooter';
import Sorting from '../assets/Sorting.svg?react';

import { useEffect, useState } from 'react';
const TestPage = () => {
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

  const closeClick = () => {
    console.log('closeClick');
  };

  const viewClick = () => {
    console.log('viewClick');
  };

  return (
    <div className="w-full flex items-center justify-center py-20">
      <div
        className="w-3/5 flex flex-col items-center justify-center
      "
      >
        <RoomHeader title={'Hooks 파헤치기'} roomCode={1234} />
        <h1 className="text-4xl font-bold">Router Test Page</h1>
        <ChatInput onChange={setUserChat} sendChat={sendChat} />
        {/* 정렬 및 질문 수 */}
        <div className="w-full flex justify-between items-center text-[16px] text-[#737373]">
          <div
            className="rounded-2xl flex items-center relative
          px-14 py-4 font-medium border border-[#CFCFCF]"
          >
            <Sorting className="absolute left-7" />
            <span>Recent</span>
          </div>
          <span>{QCount} Questions</span>
        </div>
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
export default TestPage;
