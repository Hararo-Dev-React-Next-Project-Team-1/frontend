'use client';

import { useEffect, useState } from 'react';
import socket from '../lib/socket';
import { useCallback } from 'react';


type Question = {
  question_id: string;
  room_id: string;
  creator_id: string;
  created_at: string;
  text: string;
  likes: string;
  is_selected: boolean;
};

export default function RoomTestPage() {
  const [roomSocketId, setRoomSocketId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [roomClosed, setRoomClosed] = useState(false);
  const [roomId, setRoomId] = useState<number | null>(null)

  // 방 입장
  const handleJoin = (roomId: number) => {
    const id = `room_${roomId}`;
    console.log("📌 방 입장 시도 - roomSocketId:", id);
    setRoomId(roomId);
    setRoomSocketId(id);

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit('joinRoom', { roomSocketId: id });
    console.log("🚪 joinRoom emit 완료");
    setConnected(true);
    setRoomClosed(false);
  };

  // 질문 전송
  const handleSendQuestion = () => {
    if (!roomSocketId || !connected || roomClosed) return;

    const text = '테스트 질문입니다.';
    const visitorId = 'test-visitor-1234'; // ✅ 임시 visitorId

    //console.log('질문 전송 버튼 클릭됨');
    // console.log('질문 내용:', text);

    socket.emit('sendQuestion', {
      roomId: roomSocketId,
      text: text,
      visitorId: visitorId
    });
  };

  // 질문 수정
  socket.on('updateQuestion', (updatedQuestion: Question) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.question_id === updatedQuestion.question_id ? updatedQuestion : q
      )
    );
  });


  // 방 닫기 (강연자 전용 기능)
  const handleCloseRoom = () => {
    if (!roomSocketId || !connected) return;
    socket.emit("closeRoom", { roomSocketId });
  };

  // 방 나가기 (사용자 전용 기능)
  const handleLeaveRoom = () => {
    if (!roomSocketId || !connected) return;

    socket.emit("leaveRoom", { roomSocketId });
    setRoomSocketId(""); // 상태 초기화
    setConnected(false);
    alert("방을 나갔습니다.");
  };

  // 질문 초기 로딩용 useEffect (roomId 바뀔 때마다 GET)
  const fetchQuestions = useCallback(async () => {
    if (!roomId) return;

    try {
      const res = await fetch(`/api/rooms/${roomId}/questions`);
      const data = await res.json();

      console.log('🎯 서버에서 받아온 질문:', data.questions);

      if (Array.isArray(data.questions)) {
        setQuestions(data.questions);
      } else {
        console.warn('❗ questions가 배열이 아님:', data);
        setQuestions([]);
      }
    } catch (err) {
      console.error("❌ 질문 목록 불러오기 실패:", err);
    }
  }, [roomId]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // 질문 삭제 반영
  useEffect(() => {
    if (!socket) return;

    const handleDeleteQuestion = ({ question_id }: { question_id: string }) => {
      console.log("🧨 삭제 이벤트 수신:", question_id);
      setQuestions((prev) => {
        // console.log("🔥 기존 질문 목록:", prev.map(q => q.question_id));
        // console.log("🧨 삭제하려는 ID:", question_id, typeof question_id);

        const updated = prev.filter((q) => String(q.question_id) !== String(question_id));

        // console.log("🧹 업데이트된 질문 목록:", updated.map(q => q.question_id));

        return updated;
      });

    };

    socket.on('deleteQuestion', handleDeleteQuestion);

    return () => {
      socket.off('deleteQuestion', handleDeleteQuestion);
    };
  }, [socket]);

  // 질문 수정 반영
  useEffect(() => {
    if (!socket) return;
  
    const handleUpdate = ({ question }: { question: Question }) => {
      setQuestions((prev) =>
        prev.map((q) =>
          String(q.question_id) === String(question.question_id) ? question : q
        )
      );
    };
  
    socket.on("updateQuestion", handleUpdate);
  
    return () => {
      socket.off("updateQuestion", handleUpdate);
    };
  }, [socket]);

  // 질문 수신용 useEffect
  useEffect(() => {
    socket.on('receiveQuestion', (q: Question) => {
      // console.log("📥 질문 수신:", q);
      setQuestions((prev) => [q, ...prev]);
    });

    return () => {
      socket.off('receiveQuestion');
    };
  }, []);

  // 방 닫힘 감지용 useEffect
  useEffect(() => {
    socket.on('roomClosed', () => {
      setRoomClosed(true);
      alert('⚠️ 방이 닫혔습니다.');
    });

    return () => {
      socket.off('roomClosed');
    };
  }, []);


  return (
    <div style={{ padding: 20 }}>
      <h2>🎤 소켓 기반 강연방 테스트</h2>

      {!connected && (
        <button onClick={() => handleJoin(1)}> 🚪 방 입장 </button>
      )}

      {connected && !roomClosed && (
        <>
          <p>✅ 현재 방: <strong>{roomSocketId}</strong></p>
          <button onClick={handleSendQuestion}> 📤 질문 전송 </button>
          <button onClick={handleLeaveRoom}> 🏃🏻 방 나가기 </button>
          <button onClick={handleCloseRoom}> ❌ 방 닫기 </button>
        </>
      )}

      {roomClosed && <p style={{ color: 'red' }}>⛔ 이 방은 종료되었습니다.</p>}

      <hr />
      <h4>📋 질문 목록</h4>
      <ul>
        {questions.map((q) => {
          // responseBody에 포함된 값 전체를 받아오되, 화면에 표시하고 싶은 일부 속성만 골라서 출력
          const { text, likes, created_at } = q;
          return (
            <li key={q.question_id}>
              <div><strong>질문:</strong> {text}</div>
              <div><strong>좋아요:</strong> {likes}</div>
              <div><strong>작성 시간:</strong> {new Date(created_at).toLocaleString('ko-KR')}</div>
              <hr />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

