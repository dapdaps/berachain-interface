import React from "react";
import { useWallet } from '@/sections/dashboard/hooks/use-wallet';
import chains from '@/configs/chains';
import { formatLongText } from '@/utils/utils';
import useCustomAccount from '@/hooks/use-account';
import { numberFormatter } from '@/utils/number-formatter';
import Skeleton from 'react-loading-skeleton';
import { useVaultsV2Context } from '@/sections/vaults/v2/context';
import Big from 'big.js';
import dayjs from 'dayjs';

const Divider = () => (
  <div className="w-px h-6 bg-[#392C1D]/10 mx-3" />
);

const currentChain = chains[80094];
const networkList = Object.values(chains);

const TopBar: React.FC<any> = () => {
  const { account } = useCustomAccount();
  const {
    loading: totalBalanceLoading,
    totalBalance
  } = useWallet({ currentChain, networkList });
  const { totalUserStakeUsd, listLoading, totalUserRewardTokens } = useVaultsV2Context();

  const currentDate = dayjs().format('D MMM, YYYY').toUpperCase();

  return (
    <div className="h-[36px] w-full flex items-center px-4 text-sm text-black border-b border-[#392C1D]/10">
      <div className="flex items-center h-6 flex-1 overflow-hidden">
        <div className="text-[18px] leading-[18px] font-CherryBomb whitespace-nowrap">GM! Beratown</div>
        <Divider />
        <div className="whitespace-nowrap font-Montserrat leading-[1] text-[12px] font-[500]">Account: <span className="font-[700]">{formatLongText(account, 5, 4)}</span></div>
        <Divider />
        <div className="whitespace-nowrap font-Montserrat leading-[1] text-[12px] font-[500]">Total Assets: <span className="font-[700]">{
          totalBalanceLoading ? (
            <Skeleton width={40} height={14} borderRadius={4} />
          ) : numberFormatter(totalBalance, 2, true, { prefix: "$", isShort: true, isShortUppercase: true, isZeroPrecision: true })
        }</span></div>
        <Divider />
        <div className="whitespace-nowrap font-Montserrat leading-[1] text-[12px] font-[500]">Invested: <span className="font-[700]">{
          listLoading ? (
            <Skeleton width={40} height={14} borderRadius={4} />
          ) : numberFormatter(totalUserStakeUsd, 2, true, { prefix: "$", isShort: true, isShortUppercase: true, isZeroPrecision: true })
        }</span></div>
        <Divider />
        <div className="whitespace-nowrap font-Montserrat leading-[1] text-[12px] font-[500]">Yield: <span className="text-[#4F912E] font-[700]">+{
          listLoading ? (
            <Skeleton width={40} height={14} borderRadius={4} />
          ) : numberFormatter(
            totalUserRewardTokens.reduce((prev: any, curr: any) => Big(prev).plus(curr.usd || 0), Big(0)),
            2,
            true,
            {
              isShort: true,
              isShortUppercase: true,
              isZeroPrecision: true,
              prefix: "$",
            }
          )
        }</span></div>
      </div>
      <div className="ml-4 flex items-center">
        <Divider />
        <div className="whitespace-nowrap font-Montserrat leading-[1] text-[12px] font-[500]">{currentDate}</div>
      </div>
    </div>
  );
};

export default TopBar;
