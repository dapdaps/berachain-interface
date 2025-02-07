import clsx from 'clsx';
import { useRouter } from 'next/navigation';

const Back = (props: any) => {
  const { className, onBack } = props;

  const router = useRouter();

  const onClick = () => {
    if (typeof onBack === 'function') {
      onBack();
      return;
    }
    router.back();
  };

  return (
    <button type="button" className={clsx('cursor-pointer w-[34px] h-[34px]', className)} onClick={onClick}>
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="0.5" width="33" height="33" rx="10.5" fill="white" stroke="#373A53" />
        <path d="M20 11L15.2 17L20 23" stroke="black" stroke-width="3" stroke-linecap="round" />
      </svg>
    </button>
  );
};

export default Back;
