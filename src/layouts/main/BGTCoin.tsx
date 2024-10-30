"use client"

import Image from '@/components/layz-image';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useProgressRouter } from '@/hooks/use-progress-router';

const Star = () => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    width="61"
    height="30"
    viewBox="0 0 61 30"
    fill="none"
    className='absolute top-[-50%] left-[-50%] z-10'

  >
    <motion.path
      d="M7.53108 16.708C7.69215 16.2727 8.30785 16.2727 8.46893 16.708L9.53223 19.5816C9.68415 19.9921 10.0079 20.3158 10.4184 20.4678L13.292 21.5311C13.7273 21.6922 13.7273 22.3078 13.292 22.4689L10.4184 23.5322C10.0079 23.6842 9.68415 24.0079 9.53223 24.4184L8.46893 27.292C8.30785 27.7273 7.69215 27.7273 7.53107 27.292L6.46777 24.4184C6.31585 24.0079 5.99213 23.6842 5.58155 23.5322L2.70802 22.4689C2.27271 22.3078 2.27271 21.6922 2.70802 21.5311L5.58155 20.4678C5.99213 20.3158 6.31585 19.9921 6.46777 19.5816L7.53108 16.708Z"
      fill="#FFEC8E"
      stroke="#924E00"
    />
    <motion.path
      d="M52.5311 5.70802C52.6922 5.27272 53.3078 5.27271 53.4689 5.70802L54.5322 8.58155C54.6842 8.99213 55.0079 9.31585 55.4184 9.46777L58.292 10.5311C58.7273 10.6922 58.7273 11.3078 58.292 11.4689L55.4184 12.5322C55.0079 12.6842 54.6842 13.0079 54.5322 13.4184L53.4689 16.292C53.3078 16.7273 52.6922 16.7273 52.5311 16.292L51.4678 13.4184C51.3158 13.0079 50.9921 12.6842 50.5816 12.5322L47.708 11.4689C47.2727 11.3078 47.2727 10.6922 47.708 10.5311L50.5816 9.46777C50.9921 9.31585 51.3158 8.99213 51.4678 8.58155L52.5311 5.70802Z"
      fill="#FFEC8E"
      stroke="#924E00"
    />
    <motion.path
      d="M15.5311 2.70802C15.6922 2.27272 16.3078 2.27272 16.4689 2.70802L17.8023 6.31146C17.9542 6.72204 18.278 7.04576 18.6885 7.19768L22.292 8.53107C22.7273 8.69215 22.7273 9.30785 22.292 9.46893L18.6885 10.8023C18.278 10.9542 17.9542 11.278 17.8023 11.6885L16.4689 15.292C16.3078 15.7273 15.6922 15.7273 15.5311 15.292L14.1977 11.6885C14.0458 11.278 13.722 10.9542 13.3115 10.8023L9.70802 9.46893C9.27272 9.30785 9.27272 8.69215 9.70802 8.53107L13.3115 7.19768C13.722 7.04576 14.0458 6.72204 14.1977 6.31146L15.5311 2.70802Z"
      fill="#FFEC8E"
      stroke="#924E00"
    />
  </motion.svg>
)

const BGTCoin = ({
  type = CoinType.BGT,
  count = 0,
  bp
}: Props) => {

  const router = useProgressRouter()

  const countRef = useRef<number>(-1);
  const [isAnimate, setIsAnimate] = useState(true);
  const prev = countRef.current;

  useEffect(() => {
    countRef.current = count;
    setIsAnimate(prev < count);
  }, [count]);

  return (
    <div>
      <div
        data-bp={bp}
        className='relative cursor-pointer'
        onClick={() => {
          router.push(type === CoinType.iBGT ? "/ibgt" : '/bgt')
        }}
      >
        <div className='absolute left-[-6px] top-[50%] translate-y-[-50%]'>
          {/*{*/}
          {/*  type === CoinType.iBGT && (*/}
          {/*    <Star />*/}
          {/*  )*/}
          {/*}*/}
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
            {count} {type}
          </div>
        </div>
      </div>

    </div>
  );
};

export default BGTCoin;

export enum CoinType {
  BGT = 'BGT',
  iBGT = 'iBGT',
}

export interface Props {
  type: CoinType,
  count: number;
  bp?: string;
}