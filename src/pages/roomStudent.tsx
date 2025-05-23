import { useCallback, useEffect, useState } from 'react';
import RoomHeader from '../components/RoomHeader.tsx';
import Sorting from '../assets/Sorting.svg?react';
import ChatInput from '../components/ChatInput.tsx';
import Link from '../assets/Link.svg?react';
import { Question } from '../components/Question.tsx';
import {
  getQuestionlist,
  postQuestion,
  type QuestionType,
} from '../apis/questions.ts';
import { useSearchParams } from 'react-router-dom';
import { downloadFile, getRoomInfo } from '../apis/room.ts';
import socket from '../lib/socket.ts';

type Room = {
  id: string | null;
  code: string;
  title: string;
  created_at: string;
  file_name: string;
};

const RoomStudent = () => {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('room-id');
  const enterCode = searchParams.get('enter-code');
  const [qesList, setQesList] = useState<QuestionType[]>([]);

  const [userChat, setUserChat] = useState('');
  const [isLive, setLive] = useState(false);
  const [roomInfo, setRoomInfo] = useState<Room>({
    id: '-1',
    code: '-1',
    title: '강의 제목',
    created_at: '',
    file_name: '',
  });
  const [visitorId, setVisitorId] = useState('');

  // Socket 상태 관리
  const [connected, setConnected] = useState(false);
  const [roomSocketId, setRoomSocketId] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoomInfo = async () => {
      if (!enterCode) return;
      try {
        const res = await getRoomInfo(enterCode);
        if (res && roomId) {
          setRoomInfo({
            id: roomId,
            code: enterCode,
            title: res.title,
            created_at: res.created_at,
            file_name: res.file_name,
          });
          setVisitorId(res.visitor_id);
        }
      } catch (err) {
        console.error('방 정보 불러오기 실패:', err);
      }
    };
    fetchRoomInfo();
  }, [enterCode, roomId]);

  // 초기 질문
  const fetchQuestions = useCallback(async () => {
    if (!roomId) return;
    const res = await getQuestionlist(parseInt(roomId, 10));
    setQesList(res ?? []);
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;
    fetchQuestions();

    const socketId = `room_${roomId}`;
    setRoomSocketId(socketId);

    if (!socket.connected) socket.connect();
    socket.emit('joinRoom', { roomSocketId: socketId });

    return () => {
      socket.emit('leaveRoom', { roomSocketId: socketId });
    };
  }, [fetchQuestions, roomId]);

  useEffect(() => {
    const handleReceiveQuestion = (newQuestion: QuestionType) => {
      setQesList((prev) => [...prev, newQuestion]);
    };

    const onUpdated = (payload: { question: QuestionType }) => {
      const { question } = payload;
      setQesList((prev) =>
        prev.map((q) =>
          q.question_id === String(question.question_id)
            ? { ...q, text: question.text }
            : q
        )
      );
    };

    const onDeleted = ({ question_id }: { question_id: number }) => {
      setQesList((prev) =>
        prev.filter((q) => q.question_id !== String(question_id))
      );
    };

    socket.on('receiveQuestion', handleReceiveQuestion);
    socket.on('updateQuestion', onUpdated);
    socket.on('deleteQuestion', onDeleted);

    return () => {
      socket.off('receiveQuestion', handleReceiveQuestion);
      socket.off('updateQuestion', onUpdated);
      socket.off('deleteQuestion', onDeleted);
    };
  }, [socket]);

  const sendChat = async () => {
    if (userChat.trim().length === 0) return;
    try {
      await postQuestion(Number(roomId), userChat);

      if (roomSocketId) {
        socket.emit('receiveQuestion', { roomSocketId });
      }
      setUserChat('');
    } catch (error) {
      console.error('질문 전송 실패:', error);
    }
  };

  const clickDown = async () => {
    if (roomId) {
      await downloadFile(roomId, roomInfo.file_name);
    }
  };

  // Live 버튼 클릭
  const liveClick = () => {
    // Todo : 라이브 재생 기능
    setLive(true);
  };
  // 닫기 버튼 클릭
  const closeClick = () => {
    console.log('closeClick');
  };
  // view as participant 버튼 클릭
  const viewClick = () => {
    console.log('viewClick');
  };

  return (
    <div className="w-full flex flex-col items-center py-20 gap-12">
      <div className="w-4/5 flex flex-col items-center gap-20">
        <RoomHeader
          title={roomInfo.title}
          dateStr={roomInfo.created_at}
          roomCode={enterCode}
        />
        <ChatInput onChange={setUserChat} sendChat={sendChat} />
        <div className="w-full flex flex-col items-center gap-6">
          <div className="w-full flex justify-between items-center text-[16px] text-[#737373]">
            <div className="flex items-center gap-6">
              <div
                className="rounded-xl flex items-center relative
              px-14 py-3 font-medium border border-[#CFCFCF] cursor-pointer"
              >
                <Sorting className="absolute left-7" />
                <span>Recent</span>
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
            <span className="font-semibold">{qesList.length} Questions</span>
          </div>
          <div className="w-full flex flex-col items-center gap-6">
            {qesList?.map((question) => (
              // 질문 조회 API 연동 후 isEditable 처리
              <Question
                key={question.question_id}
                {...question}
                isLecturer={false}
                visitorId={visitorId}
                roomSocketId={roomSocketId}
                onUpdate={(id, newText) =>
                  setQesList((prev) =>
                    prev.map((q) =>
                      q.question_id === String(id) ? { ...q, text: newText } : q
                    )
                  )
                }
                onDelete={(id) =>
                  setQesList((prev) =>
                    prev.filter((q) => q.question_id !== String(id))
                  )
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomStudent;
