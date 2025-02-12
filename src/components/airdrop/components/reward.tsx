import clsx from 'clsx';
import AirdropButton from '@/components/airdrop/components/button';
import { numberFormatter } from '@/utils/number-formatter';

const AirdropReward = (props: any) => {
  const { className, children } = props;

  return (
    <div className={clsx('flex flex-col items-center gap-[10px]', className)}>
      <img src="/images/home-earth/airdrop/coin-bera.svg" alt="" className="w-[70px] h-[70px] object-contain pointer-events-none" />
      <div className="flex items-end justify-center gap-[9px]">
        <div className="text-[#FFDC50] text-[32px] font-[400] leading-[90%] font-CherryBomb text-stroke-2-black">
          {numberFormatter(children, 2, true)}
        </div>
        <div className="text-black text-[16px] font-[400] leading-[90%] font-CherryBomb">
          $BERA
        </div>
      </div>
      <AirdropButton
        className="w-[220px] mt-[19px]"
        onClick={() => {}}
      >
        Share on X
      </AirdropButton>
    </div>
  );
};

export default AirdropReward;
