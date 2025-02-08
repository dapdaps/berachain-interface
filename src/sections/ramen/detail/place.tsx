import clsx from "clsx";
import { useMemo, useState } from "react";
import { numberFormatter } from "@/utils/number-formatter";
import TokenInput from "@/sections/ramen/detail/components/token-input";
import PriceRadio from "@/sections/ramen/detail/components/price-radio";
import useTokenBalance from "@/hooks/use-token-balance";
import useBuy from "../hooks/use-buy";
import AuctionButton from "./auction-button";
import Big from "big.js";

const PlaceYourBid = (props: any) => {
  const { className, auctionInfo, totalSupply, spendToken } = props;

  const [spendAmount, setSpendAmount] = useState<string>();
  const [tokenBidPrice, setTokenBidPrice] = useState<any>();
  const { buying, onBuy } = useBuy({
    amount: spendAmount,
    spendToken,
    tokenBidPrice
  });

  const onSpendAmount = (val: string) => {
    setSpendAmount(val);
  };

  const onTokenBidPrice = (val: string) => {
    setTokenBidPrice(val);
  };

  const amountErrorTips = useMemo(
    () =>
      spendAmount
        ? Big(spendAmount || 0).lt(
            auctionInfo?.encryptedMarginalPrice?.minBidSize
          )
          ? `Minimum spend amount is ${auctionInfo?.encryptedMarginalPrice?.minBidSize} BERA`
          : ""
        : "",
    [spendAmount, auctionInfo]
  );

  const priceErrorTips = useMemo(() => {
    if (!tokenBidPrice) return "";
    if (
      Big(tokenBidPrice || 0).lt(auctionInfo?.encryptedMarginalPrice?.minPrice)
    )
      return `Minimum bid price is ${auctionInfo?.encryptedMarginalPrice?.minPrice} BERA per token`;
    return "";
  }, [tokenBidPrice, auctionInfo]);

  return (
    <div className={clsx("mt-[21px]", className)}>
      <TokenInput
        className=""
        label={
          <div className="flex justify-between items-center">
            <div className="">Spend Amount</div>
            <div className="text-[#8D8D8D] text-[12px] font-[500] leading-[90%]">
              Min:&nbsp;
              <span className="text-black">
                {auctionInfo?.encryptedMarginalPrice?.minBidSize}{" "}
              </span>
            </div>
          </div>
        }
        value={spendAmount}
        onChange={onSpendAmount}
        token={spendToken}
        errorMsg={amountErrorTips}
      />
      <TokenInput
        className="mt-[20px]"
        label={
          <div className="flex justify-between items-center">
            <div className="">Bid Price per Token</div>
            <div className="text-[#8D8D8D] text-[12px] font-[500] leading-[90%]">
              Min:&nbsp;
              <span className="text-black">
                {numberFormatter(
                  auctionInfo?.encryptedMarginalPrice?.minPrice,
                  4,
                  true
                )}
              </span>
            </div>
          </div>
        }
        value={tokenBidPrice}
        onChange={onTokenBidPrice}
        token={spendToken}
        errorMsg={priceErrorTips}
        suffix={
          <div className="">
            <div className="text-black text-[14px] font-[500]">
              Price based on FDV (USD):
            </div>
            <PriceRadio
              className="mt-[15px]"
              value={tokenBidPrice}
              auctionInfo={auctionInfo}
              onChange={(item: any) => {
                onTokenBidPrice(item.price);
              }}
            />
          </div>
        }
      />
      <div className="mt-[20px]">
        <div className="flex items-start justify-between gap-[5px]">
          <div className=" text-black text-[14px] font-[500] leading-[90%]">
            Estimated FDV at your Bid Price
          </div>
          <div className="flex flex-col items-end gap-[5px] font-Montserrat text-black text-[14px] font-[600] leading-[90%]">
            <div className="">{numberFormatter("1562500", 2, true)} BERA</div>
            <div className="text-[#8D8D8D] font-[500]">
              {numberFormatter(
                Big(totalSupply || 0)
                  .mul(
                    tokenBidPrice ||
                      auctionInfo?.encryptedMarginalPrice?.minPrice || 0
                  )
                  .toString(),
                2,
                true,
                {
                  isShort: true,
                  isShortUppercase: true,
                  prefix: "$"
                }
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-[17px]">
        <AuctionButton
          errorTips=""
          disabled={
            !spendAmount || !tokenBidPrice || amountErrorTips || priceErrorTips
          }
          loading={buying}
          onClick={() => {
            onBuy();
          }}
        />
      </div>
    </div>
  );
};

export default PlaceYourBid;
