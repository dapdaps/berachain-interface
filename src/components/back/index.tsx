'use client';

import { useProgressRouter } from '@/hooks/use-progress-router';

const PageBack = (props: Props) => {
  const { className, style, isBlack = true, onBack } = props;

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
        className={`flex items-center gap-[14px] ${
          isBlack ? 'text-black' : 'text-white'
        } text-center font-CherryBomb text-[20px] font-[400] hidden lg:flex ${className}`}
        style={style}
        onClick={handleClick}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='27'
          height='16'
          viewBox='0 0 27 16'
          fill='none'
          className='translate-y-[2px]'
        >
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M11.756 14.97a1 1 0 0 1-1.593.804L.683 8.791a1 1 0 0 1 0-1.61l9.48-6.984a1 1 0 0 1 1.593.805v2.347a1 1 0 0 0 1 1H26a1 1 0 0 1 1 1v4.713a1 1 0 0 1-1 1H12.756a1 1 0 0 0-1 1v2.907z'
            fill={isBlack ? '#000' : '#fff'}
          />
        </svg>
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
