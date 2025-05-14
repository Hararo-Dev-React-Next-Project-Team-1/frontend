import { useState } from 'react';
import MainCard from '../components/MainCard';
import EnterIcon from '../assets/EnterIcon.tsx';
import AddIcon from '../assets/AddIcon.tsx';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const HomePage = () => {
  const [selected, setSelected] = useState<boolean>(true);

  const toggleTest = () => {
    setSelected(!selected);
  };

  const makeClick = () => {
    setSelected(true);
  };
  const enterClick = () => {
    setSelected(false);
  };

  return (
    <div className="w-full flex items-center justify-center py-20">
      <div className="w-3/5 flex flex-col gap-10 ">
        <button onClick={() => toggleTest()}>Toggle Test</button>
        <div className="flex gap-10 ">
          <MainCard selected={selected} content="방 만들기" onClick={makeClick}>
            <AddIcon />
          </MainCard>
          <MainCard
            selected={!selected}
            content="참여하기"
            onClick={enterClick}
          >
            <EnterIcon />
          </MainCard>
        </div>
        <div
          className={`flex justify-center items-center rounded-xl
          gap-6 p-8 border-2 border-[var(--color-gray)]
          ${selected ? 'flex-col' : null}
          `}
        >
          {selected ? (
            <>
              <CustomInput
                inputType="text"
                label="방 이름"
                placeholder="방 이름"
              />
              <CustomInput
                inputType="file"
                label="파일 이름"
                placeholder="파일 이름"
              />
              <CustomButton text="방 만들기" onClick={toggleTest} />
            </>
          ) : (
            <>
              <CustomInput
                inputType="text"
                label="입장 코드"
                placeholder="입장 코드를 입력해주세요."
              />
              <CustomButton text="입장하기" onClick={toggleTest} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
