import { FC } from 'react';
import { useCountDown } from '@/hooks/use-count-down';
import { MintStatus } from '../types';
import { useAccount } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import Loading from '@/components/loading';

interface MintButtonProps {
  status: MintStatus;
  timestamp?: number;
  onClick?: () => void;
  loading?: boolean;
}

const Button: FC<MintButtonProps> = ({ 
  status, 
  timestamp,
  onClick,
  loading
}) => {
 
    const { address } = useAccount();
    const modal = useAppKit();

  const countdown = useCountDown({
    targetTimestamp: timestamp || 0,
    format: ' DDd HHh mmm sss'
  });

  if (status === 'upcoming') {
    return (
      <button 
        className="w-full bg-[#FFDC50] border font-bold border-black h-[46px] font-Montserrat text-[18px] rounded-[10px] disabled:bg-opacity-30"
        disabled
      >
        {countdown}
      </button>
    );
  }

  if (status === 'closed') {
    return (
      <button 
        className="w-full bg-[#FFDC50] border font-bold border-black h-[46px] font-Montserrat text-[18px] rounded-[10px] disabled:bg-opacity-30"
        disabled
      >
        Closed
      </button>
    );
  }



  if (!address) {
    return (
      <button 
        className="w-full bg-[#FFDC50] border border-black h-[46px] font-Montserrat text-[18px] rounded-[10px]"
        onClick={() => modal.open()}
      >
        Connect Wallet
      </button>
    );
  }

  switch (status) {
    case 'live':
      return (
        <button 
          className="w-full bg-[#FFDC50] font-bold border border-black h-[46px] font-Montserrat text-[18px] rounded-[10px]"
          onClick={onClick}
          disabled={loading}
        >
          {
        loading ? <div className='flex leading-[1] w-full items-center justify-center gap-2'><Loading />Minting...</div> : 'Mint Now'
          }
        </button>
      );
    case 'sold_out':
      return (
        <button 
          className="w-full bg-[#FFDC50] font-bold border border-black h-[46px] font-Montserrat text-[18px] rounded-[10px] disabled:bg-opacity-30"
          disabled
        >
          Sold Out
        </button>
      );
    default:
      return null;
  }
};

export default Button;