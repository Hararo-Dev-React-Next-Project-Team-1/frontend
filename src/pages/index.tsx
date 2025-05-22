import { useEffect, useState } from 'react';
import MainCard from '../components/MainCard';
import EnterIcon from '../assets/EnterIcon.tsx';
import AddIcon from '../assets/AddIcon.tsx';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { createRoom, enterRoom } from '../apis/room.ts';
import { useNavigate } from 'react-router-dom';
import { Cookies } from 'react-cookie';

const HomePage = () => {
  const [selected, setSelected] = useState<boolean>(true);
  const [roomTitle, setRoomTitle] = useState<string>('');
  const [titleError, setTitleError] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string | File>('');
  const [fileError, setFileError] = useState<boolean>(false);
  const [roomCode, setRoomCode] = useState<string | File>('');
  const [codeError, setCodeError] = useState<boolean>(false);
  // 중복 요청 방지
  const [createDisabled, setCreateDisabled] = useState<boolean>(false);
  const [enterDisabled, setEnterDisabled] = useState<boolean>(false);
  const navigate = useNavigate();
  const cookies = new Cookies();

  // 🔥 Socket.IO 서버 API 라우트 호출 → 서버 초기화
  useEffect(() => {
    // socket.io 서버 초기화를 트리거함
    fetch('/api/socket_io')
      .then(() => {
        console.log("✅ 소켓 서버 초기화 완료됨 (클라이언트 측)");
      })
      .catch((err) => {
        console.error("❌ 소켓 서버 초기화 실패:", err);
      });
  }, []);

  const makeClick = () => {
    setSelected(true);
  };
  const enterClick = () => {
    setSelected(false);
  };
  useEffect(() => {
    console.log('fileError : ', fileError);
  }, [fileError]);

  const makeBtn = async () => {
    if (roomTitle.toString().length === 0 || !fileName) {
      if (roomTitle.toString().length === 0) {
        setTitleError(true);
      }
      if (!fileName) {
        setFileError(true);
      }
    } else {
      try {
        const res = await createRoom(roomTitle, fileName);
        setCreateDisabled(true);
        // navigate(`/room-admin?room-id=${res.room_id}&enter-code=${res.code}`);
      } catch (e) {
        console.error(e);
        setCreateDisabled(false);
      }
    }
  };

  const enterBtn = async () => {
    if (
      roomCode.toString().length !== 4 ||
      Number.isNaN(parseInt(roomCode.toString()))
    ) {
      setCodeError(true);
    } else {
      // Todo : 요청 페이지 이동 처리
      try {
        const res = await enterRoom(roomCode.toString());
        setEnterDisabled(true);
        cookies.set('client_visitor_id', res.visitor_id);
        navigate(`/room-student?room-id=${res.room_id}&enter-code=${res.code}`);
      } catch (e) {
        console.error(e);
        setEnterDisabled(false);
      }
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
                onChange={(value) => {
                  if (typeof value === 'string') {
                    setRoomTitle(value);
                  }
                }}
                errorContent={'방 제목을 입력해주세요.'}
                errorState={titleError}
                changeState={setTitleError}
              />
              <CustomInput
                key="fileName"
                inputType="file"
                label="* 파일 이름"
                placeholder="파일 이름"
                onChange={(file) => {
                  if (file instanceof File) {
                    setFileName(file);
                  }
                }}
                errorContent={'강의 자료를 업로드해주세요.'}
                errorState={fileError}
                changeState={setFileError}
              />
              <CustomButton
                text="방 만들기"
                onClick={makeBtn}
                disabled={createDisabled}
              />
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
              <CustomButton
                text="입장하기"
                onClick={enterBtn}
                disabled={enterDisabled}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
