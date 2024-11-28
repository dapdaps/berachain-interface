import Skeleton from 'react-loading-skeleton';
import SwapModal from '@/sections/swap/SwapModal';
import React, { useMemo, useState } from 'react';
import { useSwapToken } from '@/hooks/use-swap-token';
import { Props } from '@/sections/Lending/components/markets/index';

const MarketsMobile = (props: Props) => {
  const { loading, loadingLength = 4, columns, markets, onSuccess, isSwap = true, onDeposit, onWithdraw } = props;

  const [swapToken, setSwapToken, handleSwap, protocols] = useSwapToken();

  return (
    <>
      <div className="mt-[20px] flex flex-col gap-[12px]">
        {
          loading && [...new Array(loadingLength)].map((_, i) => (
            <Skeleton key={i} width={'100%'} height={138} borderRadius={10} />
          ))
        }
        {
          !loading && markets.map((market: any, index: number) => (
            <div key={`row-${index}`} className="bg-[rgba(0,0,0,0.06)] rounded-[10px] p-[16px_14px_14px_14px] flex flex-col gap-[19px] items-stretch">
              <div className="flex justify-between items-center gap-[10px]">
                <div className="flex items-center gap-[11px]">
                  {
                    market.underlyingTokens ? market.underlyingTokens.map((t: any, i: number) => (
                      <img
                        src={t.icon}
                        alt={t.symbol}
                        className="w-[40px] h-[40px] rounded-full"
                        style={{ marginLeft: i > 0 ? -10 : 0 }}
                      />
                    )) : (
                      <img src={market.icon} alt="" className="w-[40px] h-[40px] rounded-full" />
                    )
                  }
                  <div className="text-[16px] text-black font-[600]">
                    <div>{market.symbol}</div>
                    <div className="text-[10px] font-[400] mt-[5px]">
                      {market.name}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end items-center gap-[10px]">
                  {
                    isSwap && (
                      <button
                        type="button"
                        className="rounded-[10px] border border-[#373A53] h-[32px] leading-[30px] px-[15px]"
                        onClick={() => handleSwap(market)}
                      >
                        Get
                      </button>
                    )
                  }
                  <button
                    type="button"
                    className="rounded-[10px] border border-[#373A53] bg-[#FFDC50] h-[32px] w-[32px] flex justify-center items-center"
                    disabled={false}
                    style={{ opacity: 1 }}
                    onClick={() => onDeposit?.(market, index)}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M8.02111 8.09214L12.7387 8.09217C13.0934 8.09211 13.381 7.86507 13.3809 7.58523L13.3809 6.55662C13.3809 6.27673 13.0932 6.05045 12.7383 6.05004L8.02104 6.05018L8.02095 1.33277C8.02112 0.977856 7.79426 0.690062 7.51418 0.690237L6.48551 0.690289C6.20591 0.69011 5.97887 0.977726 5.97911 1.33269L5.9792 6.05023L1.26149 6.05032C0.906932 6.05026 0.619081 6.27671 0.619142 6.55666L0.619089 7.58533C0.619091 7.86523 0.906768 8.09221 1.26144 8.09227L5.97921 8.09224L5.97918 12.8093C5.97913 13.1647 6.20581 13.4519 6.48571 13.452L7.51438 13.4519C7.79422 13.4518 8.02108 13.1644 8.02131 12.8097L8.02111 8.09214Z"
                        fill="black"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="rounded-[10px] border border-[#373A53] bg-[#FFDC50] h-[32px] w-[32px] flex justify-center items-center"
                    disabled={false}
                    style={{ opacity: 1 }}
                    onClick={() => onWithdraw?.(market, index)}
                  >
                    <svg width="13" height="2" viewBox="0 0 13 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="13" height="2" rx="1" fill="black" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center gap-[10px] text-[16px] text-black font-[600]">
                {
                  columns.filter((col: any) => !['asset', 'assets', 'action'].includes(col.type)).map((col: any, idx: number) => {
                    return (
                      <div className="" key={idx}>
                        <div className="text-[#3D405A] text-[14px] font-[500]">
                          {col.title}
                        </div>
                        <div className="" style={col.style?.(market, index)}>
                          {col.render?.(market[col.dataIndex], market, index) || market[col.dataIndex]}
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          ))
        }
        {
          !loading && markets.length > 0 && (
            <div className="opacity-30 text-[10px] text-center py-[10px]">
              The End
            </div>
          )
        }
      </div>
      {swapToken && (
        <SwapModal
          defaultOutputCurrency={swapToken}
          outputCurrencyReadonly={true}
          show={!!swapToken}
          protocols={protocols}
          onClose={() => {
            setSwapToken(null);
          }}
          onSuccess={() => {
            onSuccess?.();
          }}
        />
      )}
    </>
  );
};

export default MarketsMobile;
