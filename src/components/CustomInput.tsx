import { useState } from 'react';

type Props = {
  inputType: 'text' | 'file';
  label: string;
  placeholder: string;
  onChange: (content: string | File) => void;
  errorContent: string;
  errorState: boolean;
  changeState: (state: () => boolean) => void;
};
const CustomInput = ({
  inputType,
  label,
  placeholder,
  onChange,
  errorContent,
  errorState,
  changeState,
}: Props) => {
  const [fileName, setFileName] = useState('');
  const handleSetTitleOrCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    changeState(() => false);
  };

  const handleSetFileName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onChange(file);
    }
  };

  return (
    <div className="w-3/5 flex justify-between items-start font-semibold ">
      <div className="min-w-[80px] pt-4">{label}</div>
      {inputType === 'text' && (
        <div className="flex-1  flex flex-col items-center justify-start">
          <input
            type={inputType}
            placeholder={placeholder}
            className={`w-full border-2 
            ${errorState ? 'border-[var(--color-error)]' : 'border-[var(--color-gray)]'}
            outline-none text-black rounded-md py-3 pl-4
            placeholder:text-black focus:border-[var(--color-primary)]
            transition-colors duration-200 
            `}
            onChange={handleSetTitleOrCode}
          />
          <span
            className={`text-sm text-[var(--color-error)] h-5 w-full text-start ${
              errorState ? 'opacity-100' : 'opacity-0'
            }`}
          >
            * {errorContent}
          </span>
        </div>
      )}
      {inputType === 'file' && (
        <label
          htmlFor="file-upload"
          className="flex-1 p-4 pl-4 border-2 border-[var(--color-gray)] rounded-md cursor-pointer
           text-black
           hover:border-[var(--color-primary)] transition-colors duration-200"
        >
          {fileName || placeholder}
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleSetFileName}
          />
        </label>
      )}
    </div>
  );
};
export default CustomInput;
