import { useState } from 'react';
import MainCard from '../components/MainCard';
import EnterIcon from '../assets/EnterIcon.tsx';
import AddIcon from '../assets/AddIcon.tsx';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { createRoom, testAPI } from '../apis/room.ts';

const HomePage = () => {
  const [selected, setSelected] = useState<boolean>(true);
  const [roomTitle, setRoomTitle] = useState<string>('');
  const [titleError, setTitleError] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string | File>('');
  const [, setFileError] = useState<boolean>(false);
  const [roomCode, setRoomCode] = useState<string | File>('');
  const [codeError, setCodeError] = useState<boolean>(false);

  const makeClick = () => {
    setSelected(true);
  };
  const enterClick = () => {
    setSelected(false);
  };

  const makeBtn = async () => {
    if (roomTitle.toString().length === 0) {
      setTitleError(true);
    } else {
      // Todo : 요청 페이지 이동 처리
      const res = await createRoom(roomTitle, fileName);
      console.log(res);
    }
  };

  const enterBtn = () => {
    if (
      roomCode.toString().length !== 4 ||
      Number.isNaN(parseInt(roomCode.toString()))
    ) {
      setCodeError(true);
    } else {
      // Todo : 요청 페이지 이동 처리
      alert('성공');
    }
  };

  return (
    <div className="w-full flex items-center justify-center py-20">
      <div className="w-3/5 flex flex-col gap-10 ">
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
          gap-4 p-8 border-2 border-[var(--color-gray)]
          ${selected ? 'flex-col' : 'items-start'}
          `}
        >
          {selected ? (
            <>
              <CustomInput
                key="roomTitle"
                inputType="text"
                label="* 방 이름"
                placeholder="방 이름"
                onChange={setRoomTitle}
                errorContent={'방 제목을 입력해주세요.'}
                errorState={titleError}
                changeState={setTitleError}
              />
              <CustomInput
                key="fileName"
                inputType="file"
                label="파일 이름"
                placeholder="파일 이름"
                onChange={(file) => {
                  if (file instanceof File) {
                    setFileName(file);
                  }
                }}
                errorContent=""
                errorState={false}
                changeState={setFileError}
              />
              <CustomButton text="방 만들기" onClick={makeBtn} />
            </>
          ) : (
            <>
              <CustomInput
                key="roomCode"
                inputType="text"
                label="입장 코드"
                placeholder="입장 코드를 입력해주세요."
                onChange={setRoomCode}
                errorContent="입장 코드를 정확히 입력해주세요. (숫자 4자리)"
                errorState={codeError}
                changeState={setCodeError}
              />
              <CustomButton text="입장하기" onClick={enterBtn} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
