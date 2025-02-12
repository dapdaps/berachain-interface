import clsx from 'clsx';
import { useAirdropStore } from '@/stores/use-airdrop';

const Airdrop = (props: any) => {
  const { className, disabled } = props;

  const { setVisible } = useAirdropStore();

  return (
    <button
      type="button"
      disabled={disabled}
      className={clsx('fixed block z-[1] right-0 translate-y-[50px] disabled:opacity-50 disabled:!cursor-not-allowed', className)}
      onClick={() => {
        setVisible(true);
      }}
    >
      <img
        src="/images/home-earth/airdrop/entry.2x.png"
        alt=""
        className="animate-shake3 w-[232px] h-[200px]"
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
