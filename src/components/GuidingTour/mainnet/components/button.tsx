import clsx from 'clsx';

const Button = (props: Props) => {
  const { children, className, type = ButtonType.Normal, onClick, disabled } = props;

  return (
    <button
      type="button"
      className={clsx(
        'border border-black h-[50px] flex justify-center items-center shadow-[6px_6px_0px_0px_rgba(0,_0,_0,_0.25)] rounded-[10px] font-Montserrat font-[700] text-[16px] text-black',
        className,
        getButtonTypeStyle(type)
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;

interface Props {
  children: any;
  className?: string;
  type?: ButtonType;
  disabled?: boolean;
  onClick?(): void;
}

const getButtonTypeStyle = (type: ButtonType) => {
  if (type === ButtonType.Primary) return 'bg-[#FFDC50]';
  return 'bg-[#FFFDEB]';
};

export enum ButtonType {
  Normal = 'normal',
  Primary = 'primary',
}
