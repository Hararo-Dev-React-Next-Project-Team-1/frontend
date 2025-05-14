import MainCard from '../components/MainCard';
import EnterIcon from '../assets/EnterIcon.tsx';
import AddIcon from '../assets/AddIcon.tsx';

import { useState } from 'react';

const HomePage = () => {
  const [mode, setMode] = useState<boolean>(true);

  const toggleTest = () => {
    console.log('mode', mode);
    setMode(!mode);
  };

  return (
    <div className="w-full flex items-center justify-center pt-20 border-red-500 border-2">
      <div className="w-3/5 flex flex-col gap-10 border-yellow-500 border-2">
        <button onClick={() => toggleTest()}>Toggle Test</button>
        <div className="flex gap-10">
          <MainCard selected={mode} content="방 만들기">
            <AddIcon />
          </MainCard>
          <MainCard selected={!mode} content="참여하기">
            <EnterIcon />
          </MainCard>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
