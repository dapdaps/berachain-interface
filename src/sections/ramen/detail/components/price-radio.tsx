import clsx from "clsx";
import { numberFormatter } from "@/utils/number-formatter";
import { useMemo } from "react";
import { usePriceStore } from "@/stores/usePriceStore";
import Big from "big.js";

const PriceRadio = (props: any) => {
  const { className, onChange, value, auctionInfo } = props;
  const { price } = usePriceStore();

  const fdvs = useMemo(() => {
    if (!auctionInfo) return [];
    const minFdv = Big(auctionInfo.encryptedMarginalPrice?.minPrice ?? 0)
      .mul(auctionInfo.baseToken.totalSupply)
      .div(10 ** auctionInfo.baseToken.decimals);
    const beraPrice = price["BERA"];
    return [2, 5, 7, 10].map((item) => ({
      usd: minFdv.mul(item).mul(beraPrice).toString(),
      bera: minFdv.mul(item).toString(),
      price: Big(auctionInfo.encryptedMarginalPrice?.minPrice ?? 0)
        .mul(item)
        .toString()
    }));
  }, [auctionInfo, price]);

  return (
    <div
      className={clsx("font-Montserrat flex items-center gap-[8px]", className)}
    >
      {fdvs.map((item: any, index: number) => (
        <button
          key={index}
          type="button"
          className={clsx(
            "border border-[#373A53] rounded-[6px] h-[22px] flex justify-center items-center px-[8px] text-black text-[14px] font-[400] leading-[100%] transition-all duration-150 hover:bg-[#FFDC50]",
            value === item.price ? "bg-[#FFDC50]" : ""
          )}
          onClick={() => {
            if (value !== item.price) {
              onChange(item);
              return;
            }
          }}
        >
          {numberFormatter(item.usd, 2, true, { isShort: true, isShortUppercase: true })}
        </button>
      ))}
    </div>
  );
};

export default PriceRadio;
