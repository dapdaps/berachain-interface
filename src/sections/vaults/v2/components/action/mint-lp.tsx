import clsx from 'clsx';
import Range from '@/components/range';

const ActionMintLP = (props: any) => {
  const { className, toggleOpenAddLp } = props;

  return (
    <div className={clsx("flex justify-center items-center gap-[4px] text-[#000] text-right font-Montserrat text-[14px] font-semibold leading-normal", className)}>
      <button
        type="button"
        className="underline underline-offset-2"
        onClick={() => {
          toggleOpenAddLp(true);
        }}
      >
        Mint LP
      </button>
      <div>first</div>
    </div>
  )
};

export default ActionMintLP;
