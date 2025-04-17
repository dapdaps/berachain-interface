import FlexTable from "@/components/flex-table";
import BgtHead from '@/sections/bgt/components/bgt-head';
import Back from '@/sections/bgt/validator/components/back';
import Nav from '@/sections/bgt/validator/components/nav';
import Summary from '@/sections/bgt/validator/components/summary';
import { memo } from "react";
import Incentives from '@/sections/bgt/validator/components/incentives';

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
  } = props;

  // console.log('bgtData: %o', bgtData);
  // console.log('pageData: %o', pageData);
  // console.log('bgtPageData: %o', bgtPageData);

  return (
    <div className="flex flex-col h-full overflow-auto items-center py-[75px]">
      <BgtHead bgtData={bgtData} />
      <div className="relative w-[1200px] p-[30px] rounded-[20px] border border-black bg-[#FFFDEB] shadow-[10px_10px_0_0_rgba(0,0,0,0.25)">
        <Back />
        <Nav pageData={pageData} handleClick={handleClick} />
        <Summary vaults={vaults} pageData={pageData} />
        {/*<Incentives className="mt-[58px]" vaults={vaults} pageData={pageData} />*/}
        <FlexTable
          loading={loading}
          columns={Columns}
          list={vaults}
          wrapperClass="mt-[50px]"
          bodyWrapClass="h-[500px] overflow-y-auto mt-[20px]"
        />
      </div>
    </div>
  )
})
