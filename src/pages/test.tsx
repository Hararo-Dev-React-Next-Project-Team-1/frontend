// Header Test Page
import RoomHeader from '../components/RoomHeader';
const TestPage = () => {
  return (
    <div className="w-full flex items-center justify-center py-20">
      <div
        className="w-3/5 flex flex-col items-center justify-center
      "
      >
        <RoomHeader title={'Hooks 파헤치기'} roomCode={1234} />
        <h1 className="text-4xl font-bold">Router Test Page</h1>
      </div>
    </div>
  );
};
export default TestPage;
