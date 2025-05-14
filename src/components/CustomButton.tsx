type Props = {
  text: string;
  onClick: () => void;
};

const CustomButton = ({ text, onClick }: Props) => {
  return (
    <button
      className="text-center px-5 py-3 text-xl font-semibold
    text-white rounded-md bg-[var(--color-primary)]"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default CustomButton;
