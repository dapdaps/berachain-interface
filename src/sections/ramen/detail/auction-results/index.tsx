import clsx from "clsx";
import LabelItem from "@/sections/ramen/detail/components/label-item";
import { numberFormatter } from "@/utils/number-formatter";
import Big from "big.js";
import { use, useMemo } from "react";

const AuctionResults = (props: any) => {
  const { className, detail, auctionInfo, totalSupply } = props;
  const finalPrice = useMemo(
    () => auctionInfo?.encryptedMarginalPrice?.marginalPrice || 0,
    [auctionInfo]
  );
  const avgSpend = useMemo(() => {
    if (!detail?.bidSubmitted) return 0;
    return Big(auctionInfo?.purchased || 0)
      .div(detail?.bidSubmitted)
      .toString();
  }, [detail, auctionInfo]);

  const precent = useMemo(() => {
    if (
      !auctionInfo.encryptedMarginalPrice?.minPrice ||
      !auctionInfo.encryptedMarginalPrice?.marginalPrice
    )
      return;
    const diff = Big(auctionInfo.encryptedMarginalPrice?.marginalPrice).minus(
      auctionInfo.encryptedMarginalPrice?.minPrice
    );
    return diff
      .div(auctionInfo.encryptedMarginalPrice?.minPrice)
      .mul(100)
      .toFixed(0);
  }, [auctionInfo]);
  return (
    <div className={clsx("mt-[16px]", className)}>
      <div className="grid grid-cols-2 gap-[30px]">
        <LabelItem label="Final FDV">
          {numberFormatter(
            Big(totalSupply).mul(finalPrice).toString(),
            2,
            true
          )}{" "}
          BERA
        </LabelItem>
        <LabelItem label="Avg. Spend Amount">
          {numberFormatter(avgSpend, 2, true)} BERA
        </LabelItem>
        <LabelItem label="Total Riased">
          {numberFormatter(auctionInfo?.purchased || 0, 2, true)} BERA
        </LabelItem>
        <LabelItem label="Final Price per Token">
          <div className="flex items-end gap-[8px] w-full">
            <div className="flex-1 w-0 overflow-hidden text-ellipsis">
              {numberFormatter(finalPrice, 2, true)} BERA
            </div>
            <div className="text-[#7EA82B] text-[12px] leading-[100%] shrink-0">
              +{precent}%
            </div>
          </div>
        </LabelItem>
      </div>
    </div>
  );
};

export default AuctionResults;
