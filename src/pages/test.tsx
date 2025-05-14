// Header Test Page
import RoomHeader from '../components/RoomHeader';
import ChatInput from '../components/ChatInput.tsx';
import Sorting from '../assets/Sorting.svg?react';

import { useEffect, useState } from 'react';
const TestPage = () => {
  const [userChat, setUserChat] = useState('');
  const [QCount, setQCount] = useState(2);

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
  return (
    <div className="w-full flex items-center justify-center py-20">
      <div
        className="w-3/5 flex flex-col items-center justify-center
      "
      >
        <RoomHeader title={'Hooks 파헤치기'} roomCode={1234} />
        <h1 className="text-4xl font-bold">Router Test Page</h1>
        <ChatInput onChange={setUserChat} sendChat={sendChat} />
        <div className="w-full flex justify-between items-center text-[16px] text-[#737373]">
          <div
            className="rounded-2xl flex items-center relative
          px-16 py-4   font-medium border border-[#CFCFCF]"
          >
            <Sorting className="absolute left-7" />
            <span>Recent</span>
          </div>
          <span>{QCount} Questions</span>
        </div>
      </div>
    </div>
  );
};
export default TestPage;
