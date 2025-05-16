type Props = {
  text: string;
  onClick: () => void;
  disabled: boolean;
};

const CustomButton = ({ text, onClick, disabled }: Props) => {
  return (
    <button
      className="text-center px-5 py-3 text-xl font-semibold
    text-white rounded-md bg-[var(--color-primary)] cursor-pointer
      disabled:bg-[var(--color-gray)] disabled:text-[var(--color-gray-2)] disabled:cursor-not-allowed"
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default CustomButton;
