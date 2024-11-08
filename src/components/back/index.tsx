'use client';

import { useProgressRouter } from '@/hooks/use-progress-router';
import IconBack from '@public/images/icon-back.svg';
const PageBack = (props: Props) => {
  const { className, style, onBack } = props;

  const router = useProgressRouter();

  const handleClick = () => {
    if (onBack) {
      onBack();
      return;
    }
    router.back();
  };

  return (
    <>
      <button
        type='button'
        className={`flex items-center gap-[14px] text-center font-CherryBomb text-[20px] text-black font-[400] hidden lg:flex ${className}`}
        style={style}
        onClick={handleClick}
      >
        <IconBack
          width={27}
          height={16}
          className='translate-y-[2px]'
        />

        <span>back</span>
      </button>
      <button
        type='button'
        className={`w-[40px] h-[32px] rounded-[16px] bg-[#FFF5A9] items-center justify-center border border-black hidden md:flex ${className}`}
        onClick={handleClick}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='9'
          height='16'
          viewBox='0 0 9 16'
          fill='none'
        >
          <path
            d='M7 14L2 8L7 2'
            stroke='black'
            strokeWidth='3'
            strokeLinecap='round'
          />
        </svg>
      </button>
    </>
  );
};

export default PageBack;

interface Props {
  className?: string;
  style?: React.CSSProperties;
  isBlack?: boolean;
  onBack?(): void;
}
