import { useEffect, useState } from 'react';
import RoomHeader from '../components/RoomHeader.tsx';
import Sorting from '../assets/Sorting.svg?react';
import ChatInput from '../components/ChatInput.tsx';
import Link from '../assets/Link.svg?react';
import { Question } from '../components/Question.tsx';
import { postQuestion } from '../apis/questions.ts';
import { useSearchParams } from 'react-router-dom';
import { downloadFile, getRoomInfo } from '../apis/room.ts';

type Room = {
  id: string | null;
  code: string;
  title: string;
  created_at: string;
  file_name: string;
};

const RoomStudent = () => {
  const dumpData = [
    {
      question_id: 1,
      text: '프론트엔드와 백엔드의 가장 큰 차이점은 무엇인가요?',
      created_at: '2025-05-16T09:00:00Z',
      is_selected: false,
      likes: 12,
    },
    {
      question_id: 2,
      text: 'React에서 상태 관리를 어떤 방식으로 하나요?',
      created_at: '2025-05-16T09:15:00Z',
      is_selected: true,
      likes: 25,
    },
    {
      question_id: 3,
      text: 'CORS 에러는 왜 발생하고 어떻게 해결하나요?',
      created_at: '2025-05-16T09:30:00Z',
      is_selected: false,
      likes: 8,
    },
    {
      question_id: 4,
      text: 'TypeScript의 유틸리티 타입 중 가장 자주 쓰는 것은?',
      created_at: '2025-05-16T09:45:00Z',
      is_selected: false,
      likes: 17,
    },
  ];
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('room-id');
  const enterCode = searchParams.get('enter-code');

  const [userChat, setUserChat] = useState('');
  const [isLive, setLive] = useState(false);
  const [roomInfo, setRoomInfo] = useState<Room>({
    id: '-1',
    code: '-1',
    title: '강의 제목',
    created_at: '',
    file_name: '',
  });

  // useEffect(() => {
  //   console.log('roomId : ', roomId);
  // }, [roomId]);
  //
  // useEffect(() => {
  //   console.log('enterCode : ', enterCode);
  // }, [enterCode]);
  useEffect(() => {
    const fetchRoomInfo = async () => {
      if (enterCode) {
        const res = await getRoomInfo(enterCode);
        if (res) {
          setRoomInfo((prev) => ({
            ...prev,
            id: roomId,
            code: enterCode,
            title: res.title,
            created_at: res.created_at,
            file_name: res.file_name,
          }));
        }
      }
    };

    fetchRoomInfo();
  }, [enterCode, roomId]);

  const sendChat = async () => {
    if (userChat.trim().length == 0) return;

    try {
      const res = await postQuestion(Number(roomId), userChat);
      console.log(res);

      // socket.emit('question:posted')

      setUserChat('');
    } catch (error) {
      console.error('질문 전송 실패:', error);
    }
  };

  const clickDown = async () => {
    if (roomId) {
      await downloadFile(roomId, roomInfo.file_name);
    }
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
      <div className="w-4/5 flex flex-col items-center gap-20">
        <RoomHeader
          title={'Hooks 파헤치기'}
          dateStr={'2025-05-16 14:27:09'}
          roomCode={enterCode}
        />
        <ChatInput onChange={setUserChat} sendChat={sendChat} />
        <div className="w-full flex flex-col items-center gap-6">
          <div className="w-full flex justify-between items-center text-[16px] text-[#737373]">
            <div className="flex items-center gap-6">
              <div
                className="rounded-xl flex items-center relative
              px-14 py-3 font-medium border border-[#CFCFCF] cursor-pointer"
              >
                <Sorting className="absolute left-7" />
                <span>Recent</span>
              </div>
              <div
                className="rounded-xl flex items-center relative text-[#289983]
              px-15 py-3 font-medium border border-[var(--color-primary)] cursor-pointer"
                onClick={() => clickDown()}
              >
                <Link className="absolute left-7" />
                <span>자료 다운로드</span>
              </div>
            </div>
            <span className="font-semibold">{dumpData.length} Questions</span>
          </div>
          <div className="w-full flex flex-col items-center gap-6">
            {dumpData?.map((question) => (
              <Question
                key={question.question_id}
                {...question}
                isAdmin={false}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomStudent;
