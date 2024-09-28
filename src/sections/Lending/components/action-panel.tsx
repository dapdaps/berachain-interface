import Button from '@/components/button';

const ActionPanel = (props: Props) => {
  const { title, style, className, actionText, placeholder, disabled, loading, inputDisabled } = props;

  return (
    <div style={style} className={`w-[302px] h-[159px] border border-black rounded-[20px] bg-[#FFFDEB] shadow-shadow1 p-[23px_20px_20px] ${className}`}>
      <div className="text-[16px] font-[600] leading-[90%]">{title}</div>
      <div className="mt-[17px]">
        <input type="text" placeholder={placeholder} disabled={inputDisabled} className="w-full h-[40px] outline-[#FFDC50] leading-[38px] rounded-[12px] border border-[#373A53] bg-white text-[16px] font-[600] px-[10px]" />
      </div>
      <div className="flex justify-between items-center mt-[13px]">
        <div className="text-[14px] font-[400] text-black">Balance: <a href="javascript: void(0);" className="underline decoration-solid">0.00</a></div>
        <Button type="primary" disabled={disabled} loading={loading} style={{ fontSize: 14 }}>{actionText}</Button>
      </div>
    </div>
  );
};

export default ActionPanel;

interface Props {
  title: string;
  actionText: string;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  inputDisabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
}
