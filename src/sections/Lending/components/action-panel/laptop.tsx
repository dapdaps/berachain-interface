import { Props } from './index';
import ActionPanelForm from './form';

const ActionPanelLaptop = (props: Props) => {
  const {
    title,
    style,
    className,
    token,
    actionText,
  } = props;

  const isLimit = ['BERA', 'WBERA'].includes(token.symbol) && actionText === 'Deposit';

  return (
    <div style={style} className={`w-[302px] ${isLimit ? 'h-[254px]' : 'h-[159px]'} border border-black rounded-[20px] bg-[#FFFDEB] shadow-shadow1 p-[23px_20px_20px] ${className}`}>
      <div className="text-[16px] font-[600] leading-[90%]">{title}</div>
      <ActionPanelForm {...props} isLimit={isLimit} />
    </div>
  );
};

export default ActionPanelLaptop;
