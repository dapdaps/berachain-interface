import { forwardRef  } from "react";
import { IProps } from '@/sections/Lending/Bend/Action/index';
import ActionPanelForm from '@/sections/Lending/Bend/Action/form';

const ActionPanelLaptop = forwardRef<HTMLDivElement, IProps>(
  (props: IProps, ref) => {
    const { action, token, className } = props;

    const isDeposit = action === "deposit" || action === "supply";

    return (
      <div className={`${className}`} ref={ref}>
        <div className="w-[302px] h-min-[160px] bg-[#FFFDEB] shadow-shadow1 border border-black rounded-[20px] p-5">
          <h2 className="font-Montserrat text-base font-semibold leading-[14.4px] text-left mb-[18px]">
            {isDeposit ? action === 'supply' ? 'Supply' : 'Deposit' : "Withdraw"}
          </h2>
          <ActionPanelForm {...props} />
        </div>
      </div>
    );
  }
);

export default ActionPanelLaptop;
