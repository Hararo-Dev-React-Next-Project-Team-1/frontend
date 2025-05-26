import User from '../assets/User.svg?react';
import { useState } from 'react';
type Props = {
  onChange: (userChat: string) => void;
  sendChat: () => void;
};

const ChatInput = ({ onChange, sendChat }: Props) => {
  const [isComposing, setIsComposing] = useState(false);

  const activeEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isComposing) {
      sendChat();
      e.currentTarget.value = '';
    }
  };

  return (
    <div
      className="w-full py-8 px-8 flex items-center
    shadow-[0px_3px_10px_rgba(0,0,0,0.25)] rounded-2xl gap-8"
    >
      <User />
      <input
        placeholder={'질문을 입력하세요.'}
        className="flex-1 outline-none text-xl font-semibold placeholder:text-[#B1B1B1] text-black"
        onChange={(e) => onChange(e.target.value)}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        onKeyDown={activeEnter}
      />
    </div>
  );
};

export default ChatInput;