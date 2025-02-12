import clsx from 'clsx';
import Loading from '@/components/loading';

const Button = (props: Props) => {
  const { children, className, type = ButtonType.Normal, onClick, disabled, loading } = props;

  return (
    <button
      type="button"
      className={clsx(
        'disabled:!cursor-not-allowed transition-all duration-150 border border-black h-[50px] flex justify-center items-center gap-[10px] shadow-[6px_6px_0px_0px_rgba(0,_0,_0,_0.25)] rounded-[10px] font-Montserrat font-[700] text-[16px] text-black md:text-[14px] md:font-[600]',
        className,
        getButtonTypeStyle(type)
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {loading && (<Loading size={16} />)}
      <div>{children}</div>
    </button>
  );
};

export default Button;

interface Props {
  children: any;
  className?: string;
  type?: ButtonType;
  disabled?: boolean;
  loading?: boolean;
  onClick?(): void;
}

const getButtonTypeStyle = (type: ButtonType) => {
  if (type === ButtonType.Primary) return 'bg-[#FFDC50] disabled:bg-[#f7e596] disabled:text-[#79776f] disabled:border-[#79776f]';
  return 'bg-[#FFFDEB] disabled:bg-[#d0d0d0] disabled:text-[#79776f] disabled:border-[#79776f]';
};

export enum ButtonType {
  Normal = 'normal',
  Primary = 'primary',
}
