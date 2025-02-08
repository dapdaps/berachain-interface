import clsx from "clsx";
import LabelItem from "@/sections/ramen/detail/components/label-item";
import { numberFormatter } from "@/utils/number-formatter";
import { useMemo } from "react";
import Big from "big.js";

const TokenLaunchDetails = (props: any) => {
  const { className, detail, minBidPrice } = props;
  const fdv = useMemo(() => {
    if (!minBidPrice) return 0;
    return Big(minBidPrice).mul(detail.totalSupply).toString();
  }, [detail, minBidPrice]);
  return (
    <div
      className={clsx(
        "grid grid-cols-3 gap-[35px] mt-[21px] pb-[13px]",
        className
      )}
    >
      <LabelItem label="Total Supply">
        {numberFormatter(detail.totalSupply, 2, true)} GAYMEN
      </LabelItem>
      <LabelItem label="Auctioned Supply">
        {numberFormatter(detail.auctionedSupply, 2, true)} BERA
      </LabelItem>
      <LabelItem label="Min. Bid Price">
        {numberFormatter(minBidPrice, 4, true)} BERA
      </LabelItem>
      <LabelItem label="Min. FDV">
        {numberFormatter(fdv, 2, true)} BERA
      </LabelItem>
    </div>
  );
};

export default TokenLaunchDetails;
