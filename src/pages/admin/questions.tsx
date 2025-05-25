import { useEffect, useState } from 'react';
import RoomHeader from '../../components/RoomHeader';
import { useParams, useSearchParams } from 'react-router-dom';
import { downloadFile } from '../../apis/room.ts';
import { AdminQuestion } from '../../components/AdminQuestion.tsx';

export type Room = {
  room_id: string;
  code: string;
  title: string;
  created_at: string;
  file_name: string;
  room_title: string;
};

type Question = {
  question_id: number;
  text: string;
  created_at: string;
  likes: number;
};

const AdminQuestions = () => {
  const [roomInfo, setRoomInfo] = useState<Room>({
    room_id: '-1',
    code: '-1',
    title: '강의 제목',
    created_at: '',
    file_name: '',
    room_title: '',
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchParams] = useSearchParams();

  const { roomId } = useParams();
  const enterCode = searchParams.get('code');

  useEffect(() => {
    const fetchRoomData = async () => {
      if (!roomId) return;

      try {
        // 1. 전체 방 목록 가져옴
        const allRoomsRes = await fetch('/api/admin/rooms');
        const allRoomsData = await allRoomsRes.json();

        // 2. 해당 roomId에 해당하는 방 정보 추출
        const matchedRoom = allRoomsData.rooms.find(
          (room: Room) => room.room_id === roomId
        );

        if (matchedRoom) setRoomInfo(matchedRoom);

        // 3. 질문 목록 fetch
        const questionsRes = await fetch(`/api/admin/rooms/${roomId}`);
        const questionsData = await questionsRes.json();
        setQuestions(questionsData.questions);
      } catch (err) {
        console.error('❌ 방 정보 또는 질문 목록 가져오기 실패:', err);
      }
    };

    fetchRoomData();
  }, [roomId]);

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
          {questions.map((q) => (
            roomId && (
              <AdminQuestion
                room_id={roomId}
                roomTitle={roomInfo.title}
                creator_id={''}
                question_id={q.question_id.toString()}
                text={q.text}
                created_at={q.created_at}
                likes={q.likes.toString()}
                isAdmin={true}
                isEditable={true}
                complete={true}
                key={q.question_id}
              />
            )
          ))}

        </div>
      </div>
    </div>
  );
};
export default AdminQuestions;
