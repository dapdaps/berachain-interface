import React, { useMemo } from 'react';
import LazyImage from '@/components/layz-image';
import { numberFormatter } from '@/utils/number-formatter';
import clsx from 'clsx';
import Big from 'big.js';
import { getTokenLogo } from '@/sections/dashboard/utils';
import ReactMarkdown from 'react-markdown';
import { useTypewriter } from '@/components/chat/hooks/useTypewriter';
import { motion } from 'framer-motion';
import { motionStaggerChildren, motionStaggerParent } from '@/components/chat/utils/motion-stagger-children';

const WalletAssetsCard = (props: any) => {
  const { parsedContent } = props;

  const totalAssetsUsd = useMemo(() => {
    return parsedContent?.reduce((prev: any, curr: any) => {
      curr.icon = getTokenLogo(curr.symbol);
      return Big(prev).plus(curr.usd);
    }, Big(0));
  }, [parsedContent]);

  const message = useMemo(() => {
    return `Your total value of wallet assets is **${numberFormatter(totalAssetsUsd, 2, true, { prefix: "$", isZeroPrecision: true })}**\nHere's the distribution of assets:`;
  }, [totalAssetsUsd]);

  const { typedContent, isTyping } = useTypewriter(message, {
    interval: 30,
    step: [1, 3],
    initialIndex: 0,
  });

  return (
    <div className="w-full min-w-[554px]">
      <div data-typing={isTyping ? 'true' : 'false'} className="text-[#392C1D] font-montserrat text-[14px] font-[500] leading-[150%]">
        <ReactMarkdown>
          {typedContent}
        </ReactMarkdown>
      </div>
      <motion.div
        className="mt-[10px] w-full flex flex-col gap-[8px]"
        {...motionStaggerParent(0.1)}
      >
        {
          parsedContent?.map((asset: any, idx: number) => (
            <motion.div
              key={idx}
              className="flex justify-between items-center pl-[10px] pr-[10px] h-[48px] shrink-0 rounded-[10px] border border-[#D6D1CC] text-[#392C1D] font-montserrat text-[12px] font-medium leading-[100%]"
              {...motionStaggerChildren}
            >
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
            </motion.div>
          ))
        }
      </motion.div>
    </div>
  );
};

export default WalletAssetsCard;
