import { useEffect, useState } from 'react';
import RoomHeader from '../../components/RoomHeader';
import { useParams, useSearchParams } from 'react-router-dom';
import { downloadFile } from '../../apis/room.ts';
import { getAllRooms, getAdminRoomDetail } from '../../apis/admin';
import { AdminQuestion } from '../../components/AdminQuestion.tsx';
import type { Room, Question } from '../../types/index.ts';

const AdminQuestions = () => {
  const [roomInfo, setRoomInfo] = useState<Room>({
    room_id: '-1',
    code: '-1',
    title: '강의 제목',
    created_at: '',
    file_name: '',
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchParams] = useSearchParams();

  const { roomId } = useParams();
  const enterCode = searchParams.get('code');

  useEffect(() => {
    const fetchRoomData = async () => {
      if (!roomId) return;

      try {
        // 모든 방 조회
        const allRooms = await getAllRooms();
        // path 파라미터로 전달된 room id와 일치하는 방 정보 조회 (title 가져오기 위함)
        const matchedRoom = allRooms.find(room => room.room_id === roomId);
        if (matchedRoom) setRoomInfo(matchedRoom);

        // 특정 room id에 일치하는 방의 모든 질문 조회
        const questionList = await getAdminRoomDetail(roomId);
        setQuestions(questionList);
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
                likes={q.likes}
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
