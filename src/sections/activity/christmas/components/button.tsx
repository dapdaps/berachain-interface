import ArrowHandled from '@public/images/icon-arrow-handled.svg';
import GiftBox from '@public/images/activity/christmas/icon-gift-box.svg';
import { useMemo } from 'react';

const Button = (props: Props) => {
  const {
    children,
    className,
    style,
    type = 'primary',
    addon,
    onClick,
  } = props;

  const TypeStyle = useMemo(() => {
    let str = ['bg-[#FFDC50]', 'text-black', 'border-black'];
    if (type === 'black') {
      str = ['bg-black', 'text-[#FFDC50]', 'border-[#FFDC50]'];
    }
    if (addon) {
      str.push('gap-[10px]');
    }
    return str.join(' ');
  }, [type, addon]);

  return (
    <button
      type="button"
      className={`relative flex justify-center items-center h-[50px] rounded-[10px] px-[27px] shadow-[6px_6px_0px_0px_rgba(0,_0,_0,_0.25)] border text-[18px] font-[600] ${TypeStyle} ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
      {
        addon === 'arrow' && (
          <ArrowHandled />
        )
      }
      {
        addon === 'gift' && (
          <GiftBox />
        )
      }
    </button>
  );
};

export default Button;

export type ButtonType = 'primary' | 'black';

export type ButtonAddon = 'arrow' | 'gift';

interface Props {
  children: any;
  className?: string;
  style?: React.CSSProperties;
  type?: ButtonType;
  addon?: ButtonAddon;
  onClick?(): void;
}
