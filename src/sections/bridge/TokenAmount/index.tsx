'use client';

import { useState } from 'react';
import TokenSelector from '../TokenSelector';
import allTokens from '@/configs/allTokens'
import { Chain } from 'viem';
import { Token } from '@/types';
import chains, { icons } from '@/configs/chains'

interface Props {
  chain: Chain;
  token: Token;
  disabledInput?: boolean;
  onTokenChange: (v: Token) => void;
}

export default function TokenAmout({
  chain,
  token,
  disabledInput = false,
  onTokenChange
}: Props) {
  const [tokenSelectorShow, setTokenSelectorShow] = useState(false);

  return (
    <div className='border border-[#000] rounded-[12px] p-[14px] bg-white'>
      <div className='flex items-center justify-between gap-[10px]'>
        <div
          onClick={() => {
            setTokenSelectorShow(true);
          }}
          className='border cursor-pointer flex items-center justify-between border-[#000] rounded-[8px] bg-[#FFFDEB] w-[176px] h-[46px] px-[7px]'
        >
          <div className='flex items-center gap-[10px]'>
            <div className='relative w-[26px]'>
              <img
                className='w-[26px] h-[26px]'
                src={token?.icon}
              />
              <img
                className='w-[10px] h-[10px] absolute right-0 bottom-0'
                src={icons[chain.id]}
              />
            </div>
            <div>
              <div className='text-[16px] font-[600] whitespace-nowrap overflow-hidden text-ellipsis'>{ token?.symbol }</div>
              <div className='text-[12px] font-medium '>{ chain.name }</div>
            </div>
          </div>
          <svg
            width='12'
            height='7'
            viewBox='0 0 12 7'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M1 1L6 5L11 1'
              stroke='black'
              stroke-width='2'
              strokeLinecap='round'
            />
          </svg>
        </div>
        <div className='flex-1'>
          <input className='w-[100%] h-[100%] text-[26px] text-right' disabled={disabledInput}/>
        </div>
      </div>

      <div className='flex items-center justify-between text-[#3D405A] mt-[10px] font-medium text-[12px]'>
        <div>balance: 0</div>
        <div>$2637.88</div>
      </div>

      <TokenSelector
        show={tokenSelectorShow}
        tokenList={allTokens[chain.id]}
        token={token}
        onTokenSelect={onTokenChange}
        onClose={() => {
          setTokenSelectorShow(false);
        }}
      />
    </div>
  );
}
