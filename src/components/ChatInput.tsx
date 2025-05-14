import User from '../assets/User.svg?react';
type Props = {
  onChange: (userChat: string) => void;
  sendChat: () => void;
};

const ChatInput = ({ onChange, sendChat }: Props) => {
  const activeEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendChat();
      e.currentTarget.value = '';
    }
  };

  return (
    <div
      className="w-full py-8 pl-8 flex items-center
    shadow-[0px_3px_10px_rgba(0,0,0,0.25)] rounded-2xl gap-8"
    >
      <User />
      <input
        placeholder={'질문을 입력하세요.'}
        className="outline-none text-xl font-semibold placeholder:text-[#B1B1B1] text-black"
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => activeEnter(e)}
      />
    </div>
  );
};

export default ChatInput;
