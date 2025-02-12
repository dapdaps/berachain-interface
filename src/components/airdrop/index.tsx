import clsx from 'clsx';
import { useAirdrop } from '@/hooks/use-airdrop';

const Airdrop = (props: any) => {
  const { className, disabled } = props;

  const { handleVisible } = useAirdrop();

  return (
    <button
      type="button"
      disabled={disabled}
      className={clsx('fixed block z-[1] left-[calc(50%_+_150px)] top-[230px] disabled:opacity-50 disabled:!cursor-not-allowed', className)}
      onClick={() => {
        handleVisible(true);
      }}
    >
      <img
        src="/images/home-earth/airdrop/entry.2x.png"
        alt=""
        className="animate-shake3 w-[232px] h-[200px] pointer-events-none"
        style={{
          animationDuration: '10s',
          transformOrigin: 'center bottom',
          animationTimingFunction: 'ease-in-out',
        }}
      />
    </button>
  );
};

export default Airdrop;
