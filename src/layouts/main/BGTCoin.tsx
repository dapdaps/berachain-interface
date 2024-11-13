"use client"

import Image from '@/components/layz-image';
import useIsMobile from '@/hooks/use-isMobile';
import { useProgressRouter } from '@/hooks/use-progress-router';
import { numberFormatter } from '@/utils/number-formatter';
import { motion } from 'framer-motion';

const BGTCoin = ({
  type = CoinType.BGT,
  count = '0',
  bp,
  onClick
}: Props) => {
  const router = useProgressRouter()
  const isMobile = useIsMobile();
  return (
    <motion.div whileTap={{ y: -8, scale: 1.05 }} transition={{ type: 'spring', stiffness: 200, damping: 10 }}>
      <div
        data-bp={bp}
        className='relative cursor-pointer'
        onClick={() => {
          if (onClick) {
            onClick(type);
            return;
          }
          router.push(type === CoinType.iBGT ? "/ibgt" : '/bgt')
        }}
      >
        <div className='absolute left-[-6px] top-[50%] translate-y-[-50%]'>
          <Image
            src={`/images/icon-${type === CoinType.iBGT ? CoinType.iBGT : 'coin'}.svg`}
            alt='coin'
            width={33}
            height={30}
          />
        </div>
        <div className="rounded-[26px] bg-[#DAA56B] shadow-[1px_1px_0_0_#77481E] p-[3px]">
          <div
            className={`${type === CoinType.iBGT ? 'bg-[#000000]' : 'bg-[#A6703D]'} font-CherryBomb whitespace-nowrap text-[14px] font-[400] items-center rounded-[26px] border border-[#924E00] pl-[30px] pr-[12px] py-[4px] leading-[0.9]`}
          >
            {numberFormatter(count, isMobile ? 2: 3, true)} {type}
          </div>
        </div>
      </div>

    </motion.div>
  );
};

export default BGTCoin;

export enum CoinType {
  BGT = 'BGT',
  iBGT = 'iBGT',
}

export interface Props {
  type: CoinType,
  count?: string;
  bp?: string;
  onClick?(type: CoinType): void;
}