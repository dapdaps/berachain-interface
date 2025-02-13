"use client";

import clsx from "clsx";
import Coupon from "../../../../components/airdrop/components/coupon";
import { useState } from "react";
import FeeRebateModal from "./modal";

const FeeRebate = (props: any) => {
  const { className, value } = props;

  const [visible, setVisible] = useState(false);

  return (
    <>
      <button
        type="button"
        className={clsx('', className)}
        onClick={() => {
          setVisible(true);
        }}
      >
        <Coupon
          label="Fee Rebate"
          value={value}
        />
      </button>
      <FeeRebateModal
        isOpen={visible}
        value={value}
        onClose={() => {
          setVisible(false);
        }}
      />
    </>
  );
};

export default FeeRebate;
