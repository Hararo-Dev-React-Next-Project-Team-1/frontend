// Header Test Page
import RoomHeader from '../components/RoomHeader';
const TestPage = () => {
  return (
    <div className="w-full flex items-center justify-center py-20 border-2 border-red-700">
      <div
        className="w-3/5 flex items-center justify-center
      border-2 border-[var(--color-gray)]"
      >
        <RoomHeader title={'Hooks 파헤치기'} roomCode={1234} />
      </div>
    </div>
  );
};
export default TestPage;
