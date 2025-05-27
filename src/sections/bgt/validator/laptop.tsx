import FlexTable from "@/components/flex-table";
import BgtHead from '@/sections/bgt/components/bgt-head';
import Back from '@/sections/bgt/validator/components/back';
import Nav from '@/sections/bgt/validator/components/nav';
import Summary from '@/sections/bgt/validator/components/summary';
import { memo } from "react";
import Incentives from '@/sections/bgt/validator/components/incentives';
import RewardWeights from '@/sections/bgt/validator/components/reward-weights';
import IncentivesEarned from "./components/incentives-earned";
import Queued from "./components/queued";
import YourBoosts from "./components/your-boosts";
import IncentivesContextProvider from "./content/incentives";

export default memo(function Validator(props: any) {
  const {
    bgtData,
    pageData,
    bgtPageData,
    handleClick,
    currentTab,
    Tabs,
    setCurrentTab,
    loading,
    Columns,
    vaults,
    estReturnPerBGT,
    currentValidator,
    currentValidatorLoading,
    incentiveList,
  } = props;
  return (
    <div className="flex flex-col h-full overflow-auto items-center py-[75px]">
      <BgtHead bgtData={bgtData} />
      <div className="relative w-[1200px] p-[30px] rounded-[20px] border border-black bg-[#FFFDEB] shadow-[10px_10px_0_0_rgba(0,0,0,0.25)">
        <Back />
        <Nav pageData={pageData} handleClick={handleClick} />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 my-[20px]">
          <div className="flex flex-col gap-4 flex-1 p-4 border border-[#9999] rounded-[8px]">
            <YourBoosts pageData={pageData} />
            <Queued />
          </div>
          <IncentivesContextProvider pageData={pageData}>
            <div className="flex-1 p-4 border border-[#9999] rounded-[8px]">
              <IncentivesEarned />
            </div>
          </IncentivesContextProvider>
        </div>
        <Summary
          vaults={vaults}
          pageData={pageData}
          estReturnPerBGT={estReturnPerBGT}
          currentValidator={currentValidator}
          currentValidatorLoading={currentValidatorLoading}
        />
        <Incentives className="mt-[58px]" list={incentiveList} loading={loading} />
        <div className="mt-[50px] flex justify-between items-start gap-[40px]">
          <FlexTable
            loading={loading}
            columns={Columns}
            list={vaults}
            bodyWrapClass="h-[500px] overflow-y-auto mt-[20px]"
            wrapperClass="flex-1"
          />
          <RewardWeights vaults={vaults} loading={loading} pageData={pageData} />
        </div>
      </div>
    </div>
  )
})
