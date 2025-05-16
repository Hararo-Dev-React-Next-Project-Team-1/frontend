import { useState } from 'react';
import { DotsIcon } from '../assets/DotsIcon';
import { ThumbIcon } from '../assets/ThumbIcon';
import { UserIcon } from '../assets/UserIcon';
import { EditQuestion } from './EditQuestion';
import type { QuestionType } from '../apis/questions';

interface QuestionProps extends QuestionType {
  isAdmin: boolean;
}

export const Question = ({
  question_id, //좋아요 post시 사용
  text,
  created_at,
  is_selected,
  likes,
  isAdmin,
}: QuestionProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedBox, setSelectedBox] = useState(is_selected);

  //선택한 질문 하이라이팅
  const handleBoxClick = () => {
    if (!isAdmin) return;
    setSelectedBox((prev) => !prev);
  };

  return (
    <div
      onClick={handleBoxClick}
      className={`flex flex-row w-full h-fit py-4 px-8 rounded-2xl shadow-[0_0_4px_1px_rgba(51,196,168,0.75)] 
        ${selectedBox ? 'bg-[#E1F4F0]' : 'bg-white'}
        ${isAdmin ? 'cursor-pointer' : ''}
      `}
    >
      <div className="w-full h-full flex justify-between">
        <div className="flex flex-col gap-3">
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
          <div>{text}</div>
        </div>
        {/* 좋아요, 수정 버튼 */}
        <div className="flex flex-col items-end justify-between">
          {/* 좋아요 */}
          <div
            onClick={() => {
              if (isAdmin) return;
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
          {!isAdmin && (
            <div
              onClick={() => setShowMenu((prev) => !prev)}
              className="w-6 h-5 mr-2 cursor-pointer relative"
            >
              <DotsIcon />
              {showMenu && <EditQuestion />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
