import RoomHeader from '../../components/RoomHeader.tsx';
import Sorting from '../../assets/Sorting.svg?react';
import { AdminQuestion } from '../../components/AdminQuestion.tsx';
type Room = {
  id: string | null;
  code: string;
  title: string;
  created_at: string;
  file_name: string;
  room_title: string;
};
const AdminRooms = () => {
  const dumpData: Room[] = [
    {
      id: '1',
      code: '1234',
      title: 'title 1',
      created_at: '2025-05-16T09:45:00Z',
      file_name: '파일 이름 1',
      room_title: 'Hooks 파헤치기',
    },
    {
      id: '2',
      code: '5678',
      title: 'title 2',
      created_at: '2025-05-16T09:45:00Z',
      room_title: 'Hooks 파헤치기',
      file_name: '파일 이름 2',
    },
    {
      id: '3',
      code: '112233',
      title: 'title 3',
      created_at: '2025-05-16T09:45:00Z',
      file_name: '파일 이름 3',
      room_title: 'Hooks 파헤치기',
    },
    {
      id: '4',
      code: '445566',
      title: 'title 4',
      created_at: '2025-05-16T09:45:00Z',
      file_name: '파일 이름 4',
      room_title: 'Hooks 파헤치기',
    },
    {
      id: '5',
      code: '778899',
      title: 'title 5',
      created_at: '2025-05-16T09:45:00Z',
      file_name: '파일 이름 5',
      room_title: 'Hooks 파헤치기',
    },
  ];
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
          <span className="font-semibold">{dumpData.length} Rooms</span>
        </div>
        <div className="w-full grid grid-cols-2 gap-6">
          {dumpData?.map((question) => (
            <AdminQuestion
              question_id={
                isNaN(parseInt(question.id || '0'))
                  ? 0
                  : parseInt(question.code)
              }
              text={''}
              likes={0}
              key={question.id}
              {...question}
              isAdmin={true}
              isEditable={true}
              complete={true}
              roomTitle={question.room_title}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default AdminRooms;
