import clsx from 'clsx';
import LazyImage from '@/components/layz-image';
import InputNumber from '@/components/input-number';
import { useState } from 'react';
import { numberFormatter } from '@/utils/number-formatter';
import { useVaultsV2Context } from '@/sections/vaults/v2/context';
import ClaimModal from '@/sections/vaults/v2/components/claim/modal';
import Loading from '@/components/loading';

const Claim = (props: any) => {
  const { className } = props;

  const { toggleClaimSuccessVisible, toggleClaimVisible } = useVaultsV2Context();

  const [claiming, setClaiming] = useState(false);

  const handleClaim = () => {
    if (claiming) return;
    setClaiming(true);
    setTimeout(() => {
      setClaiming(false);
      toggleClaimSuccessVisible(true);
      toggleClaimVisible(false);
    }, 1000);
  };

  return (
    <div
      className={clsx(
        "text-black font-Montserrat text-[18px] font-semibold leading-[90%]",
        className
      )}
    >
      <div className="">
        Claim Rewards
      </div>
      <div className="mt-[30px] flex flex-col items-center">
        <LazyImage src="/images/icon-coin.svg" width={36} height={36} containerClassName="shrink-0 rounded-full overflow-hidden" />
        <div className="mt-[15px] text-[20px] font-[600]">
          0.45 BGT
        </div>
        <div className="mt-[5px] text-[16px] font-[500]">
          +$2.99
        </div>
      </div>
      <button
        type="button"
        disabled={false}
        className="w-full mt-[20px] flex justify-center items-center gap-[10px] disabled:opacity-30 disabled:!cursor-not-allowed h-[50px] rounded-[10px] border border-[#000] bg-[#FFDC50] text-[#000] text-center font-Montserrat text-[16px] font-semibold leading-normal"
        onClick={handleClaim}
      >
        {
          claiming && (
            <Loading size={16} />
          )
        }
        <div className="">
          Claim
        </div>
      </button>
    </div>
  );
};

export default Claim;
