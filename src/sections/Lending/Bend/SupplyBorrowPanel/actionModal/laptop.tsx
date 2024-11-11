import { forwardRef } from "react";
import { IProps } from '@/sections/Lending/Bend/SupplyBorrowPanel/actionModal/index';
import ActionForm from '@/sections/Lending/Bend/SupplyBorrowPanel/actionModal/form';

const ActionLaptop = forwardRef<HTMLDivElement, IProps>(
  (props: IProps, ref) => {
    const { action, className, isOpen } = props;

    const isBorrow = action === "borrow";

    if (!isOpen) return null;

    return (
      <div className={`${className}`} ref={ref}>
        <div className="w-[302px] h-[160px] bg-[#FFFDEB] shadow-shadow1 border border-black rounded-[20px] p-5">
          <h2 className="font-Montserrat text-base font-semibold leading-[14.4px] text-left mb-[18px]">
            {isBorrow ? "Borrow" : "Repay"}
          </h2>
          <ActionForm {...props} />
        </div>
      </div>
    );
  }
);

export default ActionLaptop;
