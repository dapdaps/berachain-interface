import { motion } from "framer-motion";
import CircleLoading from '@/components/circle-loading';

const Button = (props: Props) => {
  const { onClick, type, disabled, loading, isOnlyLoading, className, style, htmlType = 'button', children } = props;

  return (
    <motion.button
      className={`h-[32px] px-[10.5px] leading-[30px] border border-[#373A53] rounded-[10px] text-center text-[16px] font-[500] text-black disabled:opacity-30 disabled:cursor-not-allowed ${loading ? 'opacity-30' : ''} ${className}`}
      style={{
        background: type === 'primary' ? '#FFDC50' : '#ffffff',
        ...style,
      }}
      disabled={disabled}
      type={htmlType}
      whileHover={{
        background: '#FFDC50',
      }}
      onClick={onClick}
    >
      {
        isOnlyLoading ? (
          loading ? (<CircleLoading size={14} />) : children
        ) : (
          loading ? (<div className="flex justify-center items-center gap-[5px]"><CircleLoading size={14} />{children}</div>) : children
        )
      }
    </motion.button>
  );
};

export default Button;

interface Props {
  disabled?: boolean;
  loading?: boolean;
  type?: 'default' | 'primary';
  htmlType?: 'button' | 'submit' | 'reset';
  children: any;
  style?: React.CSSProperties;
  className?: string;
  isOnlyLoading?: boolean;
  onClick?(): void;
}
