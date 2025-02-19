import { FC } from 'react';
import { useCountDown } from '../hooks/use-count-down';
import { MintStatus } from '../types';
import { useAccount, useSwitchChain } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import Loading from '@/components/loading';
import { DEFAULT_CHAIN_ID } from '@/configs';

interface MintButtonProps {
  status: MintStatus;
  timestamp?: number;
  onClick?: () => void;
  loading?: boolean;
  onCountdownEnd?: () => void;
}

const Button: FC<MintButtonProps> = ({ 
  status, 
  timestamp,
  onClick,
  loading,
  onCountdownEnd
}) => {
  console.log(status, '<++=====currentGroup')
    const { address, chainId } = useAccount();
    const modal = useAppKit();

    const { isPending, switchChain } = useSwitchChain();

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


  if (DEFAULT_CHAIN_ID !== chainId) {
    return (
      <button 
      disabled={isPending || loading}
      className="w-full bg-[#FFDC50] border border-black h-[46px] font-Montserrat text-[18px] rounded-[10px]"
      onClick={() => switchChain({
        chainId: DEFAULT_CHAIN_ID,
      })}
    >
      Switch Network
    </button>
    )
  }
  


  if (status === 'upcoming') {
    console.log(timestamp, 'timestamp')
    return <RenderCountDown timestamp={timestamp} onCountdownEnd={onCountdownEnd} />
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


const RenderCountDown = ({
  timestamp,
  onCountdownEnd
}: {
  timestamp?: number
  onCountdownEnd?: () => void
}) => {

  if (!timestamp) {
    return null;
  }

  const countdown = useCountDown({
    targetTimestamp: timestamp || 0,
    format: ' DDd HHh mmm sss',
    onEnd: onCountdownEnd
  });

  return (
    <button 
      className="w-full bg-[#FFDC50] border font-bold border-black h-[46px] font-Montserrat text-[18px] rounded-[10px] disabled:bg-opacity-30"
      disabled
    >
      {countdown}
    </button>
  );
}