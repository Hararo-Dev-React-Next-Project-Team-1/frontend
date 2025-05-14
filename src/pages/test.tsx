// Header Test Page
import RoomHeader from '../components/RoomHeader';
import ChatInput from '../components/ChatInput.tsx';
import { useEffect, useState } from 'react';
const TestPage = () => {
  const [userChat, setUserChat] = useState('');

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
      </div>
    </div>
  );
};
export default TestPage;
