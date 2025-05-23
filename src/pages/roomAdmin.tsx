import { useEffect, useRef, useState } from 'react';
import RoomHeader from '../components/RoomHeader';
import Sorting from '../assets/Sorting.svg?react';
import RoomFooter from '../components/RoomFooter';
import Link from '../assets/Link.svg?react';
import { Question } from '../components/Question';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { downloadFile, exitRoom, getRoomInfo } from '../apis/room.ts';
import {
  answerQuestion,
  getQuestionlist,
  type QuestionType,
} from '../apis/questions.ts';
import socket from '../lib/socket.ts'; // socket.ts 유지

export type Room = {
  id: string | null;
  code: string;
  title: string;
  created_at: string;
  file_name: string;
};

const RoomAdmin = () => {
  const dumpData = [
    {
      question_id: 1,
      text: '프론트엔드와 백엔드의 가장 큰 차이점은 무엇인가요?',
      created_at: '2025-05-16T09:00:00Z',
      is_selected: false,
      likes: 12,
    },
    {
      question_id: 2,
      text: 'React에서 상태 관리를 어떤 방식으로 하나요?',
      created_at: '2025-05-16T09:15:00Z',
      is_selected: true,
      likes: 25,
    },
    {
      question_id: 3,
      text: 'CORS 에러는 왜 발생하고 어떻게 해결하나요?',
      created_at: '2025-05-16T09:30:00Z',
      is_selected: false,
      likes: 8,
    },
    {
      question_id: 4,
      text: 'TypeScript의 유틸리티 타입 중 가장 자주 쓰는 것은?',
      created_at: '2025-05-16T09:45:00Z',
      is_selected: false,
      likes: 17,
    },
  ];
  const [isLive, setLive] = useState(false);
  const [roomInfo, setRoomInfo] = useState<Room>({
    id: '-1',
    code: '-1',
    title: '강의 제목',
    created_at: '',
    file_name: '',
  });
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [connected, setConnected] = useState(false);
  const [roomSocketId, setRoomSocketId] = useState<string | null>(null);
  const [isRecent, setIsRecent] = useState(true);
  const isRecentRef = useRef(isRecent);
  useEffect(() => {
    isRecentRef.current = isRecent;
  }, [isRecent]);

  const [searchParams] = useSearchParams();

  const roomId = searchParams.get('room-id');
  const enterCode = searchParams.get('enter-code');
  const navigate = useNavigate();
  useEffect(() => {
    const fetchRoomInfo = async () => {
      if (enterCode) {
        const res = await getRoomInfo(enterCode);
        if (res) {
          setRoomInfo((prev) => ({
            ...prev,
            id: roomId,
            code: enterCode,
            title: res.title,
            created_at: res.created_at,
            file_name: res.file_name,
          }));
        }
      }
    };

    fetchRoomInfo();
  }, [enterCode, roomId]);
  useEffect(() => {
    const fetchQuestions = async () => {
      if (roomId !== '-1' && roomId && !isNaN(parseInt(roomId))) {
        const res = await getQuestionlist(parseInt(roomId));
        if (res) {
          if (isRecent) {
            setQuestions(sortedByCreatedAt(res));
          } else {
            setQuestions(sortedByLikes(res));
          }
        }
      }
    };

    fetchQuestions();
    if (roomId) {
      joinRoom();
    }

    return () => {
      leaveRoom();
    };
  }, [roomId]);

  useEffect(() => {
    const handleReceiveQuestion = (newQuestion: QuestionType) => {
      setQuestions((prev) => {
        const updated = [...prev, newQuestion];
        if (isRecentRef.current) {
          return sortedByCreatedAt(updated);
        } else {
          return sortedByLikes(updated);
        }
      });
    };
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    socket.on('receiveQuestion', handleReceiveQuestion);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      socket.off('receiveQuestion', handleReceiveQuestion);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isRecent]);

  const sortedByCreatedAt = (questions: QuestionType[]) => {
    return [...questions].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  };
  const sortedByLikes = (questions: QuestionType[]) => {
    return [...questions].sort(
      (a, b) => parseInt(String(b.likes)) - parseInt(String(a.likes))
    );
  };
  useEffect(() => {
    if (isRecent) {
      setQuestions(sortedByCreatedAt(questions));
    } else {
      setQuestions(sortedByLikes(questions));
    }
  }, [isRecent]);

  const joinRoom = () => {
    if (!roomId) return;

    const socketId = `room_${roomId}`;
    setRoomSocketId(socketId);

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit('joinRoom', { roomSocketId: socketId });
    setConnected(true);
  };

  const leaveRoom = () => {
    if (!connected || !roomSocketId) return;

    socket.emit('leaveRoom', { roomSocketId });
    setConnected(false);
    setRoomSocketId(null);
  };

  const clickDown = async () => {
    if (roomId) {
      await downloadFile(roomId, roomInfo.file_name);
    }
  };

  const clickCheck = async (questionId: number) => {
    if (roomId && questionId) {
      const res = await answerQuestion(roomId, questionId);
      if (res) {
        const updated = await getQuestionlist(parseInt(roomId));
        if (updated) {
          if (isRecent) {
            setQuestions(sortedByCreatedAt(updated));
          } else {
            setQuestions(sortedByLikes(updated));
          }
        }
      }
    }
  };

  // Live 버튼 클릭
  const liveClick = () => {
    // Todo : 라이브 재생 기능
    setLive(true);
  };
  // 닫기 버튼 클릭
  const closeClick = async () => {
    if (roomId) {
      if (confirm('질문방을 닫으시겠습니까 ?')) {
        await exitRoom(roomId);
        leaveRoom();
        navigate('/');
      }
    }
  };
  // view as participant 버튼 클릭
  const viewClick = () => {
    console.log('viewClick');
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
        <div className="w-full flex justify-between items-center text-[16px] text-[#737373]">
          <div className="flex items-center gap-6">
            <div
              className="rounded-xl flex items-center relative
              px-14 py-3 font-medium border border-[#CFCFCF] cursor-pointer"
              onClick={() => setIsRecent(!isRecent)}
            >
              <Sorting className="absolute left-7" />
              <span className="min-w-14">{isRecent ? 'Recent' : 'Likes'}</span>
            </div>
            <div
              className="rounded-xl flex items-center relative text-[#289983]
              px-15 py-3 font-medium border border-[var(--color-primary)] cursor-pointer"
              onClick={() => clickDown()}
            >
              <Link className="absolute left-7" />
              <span>자료 다운로드</span>
            </div>
          </div>
          <span className="font-semibold">{dumpData.length} Questions</span>
        </div>
        {/* 질문 목록 */}
        <div className="w-full flex flex-col items-center gap-6">
          {questions?.map((question) => (
            <Question
              key={question.question_id}
              {...question}
              isLecturer={true}
              checkClick={clickCheck}
            />
          ))}
          {(!questions || questions.length === 0) && (
            <span className="w-full p-12 text-center font-semibold text-xl text-[var(--color-gray-2)] ">
              아직 질문이 없습니다.
            </span>
          )}
        </div>
      </div>
      <div className="w-4/5">
        {/* 하단 버튼 모음 div */}
        <RoomFooter
          isLive={isLive}
          liveClick={liveClick}
          closeClick={closeClick}
          viewClick={viewClick}
        />
      </div>
    </div>
  );
};
export default RoomAdmin;
