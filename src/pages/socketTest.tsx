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
  is_answered: boolean;
};

export default function RoomTestPage() {
  const [roomSocketId, setRoomSocketId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [roomClosed, setRoomClosed] = useState(false);
  const [roomId, setRoomId] = useState<number | null>(null)
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

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

  // 질문 수정
  socket.on('updateQuestion', (updatedQuestion: Question) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.question_id === updatedQuestion.question_id ? updatedQuestion : q
      )
    );
  });

  // 좋아요 누르면 내가 먼저 상태 업데이트 + 소켓 전송
  const handleLike = async (questionId: string) => {
    const res = await fetch(`/api/rooms/${roomId}/questions/${questionId}/likes`, {
      method: 'POST',
    });

    if (!res.ok) return;

    const data = await res.json();

    setQuestions((prev) =>
      prev.map((q) =>
        q.question_id === questionId ? { ...q, likes: data.likes } : q
      )
    );

    socket.emit('updateLikes', {
      roomId: roomSocketId,
      questionId,
      likes: data.likes,
    });
  };

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

  // 질문 초기 로딩 (roomId 바뀔 때마다 GET)
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


  // 질문 수신용 useEffect
  useEffect(() => {
    socket.on('receiveQuestion', (q: Question) => {
      console.log("📥 질문 수신:", q);
      setQuestions((prev) => [...prev, q]);
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

  // 질문 삭제 반영
  useEffect(() => {
    if (!socket) return;

    const handleDeleteQuestion = ({ question_id }: { question_id: string }) => {
      console.log("🧨 삭제 이벤트 수신:", question_id);
      setQuestions((prev) => {
        const updated = prev.filter((q) => String(q.question_id) !== String(question_id));
        return updated;
      });
    };
    socket.on('deleteQuestion', handleDeleteQuestion);

    return () => {
      socket.off('deleteQuestion', handleDeleteQuestion);
    };
  }, [socket]);


  // 좋아요 실시간 반영
  useEffect(() => {
    if (!socket) return;

    const handleUpdateLikes = ({ questionId, likes }: { questionId: string; likes: string }) => {
      setQuestions((prev) =>
        prev.map((q) =>
          q.question_id === questionId ? { ...q, likes } : q
        )
      );
    };

    socket.on('updateLikes', handleUpdateLikes);

    return () => {
      socket.off('updateLikes', handleUpdateLikes);
    };
  }, [socket]);

  // 하이라이트 실시간 반영
  useEffect(() => {
    socket.on('receiveHighlight', (data: { question_id: string }) => {
      setHighlightedId(data.question_id);
    });

    return () => {
      socket.off('receiveHighlight');
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
          <button onClick={handleLeaveRoom}> 🏃🏻 방 나가기 </button>
          <button onClick={handleCloseRoom}> ❌ 방 닫기 </button>
        </>
      )}

      {roomClosed && <p style={{ color: 'red' }}>⛔ 이 방은 종료되었습니다.</p>}

      <hr />
      <h4>📋 질문 목록</h4>
      <ul>
        {questions.map((q) => {
          const { text, likes, created_at, question_id } = q;
          const isHighlighted = highlightedId === question_id.toString();

          return (
            <li
              key={question_id}
              style={{
                backgroundColor: isHighlighted ? '#fff7d6' : 'transparent', // 연노랑 강조
                border: isHighlighted ? '2px solid orange' : '1px solid #ccc',
                padding: '8px',
                marginBottom: '8px',
              }}
            >
              <div><strong>질문:</strong> {text}</div>
              <div>
                <strong>좋아요:</strong> {likes}
                <button onClick={() => handleLike(question_id)}>좋아요 👍</button>
              </div>
              <div><strong>작성 시간:</strong> {new Date(created_at).toLocaleString('ko-KR')}</div>
            </li>
          );
        })}
      </ul>

    </div>
  );
}

