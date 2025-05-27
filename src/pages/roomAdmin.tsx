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
  highlightQuestion,
  type QuestionType,
} from '../apis/questions.ts';
import socket from '../lib/socket.ts'; // socket.ts 유지
import { sortedByLikes, sortedByCreatedAt } from '../lib/questions.ts';
export type Room = {
  id: string | null;
  code: string;
  title: string;
  created_at: string;
  file_name: string;
};

const RoomAdmin = () => {
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
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const highlightedIdRef = useRef<string | null>(null);

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
            setQuestions(sortedByCreatedAt(res, highlightedId));
          } else {
            setQuestions(sortedByLikes(res, highlightedId));
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
    // 질문 추가
    const handleReceiveQuestion = (newQuestion: QuestionType) => {
      setQuestions((prev) => {
        const updated = [...prev, newQuestion];
        if (isRecentRef.current) {
          return sortedByCreatedAt(updated, highlightedIdRef.current);
        } else {
          return sortedByLikes(updated, highlightedIdRef.current);
        }
      });
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    const handleLikes = ({ questionId, likes }: { questionId: number, likes:number }) =>{
      setQuestions((prev) =>
        prev.map((q) =>
          q.question_id === questionId ? { ...q, likes:likes } : q
        )
      )};

    // 질문 수정
    const handleUpdate = ({ question }: { question: QuestionType }) => {
      setQuestions((prev) => {
        const updated = prev.map((q) => {
          if (q.question_id === question.question_id) {
            return {
              ...question,
              is_answered: q.question_id === highlightedIdRef.current,
            };
          }
          return q;
        });

        return isRecentRef.current
          ? sortedByCreatedAt(updated, highlightedIdRef.current)
          : sortedByLikes(updated, highlightedIdRef.current);
      });
    };

    // 질문 삭제
    const handleDeleteQuestion = ({ question_id }: { question_id: string }) => {
      setQuestions((prev) => {
        const updated = prev.filter(
          (q) => String(q.question_id) !== String(question_id)
        );
        return updated;
      });

      if (highlightedId === question_id) {
        setHighlightedId(null);
      }
    };

    const handleLikes = ({
      questionId,
      likes,
    }: {
      questionId: number;
      likes: number;
    }) => {
      console.log('걸리니??');

      setQuestions((prev) => {
        const updated = prev.map((q) => {
          if (String(q.question_id) === String(questionId)) {
            return {
              ...q,
              is_answered: q.question_id === highlightedIdRef.current,
              likes: likes,
            };
          }
          return q;
        });

        return isRecentRef.current
          ? sortedByCreatedAt(updated, highlightedIdRef.current)
          : sortedByLikes(updated, highlightedIdRef.current);
      });
    };

    socket.on('receiveQuestion', handleReceiveQuestion);
    socket.on('updateQuestion', handleUpdate);
    socket.on('deleteQuestion', handleDeleteQuestion);
    socket.on('updateLikes', handleLikes);

    socket.on('receiveHighlight', (data: { question_id: string }) => {
      setHighlightedId(data.question_id);
    });

    socket.on('updateLikes', handleLikes);

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      socket.off('receiveQuestion', handleReceiveQuestion);
      socket.off('receiveHighlight');
      socket.off('updateQuestion', handleUpdate);
      socket.off('deleteQuestion', handleDeleteQuestion);
      socket.off('updateLikes', handleLikes);
      socket.off('updateLikes', handleLikes);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    highlightedIdRef.current = highlightedId;
  }, [highlightedId]);

  useEffect(() => {
    if (isRecent) {
      setQuestions(sortedByCreatedAt(questions, highlightedId));
    } else {
      setQuestions(sortedByLikes(questions, highlightedId));
    }
  }, [isRecent]);

  useEffect(() => {
    if (!highlightedId) return;

    setQuestions((prev) => {
      const updated = prev.map((q) => ({
        ...q,
        is_answered: q.question_id === highlightedId,
      }));

      const sorted = updated.sort((a, b) => {
        if (a.question_id === highlightedId) return -1;
        if (b.question_id === highlightedId) return 1;
        return 0;
      });

      return sorted;
    });
  }, [highlightedId]);

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

    socket.emit('closeRoom', { roomSocketId });
    setConnected(false);
    setRoomSocketId(null);
  };

  const clickDown = async () => {
    if (roomId) {
      await downloadFile(roomId, roomInfo.file_name);
    }
  };

  const clickCheck = async (questionId: string) => {
    if (roomId && questionId) {
      const res = await answerQuestion(roomId, questionId);
      if (res) {
        const updated = await getQuestionlist(parseInt(roomId));
        if (updated) {
          if (isRecent) {
            setQuestions(sortedByCreatedAt(updated, highlightedId));
          } else {
            setQuestions(sortedByLikes(updated, highlightedId));
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
  const handleHighLight = async (questionId: string) => {
    await highlightQuestion(roomId, questionId);
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
          <span className="font-semibold">{questions.length} Questions</span>
        </div>
        {/* 질문 목록 */}
        <div className="w-full flex flex-col items-center gap-6">
          {questions?.map((question) => (
            <Question
              key={question.question_id}
              {...question}
              isLecturer={true}
              checkClick={clickCheck}
              clickBox={handleHighLight}
              is_answered={question.is_answered}
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
