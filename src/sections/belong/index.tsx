"use client";

import Benefits from "./components/benefits";
import BelongForm from "./components/form";
import HowWork from "./components/how-work";
import useIsMobile from "@/hooks/use-isMobile";
import BelongTitle from "./components/title";
import Partners from "./components/partners";
import SwitchTabs from "@/components/switch-tabs";
import Withdraw from "./components/withdraw";
import Manage from "./components/manage";
import BelongProvider from "./context";
import { useBelong } from "./hooks";
import BeraborrowData from "../Lending/datas/beraborrow";
import Position from "./components/position";
import ShareModal from "./components/share";
import FootLink from "./components/foot-link";
import Card from "@/components/card";

const BelongView = () => {

  const isMobile = useIsMobile();
  const belong = useBelong();
  const {
    tabs,
    currentTab,
    setCurrentTab,
    config,
    currentMarket,
    account,
    provider,
    chainId,
    prices,
    dataLoading,
    setDataLoading,
    positionRef,
    setData,
    currentMarketData,
    shareModalOpen,
    setShareModalOpen,
    leverageApy,
    setLeverageApy,
  } = belong;

  return (
    <BelongProvider {...belong}>
      <div className="relative w-full text-[#6E7083] font-Montserrat text-[12px] font-[500] leading-[120%]">
        <div className="text-white text-center font-Montserrat text-[36px] font-bold leading-[80%] md:leading-[100%] uppercase md:text-[26px] md:mt-[15px] md:text-left md:px-[18px]">
          position{isMobile && <br />} yourself for<br /> the future{isMobile && <br />} rally of
        </div>
        <BelongTitle className="md:mt-[1px] md:px-[18px] md:text-left md:relative md:z-[1]">
          berachain
        </BelongTitle>
        <div className="text-[#A1A0A1] md:text-[#A1A0A1] text-center font-Montserrat text-[16px] font-[500] leading-normal md:leading-[120%] mt-[22px] md:mt-[23px] md:px-[18px] md:text-left md:relative md:z-[1]">
          Zap, deposit and LP into the best BERA stable{!isMobile && <br />} pool - iBERA-wgBERA in the whole ecosystem!
        </div>
        <div className="w-[452px] md:w-full md:px-[10px] mt-[20px] relative z-[1] mx-auto">
          <Position
            ref={positionRef}
            className="w-full"
            leverage={1}
            apy={leverageApy}
            market={currentMarketData}
            setShareModalOpen={setShareModalOpen}
          />
          <Card className="mt-[10px] md:mt-[10px] w-full shrink-0 !p-[20px] !rounded-[20px] text-[#000] text-[12px] font-Montserrat font-[500]">
            <SwitchTabs
              tabs={tabs}
              current={currentTab}
              onChange={(tab) => setCurrentTab(tab)}
            />
            <div className="w-full mt-[10px]">
              {
                currentTab === "deposit" && (
                  <BelongForm
                    className=""
                  />
                )
              }
              {
                currentTab === "withdraw" && (
                  <Withdraw
                    className=""
                  />
                )
              }
              {
                currentTab === "manage" && (
                  <Manage
                    className=""
                  />
                )
              }
            </div>
          </Card>
          <FootLink className="mt-[10px] w-full" />
        </div>
        <Benefits className="mt-[130px] md:mt-[70px] relative z-[1] md:w-full md:overflow-hidden" />
        <div className="mt-[168px] md:mt-[50px] w-full bg-[url('/images/belong/v2/bg-bar-primary-short.png')] bg-no-repeat bg-[length:100%_auto] bg-[position:bottom_150px_center] md:bg-[position:bottom_310px_center]">
          <HowWork className="w-[928px] mx-auto md:w-full md:overflow-hidden" />
          <Partners className="mt-[133px] md:mt-[77px] w-[846px] mx-auto md:w-full md:px-[10px]" />
        </div>
        <div className="w-full absolute left-0 z-0 top-[550px] md:top-[0px] h-[380px] md:h-[254px] pointer-events-none overflow-hidden">
          <img
            src="/images/belong/v2/mc-belong.gif"
            className="absolute w-[380px] md:w-[254px] top-0 right-0 md:right-[-30px] h-full object-cover object-center"
          />
        </div>
      </div>
      <BeraborrowData
        {...config}
        {...config.basic}
        markets={[currentMarket]}
        chainId={chainId}
        prices={prices}
        update={dataLoading}
        account={account}
        provider={provider}
        onLoad={(res: any) => {
          console.log('Beraborrow data res: %o', res);
          setData(res);
          setDataLoading(false);
        }}
      />
      <ShareModal
        open={shareModalOpen}
        onClose={() => {
          setShareModalOpen(false);
        }}
        market={currentMarketData}
        leverage={1}
        apy={leverageApy?.value}
      />
    </BelongProvider>
  );
};

export default BelongView;
