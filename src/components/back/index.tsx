'use client';

import { useRouter } from 'next/navigation';

const PageBack = (props: Props) => {
  const { className, style, onBack } = props;

  const router = useRouter();

  const handleClick = () => {
    if (onBack) {
      onBack();
      return;
    }
    router.back();
  };

  return (
    <button
      type="button"
      className={`flex items-center gap-[14px] text-black text-center font-CherryBomb text-[20px] font-[400] ${className}`}
      style={style}
      onClick={handleClick}
    >
      <img src="/images/icon-back.svg" alt="back" width={27} height={16} className="translate-y-[2px]" />
      <span>back</span>
    </button>
  );
};

export default PageBack;

interface Props {
  className?: string;
  style?: React.CSSProperties;

  onBack?(): void;
}
