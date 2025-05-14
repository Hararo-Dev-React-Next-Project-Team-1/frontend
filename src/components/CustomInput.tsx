import { useEffect, useState } from 'react';

type Props = {
  inputType: 'text' | 'file';
  label: string;
  placeholder: string;
};
const CustomInput = ({ inputType, label, placeholder }: Props) => {
  useEffect(() => {
    console.log('inputType : ', inputType);
  }, [inputType]);
  const [fileName, setFileName] = useState('');

  return (
    <div className="w-3/5 flex justify-between items-center font-semibold ">
      <div className="min-w-[80px]">{label}</div>
      {inputType === 'text' && (
        <input
          type={inputType}
          placeholder={placeholder}
          className="flex-1 border-2 border-[var(--color-gray)] outline-none
             text-black rounded-md py-3 pl-4
            placeholder:text-black focus:border-[var(--color-primary)]
            transition-colors duration-200"
        />
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
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setFileName(file.name);
            }}
          />
        </label>
      )}
    </div>
  );
};
export default CustomInput;
