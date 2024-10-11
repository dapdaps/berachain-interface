import useMarketStore from "@/stores/useMarketStore";

const NetBase = () => {
  const { userAccountData, initData: { markets } } = useMarketStore()
  
  const honeyInfo = markets.find((market) => market.symbol === "HONEY");

  return (
    <div className="bg-[#FFE873] rounded-[10px] p-4 flex justify-between items-center">
      <div className="flex">
        <div>
          <div className="font-Montserrat text-sm font-medium leading-[17.07px] text-left text-[#3D405A] mb-[12px]">
            Total Supplied
          </div>
          <div className="font-Montserrat text-[26px] font-semibold leading-[23.4px] text-left text-black">
            ${Number(userAccountData?.totalCollateralBaseUSD || 0).toFixed(2)}
          </div>
        </div>
        <div className="ml-[80px]">
          <div className="font-Montserrat text-sm font-medium leading-[17.07px] text-left text-[#3D405A] mb-[12px]">
            Net APY
          </div>
          <div className="font-Montserrat text-[26px] font-semibold leading-[23.4px] text-left text-black">
            -
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
            ${Number(userAccountData?.availableBorrowsBaseUSD || 0).toFixed(2)}
          </div>
        </div>
        <div className="ml-[38px]">
          <div className="font-Montserrat text-sm font-medium leading-[17.07px] text-left text-[#3D405A] mb-[12px]">
            Funds eligible for deposit
          </div>
          <div className="font-Montserrat text-[26px] font-semibold leading-[23.4px] text-left text-black">
            {
              honeyInfo ? Number(honeyInfo.balance).toFixed(2) : '-'
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetBase;
