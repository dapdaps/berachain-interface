import { Status } from "../types";

interface StatusProps {
  status: Status
}

const statusTextMap = {
  live: 'Live',
  sold_out: 'Sold out',
  paused: 'Paused'
};

const statusColorMap = {
  live: 'bg-[#4CAF50]',
  sold_out: 'bg-gray-500',
  paused: 'bg-[#DC3838]'
};

export const MintStatus: React.FC<StatusProps> = ({ status }) => {
  const showPing = status === 'live' || status === 'paused';
  const bgColor = statusColorMap[status];

  return (
    <div className="flex items-center gap-2">
      <div className="relative mx-auto h-2.5 w-2.5">
        {showPing ? (
          <div className="flex items-center justify-center">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${bgColor} opacity-75`} />
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${bgColor}`} />
          </div>
        ) : (
          <div className={`relative w-full h-full rounded-full ${bgColor} flex items-center justify-center`}>
            <div className={`absolute w-full h-full rounded-full ${bgColor}`} />
          </div>
        )}
      </div>
      <p className="font-semibold text-base">
        {statusTextMap[status]}
      </p>
    </div>
  );
};
