import { useState } from 'react';
import { DotsIcon } from '../assets/DotsIcon';
import { ThumbIcon } from '../assets/ThumbIcon';
import { UserIcon } from '../assets/UserIcon';
import { EditQuestion } from './EditQuestion';
import {
  deleteQuestion,
  editQuestion,
  type QuestionType,
} from '../apis/questions';
import { useSearchParams } from 'react-router-dom';

interface QuestionProps extends QuestionType {
  isLecturer: boolean;
  visitorId: string;
}

export const Question = ({
  question_id, //좋아요 post시 사용
  text,
  creator_id,
  created_at,
  likes,
  is_answered,
  isLecturer,
  visitorId,
}: QuestionProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedBox, setSelectedBox] = useState(is_answered);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);

  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('room-id') || '';

  //선택한 질문 하이라이팅
  const handleBoxClick = () => {
    if (!isLecturer) return;
    setSelectedBox((prev) => !prev);
  };

  //수정 확인
  const handleSave = async () => {
    const result = await editQuestion(
      parseInt(question_id, 10),
      parseInt(roomId, 10),
      editedText
    );
    // 실패
    if (typeof result === 'string') {
      alert(result);
      return;
    }

    setEditedText(result.text);
    setIsEditing(false);
    setShowMenu(false);
    //소켓 이벤트로 실시간 반영 → 이미 리스닝 중이라면 굳이 여기서 안 해도 됩니다.
  };

  //수정 취소
  const handleCancel = () => {
    setEditedText(text);
    setIsEditing(false);
    setShowMenu(false);
  };

  const handleDelete = async () => {
    if (!confirm('삭제하시겠습니까?')) return;

    const res = await deleteQuestion(
      parseInt(question_id, 10),
      parseInt(roomId, 10)
    );
    if (res === '삭제 성공') {
      //(소켓 이벤트로 UI 업데이트 or 로컬 상태 갱신)
      setShowMenu(false);
    } else {
      alert(res);
    }
  };

  return (
    <div
      onClick={handleBoxClick}
      className={`flex flex-row w-full h-fit py-4 px-8 rounded-2xl shadow-[0_0_4px_1px_rgba(51,196,168,0.75)] 
        ${selectedBox ? 'bg-[#E1F4F0]' : 'bg-white'}
        ${isLecturer ? 'cursor-pointer' : ''}
      `}
    >
      <div className="w-full h-full flex justify-between">
        <div className="flex flex-col gap-3 flex-1">
          <div className="flex flex-row gap-4 items-center">
            <div className="w-8 h-fit justify-center items-center ">
              <UserIcon />
            </div>
            <div className="flex flex-col">
              <p className="text-[16px] font-[500]">Annonymous</p>
              <p className="text-[14px] text-[#737373]">
                {created_at.slice(11, 16)}
              </p>
            </div>
          </div>
          {visitorId === creator_id && isEditing ? (
            <div className="flex items-center gap-2 w-full ">
              <input
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className=" border-gray-500 border-1 px-2 py-1 rounded w-3/5"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSave();
                  }}
                  className="px-3 py-1 bg-[#33C4A8] text-white rounded"
                >
                  저장
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancel();
                  }}
                  className="px-3 py-1 bg-gray-300 rounded"
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <div>{text}</div>
          )}
        </div>
        {/* 좋아요, 더보기 버튼 */}
        <div className="flex flex-col items-end justify-between">
          {/* 좋아요 */}
          <div
            onClick={() => {
              if (isLecturer) return;
              setIsLiked((prev) => !prev);
            }}
            className={`flex items-center gap-2 px-3 py-[0.4rem] rounded-full cursor-pointer border-1
            ${
              isLiked
                ? 'border-[#33C4A8] bg-[rgb(225,244,240)] text-[#33C4A8]'
                : 'border-transparent bg-transparent text-[#737373]'
            }
            `}
          >
            <div className="text-[12px]">{likes}</div>
            <div className="w-4 h-4 flex items-center justify-center">
              <ThumbIcon />
            </div>
          </div>
          {/* 더보기 메뉴 */}
          {/* 강연자 아니고, 작성자일때 편집 가능 */}
          {!isLecturer && visitorId === creator_id && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu((v) => !v);
              }}
              className="w-6 h-5 mr-2 cursor-pointer relative"
            >
              <DotsIcon />
              {showMenu && (
                <EditQuestion
                  onEdit={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                  onDelete={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
