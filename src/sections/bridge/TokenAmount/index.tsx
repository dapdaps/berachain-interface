'use client';

import { useEffect, useMemo, useState } from 'react';
import Range from "@/components/range";

import useTokenBalance from '@/hooks/use-token-balance';
import Loading from '@/components/loading';
import { usePriceStore } from '@/stores/usePriceStore';
import { balanceFormated } from '@/utils/balance';
import { tokenPairs } from '../Hooks/Stargate/config';

import type { Chain, Token } from '@/types';
import ChainAndTokenSelector from '../ChainAndTokenSelector';
import TokenOnlySelector from '../TokenOnlySelector';
import { useParams } from 'next/navigation';
import useBridgeType from '../Hooks/useBridgeType';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import Big from 'big.js';
import { DEFAULT_CHAIN_ID } from '@/configs';
import chains from '@/configs/chains';
import { useAccount } from 'wagmi';
import { useImportTokensStore } from '@/stores/import-tokens';
import { uniqBy } from 'lodash';

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
  isDest: boolean;
  allTokens: any;
  updateRef: number;
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
  limitBera,
  isDest,
  allTokens,
  updateRef
}: Props) {
  const [tokenSelectorShow, setTokenSelectorShow] = useState(false);
  const { address: account } = useAccount();
  const { importTokens, addImportToken }: any = useImportTokensStore();

  const { tokenBalance, isError, isLoading, update } = useTokenBalance(
    token ? (token.isNative ? 'native' : token.address) : '', token?.decimals ?? 0, token?.chainId ?? 0
  )
  const prices: any = usePriceStore(store => store.price);

  useEffect(() => {
    update();
  }, [updateRef]);

  const { bridgeType } = useBridgeType()
  const [percent, setPercent] = useState<any>(0);
  const handleRangeChange = (e: any, isAmountChange = true) => {
    const formatedBalance = balanceFormated(tokenBalance);
    if (["-", "Loading", "0"].includes(formatedBalance)) return;
    const _percent = e.target.value || 0;
    setPercent(_percent);
    isAmountChange &&
      onAmountChange?.(
        Big(tokenBalance)
          .times(Big(_percent).div(100))
          .toFixed(token?.decimals)
          .replace(/[.]?0+$/, "")
      );
  };

  const tokens = useMemo(() => {
    return uniqBy(
      [
        ...allTokens[DEFAULT_CHAIN_ID],
        ...(importTokens[DEFAULT_CHAIN_ID] || [])
      ].map((token: any) => ({
        ...token,
        address: token.address.toLowerCase()
      })),
      "address"
    );
  }, [importTokens, allTokens]);

  return (
    <div className='border border-[#000] rounded-[12px] p-[14px] bg-white'>
      <div className='flex items-center justify-between gap-[10px]'>
        <div
          onClick={() => {
            if (comingSoon) return;

            if (isDest && limitBera && bridgeType === 'stargate') {
              return;
            }

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
              {
                bridgeType !== 'superSwap' && (
                  <img
                    className='w-[10px] h-[10px] absolute right-0 bottom-0 md:rounded-sm'
                    src={chain?.icon}
                  />
                )
              }
            </div>
            <div>
              <div className='text-[16px] font-[600] whitespace-nowrap overflow-hidden text-ellipsis'>{token?.symbol}</div>
              {
                bridgeType !== 'superSwap' && (
                  <div className='text-[12px] font-medium whitespace-nowrap overflow-hidden text-ellipsis'>{chain?.chainName}</div>
                )
              }
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
          <input type='number' className="w-[100%] h-[100%] text-[26px] text-right" value={amount} onChange={(e) => {
            onAmountChange?.(e.target.value)
          }} disabled={disabledInput} />
        </div>
      </div>

      <div className="flex items-center justify-between text-[#3D405A] mt-[10px] font-medium text-[12px]">
        <div className={"flex items-center cursor-pointer"} onClick={() => {
          onAmountChange?.(tokenBalance)
        }}>balance: {isLoading ? <Loading size={12} /> : <span className={(disabledInput ? '' : ' underline')}>{balanceFormated(tokenBalance, 4)}</span>}</div>
        <div >${(token && tokenBalance) ? balanceFormated((prices[(token as any).priceKey] || prices[token.symbol.toUpperCase()] || prices[token.address.toLowerCase()]) * (amount as any), 4) : '~'}</div>
      </div>


      {
        !isDest && <div className="flex justify-between md:flex-col md:items-stretch md:justify-start items-center gap-[22px] mt-[10px]">
          <div className="flex items-center gap-[8px]">
            {BalancePercentList.map((p) => (
              <motion.div
                key={p.value}
                className={clsx(
                  "cursor-pointer h-[22px] rounded-[6px] border border-[#373A53] text-black text-[14px] font-[400] px-[8px] flex justify-center items-center",
                  '')
                }
                animate={percent == p.value ? { background: "#FFDC50" } : {}}
                onClick={() => handleRangeChange({ target: p })}
              >
                {p.label}
              </motion.div>
            ))}
          </div>
          <Range
            style={{ marginTop: 0, flex: 1 }}
            value={percent}
            onChange={handleRangeChange}
          />
        </div>
      }


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
        tokenSelectorShow && bridgeType !== 'superSwap' && <ChainAndTokenSelector
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


      {
        bridgeType === 'superSwap' && tokenSelectorShow && <TokenOnlySelector
          display={true}
          chainIdNotSupport={chain.chainId !== DEFAULT_CHAIN_ID}
          selectedTokenAddress={token?.address}
          chainId={DEFAULT_CHAIN_ID}
          tokens={tokens}
          account={account}
          explor={chains[DEFAULT_CHAIN_ID].blockExplorers.default.url}
          onClose={() => {
            setTokenSelectorShow(false);
          }}
          onImport={addImportToken}
          onSelect={onTokenChange as any}
        />
      }


    </div>
  );
}


const BalancePercentList = [
  { value: 25, label: "25%" },
  { value: 50, label: "50%" },
  { value: 75, label: "75%" },
  { value: 100, label: "Max" }
];