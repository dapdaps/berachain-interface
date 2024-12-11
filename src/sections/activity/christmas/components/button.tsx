import ArrowHandled from '@public/images/icon-arrow-handled.svg';
import GiftBox from '@public/images/activity/christmas/icon-gift-box.svg';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import CircleLoading from '@/components/circle-loading';

const Button = (props: Props) => {
  const {
    children,
    className,
    style,
    type = 'primary',
    addon,
    onClick,
    motionProps,
    disabled,
    loading,
  } = props;

  const TypeStyle = useMemo(() => {
    let str = ['bg-[#FFDC50]', 'text-black', 'border-black'];
    if (disabled) {
      str = ['bg-[#fae8a1]', 'text-[#999]', 'border-[#999]'];
    }
    if (type === 'black') {
      str = ['bg-black', 'text-[#FFDC50]', 'border-[#FFDC50]'];
      if (disabled) {
        str = ['bg-[#999]', 'text-[#fae8a1]', 'border-[#fae8a1]'];
      }
    }
    if (addon) {
      str.push('gap-[10px]');
    }

    return str.join(' ');
  }, [type, addon, disabled]);

  return (
    <motion.button
      type="button"
      disabled={disabled}
      className={`relative flex justify-center items-center disabled:!cursor-not-allowed h-[50px] rounded-[10px] px-[27px] shadow-[6px_6px_0px_0px_rgba(0,_0,_0,_0.25)] border text-[18px] font-[600] ${TypeStyle} ${className}`}
      style={style}
      onClick={onClick}
      {...motionProps}
    >
      {loading ? (<CircleLoading size={14} />) : children}
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
    </motion.button>
  );
};

export default Button;

export type ButtonType = 'primary' | 'black';

export type ButtonAddon = 'arrow' | 'gift';

interface Props {
  children: any;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  style?: React.CSSProperties;
  type?: ButtonType;
  addon?: ButtonAddon;
  motionProps?: any,
  onClick?(): void;
}
