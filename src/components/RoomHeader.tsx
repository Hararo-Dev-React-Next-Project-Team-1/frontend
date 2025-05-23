type Props = {
  title: string;
  dateStr: string;
  roomCode: string | null;
};

const RoomHeader = ({ title, roomCode, dateStr }: Props) => {
  const date = new Date(dateStr);
  const formatted = !isNaN(date.getTime())
    ? date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';

  return (
    <div className="w-full py-4 px-1 flex justify-between items-end relative border-b-2 border-[#CFCFCF]">
      {formatted && (
        <div className="flex flex-col gap-1 justify-center text-[var(--color-gray-2)]">
          <span className="text-sm">Date</span>
          <div className="font-semibold text-xl">{formatted}</div>
        </div>
      )}
      <span className="absolute left-1/2 -translate-x-1/2 text-2xl font-semibold">
        {title}
      </span>
      {formatted && (
        <div className="flex flex-col gap-1 justify-center items-end text-[var(--color-gray-2)]">
          <span className="text-sm">Enter Code</span>
          <div className="font-semibold text-xl text-[var(--color-primary)]">
            #{roomCode}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomHeader;
