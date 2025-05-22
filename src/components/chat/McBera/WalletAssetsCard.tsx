import { useMemo } from 'react';
import LazyImage from '@/components/layz-image';
import { numberFormatter } from '@/utils/number-formatter';
import clsx from 'clsx';
import Big from 'big.js';
import { getTokenLogo } from '@/sections/dashboard/utils';

const WalletAssetsCard = (props: any) => {
  const { parsedContent } = props;

  const totalAssetsUsd = useMemo(() => {
    return parsedContent?.reduce((prev: any, curr: any) => {
      curr.icon = getTokenLogo(curr.symbol);
      return Big(prev).plus(curr.usd);
    }, Big(0));
  }, [parsedContent]);

  return (
    <div className="mt-[10px] w-full min-w-[554px] flex flex-col gap-[8px]">
      <div className="text-[#392C1D] font-montserrat text-[14px] font-medium leading-[150%]">
        Your total value of wallet assets is <strong>{numberFormatter(totalAssetsUsd, 2, true, { prefix: "$", isZeroPrecision: true })}</strong><br />Here's the distribution of assets:
      </div>
      {
        parsedContent?.map((asset: any) => (
          <div className="flex justify-between items-center pl-[10px] pr-[10px] h-[48px] shrink-0 rounded-[10px] border border-[#D6D1CC] text-[#392C1D] font-montserrat text-[12px] font-medium leading-[100%]">
            <div className="flex items-center gap-[8px] flex-1 overflow-hidden">
              <LazyImage
                src={asset.icon}
                width={26}
                height={26}
                fallbackSrc="/assets/tokens/default_icon.png"
                containerClassName={clsx("shrink-0 rounded-full overflow-hidden")}
              />
              <div className="text-[#392C1D] font-[700]">
                {asset.symbol}
              </div>
            </div>
            <div className="flex items-center justify-end gap-[15px] shrink-0">
              <div className="text-[#392C1D] font-[700] flex items-center">
                {numberFormatter(asset.amount, 2, true, { isShort: true, isZeroPrecision: true, isShortUppercase: true })}({numberFormatter(asset.usd, 2, true, { prefix: "$", isShort: true, isZeroPrecision: true, isShortUppercase: true })})
              </div>
            </div>
          </div>
        ))
      }
    </div>
  );
};

export default WalletAssetsCard;
