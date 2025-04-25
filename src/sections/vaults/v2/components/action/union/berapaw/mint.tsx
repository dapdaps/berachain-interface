import clsx from 'clsx';
import Button from '@/components/button';

const BerapawMintRewards = (props: any) => {
  const { className, onMint, minting, approved, disabled } = props;

  return (
    <div className={clsx("", className)}>
      <div className="text-[18px] font-Montserrat font-bold leading-[90%] text-black">
        <div className="flex-1">Step 3. Mint Rewards</div>
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
