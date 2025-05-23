import { useEffect, useState } from 'react';
import { DotsIcon } from '../assets/DotsIcon';
import CheckSmall from '../assets/CheckSmall.tsx';
import { ThumbIcon } from '../assets/ThumbIcon';
import { UserIcon } from '../assets/UserIcon';
import { EditQuestion } from './EditQuestion';
import {
  deleteQuestion,
  editQuestion,
  type QuestionType,
} from '../apis/questions';
import { postLike, deleteLike } from '../apis/like';
import { useSearchParams } from 'react-router-dom';

interface QuestionProps extends QuestionType {
  checkClick?: (questions_id: number) => void;
  isLecturer: boolean;
  visitorId?: string;
  roomSocketId?: string | null;
  onUpdate?: (questionId: number, text: string) => void;
  onDelete?: (questionId: number) => void;
}

export const Question = ({
  question_id, //좋아요 post시 사용
  text,
  creator_id,
  created_at,
  likes,
  checkClick,
  is_answered,
  isLecturer,
  visitorId,
  roomSocketId,
  onUpdate,
  onDelete,
}: QuestionProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
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

    if (typeof result === 'string') {
      return alert(result);
    }

    onUpdate?.(parseInt(question_id, 10), result.text);

    setEditedText(result.text);
    setIsEditing(false);
    setShowMenu(false);
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
      onDelete?.(parseInt(question_id, 10));

      setShowMenu(false);
    } else {
      alert(res);
    }
  };

  // 질문 좋아요
  const handleLikeClick = async () => {
    if (isLecturer) return;

    const newLikeState = !isLiked;
    setIsLiked(newLikeState);
    setLikeCount((prev) => prev + (newLikeState ? 1 : -1)); // optimistic UI

    const result = newLikeState
      ? await postLike(parseInt(roomId, 10), parseInt(question_id, 10))
      : await deleteLike(parseInt(roomId, 10), parseInt(question_id, 10));

    if (
      result.startsWith('요청') ||
      result.startsWith('오류') ||
      result.startsWith('서버')
    ) {
      // 실패했으면 되돌리기
      setIsLiked((prev) => !prev);
      setLikeCount((prev) => prev + (newLikeState ? -1 : 1));
      alert(result);
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
            <div>{editedText}</div>
          )}
        </div>
        {/* 좋아요, 더보기 버튼 */}
        <div className="flex flex-col items-end justify-between">
          {/* 좋아요 */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleLikeClick();
            }}
            className={`flex items-center gap-2 px-3 py-[0.4rem] rounded-full cursor-pointer border-1
            ${
              isLiked
                ? 'border-[#33C4A8] bg-[rgb(225,244,240)] text-[#33C4A8]'
                : 'border-transparent bg-transparent text-[#737373]'
            }
            `}
          >
            <div className="text-[12px]">{likeCount}</div>
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
          {/* {isLecturer && (
            <div
              className="w-6 h-5 mr-2 cursor-pointer relative"
              onClick={() => checkClick(question_id)}
            >
              <CheckSmall />
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};
