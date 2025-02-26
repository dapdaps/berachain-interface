"use client";

import Modal from "@/components/modal";
import Coupon from "../../../../components/airdrop/components/coupon";
import Card from "@/components/card";
import FeeRebateList from "./list";
import { useContext, useEffect } from 'react';
import { FeeRebaseContext } from '@/sections/dashboard/components/fee-rebate/context';

const FeeRebateModal = (props: any) => {
  const { isOpen, onClose } = props;

  const { userData, getList, clearSelected } = useContext(FeeRebaseContext);

  useEffect(() => {
    if (!isOpen) {
      clearSelected?.();
      return;
    }
    getList?.({ page: 1 });
  }, [isOpen]);

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
            value={userData?.available ?? 0}
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
