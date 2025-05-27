import { UserIcon } from '../assets/UserIcon';
import { type QuestionType } from '../apis/questions';

interface QuestionProps extends QuestionType {
  isAdmin: boolean;
  isEditable: boolean;
  complete: boolean;
  roomTitle: string;
  onClick?: () => void;
}

export const AdminQuestion = ({
  text,
  created_at,
  isAdmin,
  roomTitle,
  onClick,
}: QuestionProps) => {
  // const navigate = useNavigate();
  const handleBoxClick = () => {
    // Todo : 방 이동 처리
    if (onClick) {
      onClick(); // ✅ 전달된 경우에만 실행
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return (
      date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }) +
      ' ' +
      created_at.slice(11, 16)
    );
  };
  console.log('isAdmin', isAdmin);

  return (
    <div
      onClick={handleBoxClick}
      className={`flex flex-row w-full h-fit py-4 px-8 rounded-2xl bg-white shadow-[0_0_4px_1px_rgba(51,196,168,0.75)] 
        ${isAdmin ? 'cursor-pointer border-[var(--color-primary)] bg-[#E1F4F0]' : 'bg-white'}
      `}
    >
      <div
        className={`w-full h-full flex justify-between 
        ${isAdmin ? 'py-4' : ''}
        `}
      >
        <div className="flex flex-col gap-3 flex-1">
          <div className="flex flex-row gap-4 items-center">
            <div className="w-8 h-fit justify-center items-center ">
              <UserIcon />
            </div>
            <div className="flex flex-col">
              <p className="text-[16px] font-[500]">
                {text ? 'Annonymous' : roomTitle}
              </p>
              <p className="text-[14px] text-[#737373]">
                {text ? created_at.slice(11, 16) : formatDate(created_at)}
              </p>
            </div>
          </div>
          {text}
        </div>
      </div>
    </div>
  );
};
