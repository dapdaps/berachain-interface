import useMarketStore from "@/stores/useMarketStore";
import { formatDisplayNumber } from "@/utils/formatMoney";
import Big from "big.js";

function truncateToTwoDecimals(numString: string) {
  if (!numString) return "0";
  const num = new Big(numString);
  return num.round(2, Big.roundDown).toString();
}

const NetBase = () => {
  const { userAccountData, netBaseData } = useMarketStore()
  
  return (
    <div className="bg-[#FFE873] rounded-[10px] p-4 flex justify-between items-center">
      <div className="flex">
        <div>
          <div className="font-Montserrat text-sm font-medium leading-[17.07px] text-left text-[#3D405A] mb-[12px]">
            Total Supplied
          </div>
          <div className="font-Montserrat text-[26px] font-semibold leading-[23.4px] text-left text-black">
            ${formatDisplayNumber(userAccountData?.totalCollateralBaseUSD || 0)}
          </div>
        </div>
        <div className="ml-[80px]">
          <div className="font-Montserrat text-sm font-medium leading-[17.07px] text-left text-[#3D405A] mb-[12px] w-[100px] h-[34px]">
            Net APY
          </div>
          <div className="font-Montserrat text-[26px] font-semibold leading-[23.4px] text-left text-black">
            {truncateToTwoDecimals(netBaseData.netAPY)}%
          </div>
        </div>
        <div className="ml-[80px]">
          <div className="font-Montserrat text-sm font-medium leading-[17.07px] text-left text-[#3D405A] mb-[12px]">
            Account Health
          </div>
          <div className="font-Montserrat text-[26px] font-semibold leading-[23.4px] text-left text-[#7EA82B]">
            {userAccountData?.healthFactor || '0.00'}
          </div>
        </div>
      </div>
      <div className="flex ml-[140px]">
        <div>
          <div className="font-Montserrat text-sm font-medium leading-[17.07px] text-left text-[#3D405A] mb-[12px]">
            Borrow up to
          </div>
          <div className="font-Montserrat text-[26px] font-semibold leading-[23.4px] text-left text-black">
            ${
              formatDisplayNumber(userAccountData?.availableBorrowsBaseUSD)
            }
          </div>
        </div>
        <div className="ml-[38px]">
          <div className="font-Montserrat text-sm font-medium leading-[17.07px] text-left text-[#3D405A] mb-[12px]">
            Funds eligible for deposit
          </div>
          <div className="font-Montserrat text-[26px] font-semibold leading-[23.4px] text-left text-black">
            {
              netBaseData.totalWalletInUSD ? Number(netBaseData.totalWalletInUSD).toFixed(2) : '-'
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetBase;
