"use client";

import Modal from "@/components/modal";
import Coupon from "../../../../components/airdrop/components/coupon";
import Card from "@/components/card";
import FeeRebateList from "./list";

const FeeRebateModal = (props: any) => {
  const { isOpen, onClose, value } = props;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
    >
      <Card className="!p-[26px_24px_23px] !rounded-[20px] w-[650px]">
        <div className="flex items-center gap-[13px]">
          <div className="text-black font-Montserrat text-[20px] font-bold leading-[90%]">
            Fee Rebate
          </div>
          <Coupon 
            value={value}
            label="Fee Rebate"
            className=""
          />
        </div>
        <FeeRebateList className="mt-[43px]" />
      </Card>
    </Modal>
  );
};

export default FeeRebateModal;
