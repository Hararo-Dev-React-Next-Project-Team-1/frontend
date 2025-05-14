import type { ReactNode } from 'react';
import Check from '../assets/Check.tsx';
type Props = {
  selected: boolean;
  content: string;
  children: ReactNode;
};
const MainCard = ({ selected, content, children }: Props) => {
  return (
    <div
      className={`w-1/2 flex flex-col items-center justify-end gap-8 pt-30 pb-12 rounded-xl
    border-4 border-[var(--color-primary)] relative transition-colors duration-300
    ${
      selected
        ? 'bg-[var(--color-primary)] text-white'
        : 'bg-white text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white'
    }
  `}
    >
      {children}
      <div className={`text-2xl font-bold`}>{content}</div>
      <div className="absolute top-2 right-2 z-10 overflow-hidden">
        <Check />
      </div>
    </div>
  );
};

export default MainCard;
