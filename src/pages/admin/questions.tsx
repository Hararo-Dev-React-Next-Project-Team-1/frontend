import { useState } from 'react';
import RoomHeader from '../../components/RoomHeader';
import { useSearchParams } from 'react-router-dom';
import { downloadFile } from '../../apis/room.ts';
import { AdminQuestion } from '../../components/AdminQuestion.tsx';

export type Room = {
  id: string | null;
  code: string;
  title: string;
  created_at: string;
  file_name: string;
  room_title: string;
};

const AdminQuestions = () => {
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
      is_selected: false,
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
  const [roomInfo, setRoomInfo] = useState<Room>({
    id: '-1',
    code: '-1',
    title: '강의 제목',
    created_at: '',
    file_name: '',
    room_title: '',
  });
  const [searchParams] = useSearchParams();

  const roomId = searchParams.get('room-id');
  const enterCode = searchParams.get('enter-code');

  const clickDown = async () => {
    if (roomId) {
      await downloadFile(roomId, roomInfo.file_name);
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-20 gap-12">
      <div
        className="w-4/5 min-h-[600px] py-8 px-8 flex flex-col items-center
    shadow-[0px_3px_10px_rgba(0,0,0,0.25)] rounded-2xl gap-8"
      >
        <RoomHeader
          title={roomInfo.title}
          dateStr={roomInfo.created_at}
          roomCode={enterCode}
        />
        {/* 정렬 및 질문 수 */}
        <div className="w-full flex justify-center items-center ">
          <span className="font-semibold  text-[#737373] text-xl">
            과거 방 조회
          </span>
        </div>
        {/* 질문 목록 */}
        <div className="w-full flex flex-col items-center gap-6">
          {dumpData?.map((question) => (
            // 질문 조회 API 연동 후 isEditable 처리
            <AdminQuestion
              roomTitle={''}
              key={question.question_id}
              {...question}
              isAdmin={false}
              isEditable={true}
              complete={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default AdminQuestions;
