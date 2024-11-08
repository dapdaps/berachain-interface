import useMarketStore from "@/stores/useMarketStore";
import { formatDisplayNumber } from "@/utils/formatMoney";
import Big from "big.js";
import useBend from "../hooks/useBend";
import Skeleton from 'react-loading-skeleton';

function truncateToTwoDecimals(numString: string) {
  if (!numString) return "0";
  const num = new Big(numString);
  return num.round(2, Big.roundDown).toString();
}

const NetBase = () => {
  const { userAccountData, netBaseData } = useMarketStore();
  const { isLoading }= useBend()
  
  const list = [
    { label: 'Total Supplied', labelMobile: 'You Supplied', value: `$${formatDisplayNumber(userAccountData?.totalCollateralBaseUSD || 0)}` },
    { label: 'Total Borrowed', labelMobile: 'You Borrowed', value: `$${formatDisplayNumber(userAccountData?.totalDebtBaseUSD || 0)}` },
    { label: 'Net APY', value: `${truncateToTwoDecimals(netBaseData.netAPY)}%` },
    { label: 'Account Health', value: userAccountData?.healthFactor || '0.00', valueClassName: 'text-[#7EA82B!important]' },
    { label: 'Borrow up to', value: `$${formatDisplayNumber(userAccountData?.availableBorrowsBaseUSD)}` },
    { label: 'Funds eligible for deposit', value: `$${netBaseData.totalWalletInUSD ? Number(netBaseData.totalWalletInUSD).toFixed(2) : '-'}` },
  ];

  if (isLoading) {
    return (
      <div className="bg-[#FFDC50] rounded-[10px] p-4 flex justify-between items-center">
        {/* Mobile Layout Skeleton */}
        <div className="flex md:hidden">
          <SkeletonItem />
          <SkeletonItem className="ml-[80px]" />
          <SkeletonItem className="ml-[80px]" />
        </div>
        <div className="flex ml-[140px] md:hidden">
          <SkeletonItem />
          <SkeletonItem className="ml-[38px]" />
        </div>

        {/* Desktop Layout Skeleton */}
        <div className="hidden md:visible md:grid md:grid-cols-[1fr_1.2fr] gap-y-[16px]">
          <SkeletonItem />
          <SkeletonItem />
          <SkeletonItem />
          <SkeletonItem />
          <SkeletonItem />
          <SkeletonItem />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFDC50] rounded-[10px] p-4 flex justify-between items-center">
      <div className="flex md:hidden">
        <Item item={list[0]} />
        <Item item={list[2]} className="ml-[80px]" />
        <Item item={list[3]} className="ml-[80px]" />
      </div>
      <div className="flex ml-[140px] md:hidden">
        <Item item={list[4]} />
        <Item item={list[5]} className="ml-[38px]" />
      </div>
      <div className="hidden md:visible md:grid md:grid-cols-[1fr_1.2fr] gap-y-[16px]">
        <Item item={list[0]} />
        <Item item={list[1]} />
        <Item item={list[2]} />
        <Item item={list[3]} />
        <Item item={list[4]} />
        <Item item={list[5]} />
      </div>
    </div>
  );
};

export default NetBase;

const Item = (props: any) => {
  const { style, className, item } = props;
  const { label, value, valueClassName, labelClassName } = item;

  return (
    <div style={style} className={className}>
      <div className={`font-Montserrat text-sm font-medium leading-[17.07px] text-left text-[#3D405A] mb-[12px] whitespace-nowrap ${labelClassName}`}>
        {label}
      </div>
      <div className={`font-Montserrat text-[26px] font-semibold leading-[23.4px] text-left text-black ${valueClassName}`}>
        {value}
      </div>
    </div>
  );
};

const SkeletonItem = ({ className = '' }: { className?: string }) => (
  <div className={className}>
    <div className="text-xs text-[#1E1E1E] mb-1">
      <Skeleton width={80} />
    </div>
    <div className="text-base font-medium">
      <Skeleton width={100} />
    </div>
  </div>
);
