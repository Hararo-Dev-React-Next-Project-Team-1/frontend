import { PencilIcon } from '../assets/PencilIcon';
import { TrashIcon } from '../assets/TrashIcon';

export const EditQuestion = () => {
  return (
    <div className="w-40 rounded-lg shadow-md bg-white relative bottom-0 border-1 border-[#ececec]">
      <div className="flex items-center p-3 gap-2 text-[#737373] hover:bg-neutral-100 rounded cursor-pointer">
        <div className="w-4 h-4">
          <PencilIcon />
        </div>
        <span className="text-sm">Edit</span>
      </div>

      <div className="flex items-center p-3 gap-2 text-[#737373] hover:bg-neutral-100 rounded cursor-pointer">
        <div className="w-4 h-4">
          <TrashIcon />
        </div>
        <span className="text-sm">Delete</span>
      </div>
    </div>
  );
};
