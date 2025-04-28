import clsx from 'clsx';
import Button from '@/components/button';
import LazyImage from '@/components/layz-image';
import { bera } from '@/configs/tokens/bera';
import { numberFormatter } from '@/utils/number-formatter';

const BerapawMintRewards = (props: any) => {
  const { className, onMint, minting, approved, disabled, estimateMintLBGT } = props;

  return (
    <div className={clsx("", className)}>
      <div className="text-[18px] font-Montserrat font-bold leading-[90%] text-black">
        <div className="flex-1">Step 3. Mint Rewards</div>
        <div className="mt-[15px] flex justify-between items-center text-black font-Montserrat text-[16px] font-[600] leading-[100%]">
          <div className="flex items-center gap-[4px]">
            <LazyImage
              src={bera["lbgt"].icon}
              width={34}
              height={34}
              containerClassName="shrink-0 rounded-full overflow-hidden"
            />
            <div className="">
              {bera["lbgt"].symbol}
            </div>
          </div>
          <div className="">
            {numberFormatter(estimateMintLBGT, 2, true, { isShort: true, isShortUppercase: true })}
          </div>
        </div>
        <Button
          type="primary"
          onClick={onMint}
          disabled={minting || !approved || disabled}
          loading={minting}
          className="shrink-0 !h-[50px] mt-[20px] w-full"
        >
          Mint
        </Button>
      </div>
    </div>
  );
};

export default BerapawMintRewards;
