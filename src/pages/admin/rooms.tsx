import React, { useEffect, useState } from 'react';
import RoomHeader from '../../components/RoomHeader.tsx';
import Sorting from '../../assets/Sorting.svg?react';
import { AdminQuestion } from '../../components/AdminQuestion.tsx';
import { useNavigate } from 'react-router-dom';
import { getAllRooms} from '../../apis/admin';

type Room = {
  room_id: string;
  code: string;
  title: string;
  created_at: string;
  file_name: string;
};
const AdminRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getAllRooms();
        setRooms(data);
      } catch (err) {
        console.error('❌ 방 목록 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="w-full flex flex-col items-center py-20 gap-12">
      <div
        className="w-4/5 min-h-[600px] py-8 px-8 flex flex-col items-center
  shadow-[0px_3px_10px_rgba(0,0,0,0.25)] rounded-2xl gap-8"
      >
        <RoomHeader title={'전체 방 조회'} dateStr={''} roomCode={''} />
        {/* 정렬 및 질문 수 */}
        <div className="w-full flex justify-between items-center text-[#737373] relative">
          <div className="flex items-center gap-6">
            <div
              className="rounded-xl flex items-center relative
              px-14 py-3 font-medium border border-[#CFCFCF] cursor-pointer"
            >
              <Sorting className="absolute left-7" />
              <span>Recent</span>
            </div>
          </div>
          <span className="font-semibold text-xl absolute left-1/2 -translate-x-1/2">
            과거 방 조회
          </span>
          <span className="font-semibold">{rooms.length} Rooms</span>
        </div>
        <div className="w-full grid grid-cols-2 gap-6">
          {rooms.map((room) => (
            <AdminQuestion
              key={room.room_id}
              // <AdminQuestion>의 QuestionType 형식을 맞추기 위한 임의값
              question_id={''}
              creator_id={''}
              text={''}
              likes={0}

              {...room}
              isAdmin={true}
              isEditable={true}
              complete={true}
              roomTitle={room.title}
              onClick={() => navigate(`/admin/rooms/${room.room_id}?code=${room.code}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default AdminRooms;
