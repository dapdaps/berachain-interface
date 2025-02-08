import clsx from 'clsx';
import { bera } from '@/configs/tokens/bera';
import { useState } from 'react';
import { numberFormatter } from '@/utils/number-formatter';
import TokenInput from '@/sections/ramen/detail/components/token-input';
import PriceRadio from '@/sections/ramen/detail/components/price-radio';

const PlaceYourBid = (props: any) => {
  const { className } = props;

  const spendToken = bera.bera;

  const [spendAmount, setSpendAmount] = useState<string>();
  const [tokenBidPrice, setTokenBidPrice] = useState<string>();
  const [FDV, setFDV] = useState<string>();

  const onSpendAmount = (val: string) => {
    setSpendAmount(val);
  };

  const onTokenBidPrice = (val: string) => {
    setTokenBidPrice(val);
  };

  const onFDV = (val: string) => {
    setFDV(val);
  };

  const onAuction = () => {};

  return (
    <div className={clsx('mt-[21px]', className)}>
      <TokenInput
        className=""
        label={(
          <div className="flex justify-between items-center">
            <div className="">
              Spend Amount
            </div>
            <div className="text-[#3D405A] text-[12px] font-[400] leading-[90%]">
              Min:&nbsp;
              <span className="">
                {numberFormatter('25', 4, true)} {spendToken.symbol}
              </span>
            </div>
          </div>
        )}
        value={spendAmount}
        onChange={onSpendAmount}
        token={spendToken}
        balance={'12.33'}
      />
      <TokenInput
        className="mt-[20px]"
        label={(
          <div className="flex justify-between items-center">
            <div className="">
              Bid Price per Token
            </div>
            <div className="text-[#3D405A] text-[12px] font-[400] leading-[90%]">
              Min:&nbsp;
              <span className="">
                {numberFormatter('0.0016', 4, true)} {spendToken.symbol}
              </span>
            </div>
          </div>
        )}
        value={tokenBidPrice}
        onChange={onTokenBidPrice}
        token={spendToken}
      />
      <div className="mt-[20px]">
        <div className="text-black text-[16px] font-[600]">
          Price based on FDV (USD):
        </div>
        <PriceRadio
          className="mt-[10px]"
          value={FDV}
          onChange={onFDV}
        />
      </div>
      <div className="mt-[20px]">
        <div className="flex items-center justify-between gap-[10px]">
          <div className=" text-black text-[12px] font-[500] leading-[90%]">
            Estimated FDV at your Bid Price
          </div>
          <div className="flex items-center gap-[5px] font-Montserrat text-black text-[12px] font-[600] leading-[90%]">
            <div className="">
              {numberFormatter('1562500', 2, true)} BERA
            </div>
            <div className="text-[#3D405A] font-[500]">
              {numberFormatter('12516400', 2, true, { isShort: true, prefix: '$' })}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-[20px]">
        <button
          type="button"
          className="w-full border border-black rounded-[10px] bg-[#FFDC50] h-[46px] flex justify-center items-center"
          onClick={onAuction}
        >
          Auction
        </button>
      </div>
    </div>
  );
};

export default PlaceYourBid;
