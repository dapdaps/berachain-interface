'use client';

import { useState } from 'react';
import TokenSelector from '../TokenSelector';
import allTokens from '@/configs/allTokens'

import chains, { icons } from '@/configs/chains'
import useTokenBalance from '@/hooks/use-token-balance';
import Loading from '@/components/loading';
import { usePriceStore } from '@/stores/usePriceStore';
import { balanceFormated } from '@/utils/balance';
import { tokenPairs } from '../Hooks/Stargate/config';

import type { Chain, Token } from '@/types';
import ChainAndTokenSelector from '../ChainAndTokenSelector';

interface Props {
  chain: Chain;
  token: Token | null;
  amount: string;
  disabledInput?: boolean;
  comingSoon?: boolean;
  onAmountChange?: (v: string) => void;
  onChainChange?: (v: Chain) => void;
  onTokenChange?: (v: Token) => void;
  chainList: Chain[];
  limitBera: boolean;
}

export default function TokenAmout({
  chain,
  token,
  amount,
  disabledInput = false,
  onChainChange,
  onTokenChange,
  comingSoon,
  onAmountChange,
  chainList,
  limitBera
}: Props) {
  const [tokenSelectorShow, setTokenSelectorShow] = useState(false);

  const { tokenBalance, isError, isLoading, update } = useTokenBalance(
    token ? (token.isNative ? 'native' : token.address) : '', token?.decimals ?? 0, token?.chainId ?? 0
  )
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
              {
                token?.icon ? <img
                  key={token?.address}
                  className='w-[26px] h-[26px]'
                  src={token?.icon}
                /> : <div className='w-[26px] h-[26px] rounded-[50%] bg-[#000]' />  
              }
              <img
                // key={token?.icon}
                className='w-[10px] h-[10px] absolute right-0 bottom-0 md:rounded-sm'
                src={chain.icon}
              />
            </div>
            <div>
              <div className='text-[16px] font-[600] whitespace-nowrap overflow-hidden text-ellipsis'>{token?.symbol}</div>
              <div className='text-[12px] font-medium whitespace-nowrap overflow-hidden text-ellipsis'>{chain?.chainName}</div>
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
          <input className="w-[100%] h-[100%] text-[26px] text-right" value={amount} onChange={(e) => {
            onAmountChange?.(e.target.value)
          }} disabled={disabledInput} />
        </div>
      </div>

      <div className="flex items-center justify-between text-[#3D405A] mt-[10px] font-medium text-[12px]">
        <div className={"flex items-center cursor-pointer"} onClick={() => {
          onAmountChange?.(tokenBalance)
        }}>balance: {isLoading ? <Loading size={12} /> : <span className={(disabledInput ? '' : ' underline')}>{balanceFormated(tokenBalance, 4)}</span>}</div>
        <div >${(token && tokenBalance) ? balanceFormated(prices[token.symbol.toUpperCase()] * (amount as any), 4) : '~'}</div>
      </div>

      {/* <TokenSelector
        show={tokenSelectorShow}
        tokenList={allTokens[chain.chainId].filter((token: Token) => !!tokenPairs[chain.chainId][(token.symbol).toUpperCase()])}
        token={token}
        onTokenSelect={onTokenChange as any}
        onClose={() => {
          setTokenSelectorShow(false);
        }}
      /> */}

      {
        tokenSelectorShow && <ChainAndTokenSelector
          onClose={() => {
            setTokenSelectorShow(false);
          }}
          limitBera={limitBera}
          currentChain={chain}
          currentToken={token as Token}
          chainToken={allTokens}
          chainList={chainList}
          showSelectChain={true}
          onChainChange={(chain) => {
            onChainChange?.(chain)
          }}
          onTokenChange={(token: Token) => {
            onTokenChange?.(token)
          }}
        />
      }

    </div>
  );
}
