'use client';

import { useState } from 'react';
import TokenSelector from '../TokenSelector';
import allTokens from '@/configs/allTokens'
import { Chain } from 'viem';
import { Token } from '@/types';
import chains, { icons } from '@/configs/chains'
import useTokenBalance from '@/hooks/use-token-balance';
import Loading from '@/components/loading';
import { usePriceStore } from '@/stores/usePriceStore';
import { balanceFormated } from '@/utils/balance';

interface Props {
  chain: Chain;
  token: Token;
  disabledInput?: boolean;
  comingSoon?: boolean;
  onTokenChange: (v: Token) => void;
}

export default function TokenAmout({
  chain,
  token,
  disabledInput = false,
  onTokenChange,
  comingSoon
}: Props) {
  const [tokenSelectorShow, setTokenSelectorShow] = useState(false);
  const { tokenBalance, isError, isLoading, update } = useTokenBalance(token.isNative ? 'native' : token.address, token.decimals, token.chainId)
  const prices: any = usePriceStore(store => store.price);

  return (
    <div className='border border-[#000] rounded-[12px] p-[14px] bg-white'>
      <div className='flex items-center justify-between gap-[10px]'>
        <div
          onClick={() => {
            if (comingSoon) return;
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
                className='w-[10px] h-[10px] absolute right-0 bottom-0 md:rounded-sm'
                src={icons[chain.id]}
              />
            </div>
            <div>
              <div className='text-[16px] font-[600] whitespace-nowrap overflow-hidden text-ellipsis'>{ token?.symbol }</div>
              <div className='text-[12px] font-medium '>{ chain.name }</div>
            </div>
          </div>
          {
            !comingSoon && (
              <svg
                width="12"
                height="7"
                viewBox="0 0 12 7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L6 5L11 1"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )
          }
        </div>
        <div className="flex-1">
          <input className="w-[100%] h-[100%] text-[26px] text-right" disabled={disabledInput} />
        </div>
      </div>

      <div className="flex items-center justify-between text-[#3D405A] mt-[10px] font-medium text-[12px]">
        <div className="flex items-center">balance: {isLoading ? <Loading size={12}/> : balanceFormated(tokenBalance, 4)}</div>
        <div>${(token && tokenBalance) ?  balanceFormated(prices[token.symbol] * (tokenBalance as any), 4) : '~'}</div>
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
