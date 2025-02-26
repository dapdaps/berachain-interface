"use client";

import clsx from "clsx";
import Coupon from "../../../../components/airdrop/components/coupon";
import { useState } from "react";
import FeeRebateModal from "./modal";
import { useFeeRebate } from '@/sections/dashboard/components/fee-rebate/hooks';
import { FeeRebaseContext } from '@/sections/dashboard/components/fee-rebate/context';

const FeeRebate = (props: any) => {
  const { className } = props;

  const feeRebate = useFeeRebate();

  const [visible, setVisible] = useState(false);

  return (
    <FeeRebaseContext.Provider value={feeRebate}>
      <button
        type="button"
        disabled={feeRebate.userDataLoading}
        className={clsx('disabled:opacity-50 disabled:cursor-not-allowed', className)}
        onClick={() => {
          setVisible(true);
        }}
      >
        <Coupon
          label="Fee Rebate"
          value={feeRebate.userData?.available ?? 0}
          loading={feeRebate.userDataLoading}
        />
      </button>
      <FeeRebateModal
        isOpen={visible}
        onClose={() => {
          setVisible(false);
        }}
      />
    </FeeRebaseContext.Provider>
  );
};

export default FeeRebate;
