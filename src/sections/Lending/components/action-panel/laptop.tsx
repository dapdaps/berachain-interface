import { Props } from './index';
import ActionPanelForm from './form';

const ActionPanelLaptop = (props: Props) => {
  const {
    title,
    style,
    className,
  } = props;

  return (
    <div style={style} className={`w-[302px] ${getCardStyles(props)} border border-black rounded-[20px] bg-[#FFFDEB] shadow-shadow1 p-[23px_20px_20px] ${className}`}>
      <div className="text-[16px] font-[600] leading-[90%]">{title}</div>
      <ActionPanelForm {...props} />
    </div>
  );
};

export default ActionPanelLaptop;

const getCardStyles = (props: any) => {
  const { isReachedSupplyCap, isLimit } = props;

  if (isLimit) return 'h-[254px]';
  if (isReachedSupplyCap) return 'h-[200px]';
  return 'h-[159px]';
};
