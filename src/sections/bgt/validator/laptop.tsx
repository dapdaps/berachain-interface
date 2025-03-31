import FlexTable from "@/components/flex-table";
import BgtHead from '@/sections/bgt/components/bgt-head';
import Back from '@/sections/bgt/validator/components/back';
import Nav from '@/sections/bgt/validator/components/nav';
import Summary from '@/sections/bgt/validator/components/summary';
import { memo } from "react";

export default memo(function Validator(props: any) {
  const {
    bgtData,
    pageData,
    handleClick,
    currentTab,
    Tabs,
    setCurrentTab,
    loading,
    Columns,
    vaults,

  } = props;
  return (
    <div className="flex flex-col h-full overflow-auto items-center py-[75px]">
      <BgtHead bgtData={bgtData} />
      <div className="relative w-[1200px] p-[30px] rounded-[20px] border border-black bg-[#FFFDEB] shadow-[10px_10px_0_0_rgba(0,0,0,0.25)">
        <Back />
        <Nav pageData={pageData} handleClick={handleClick} />
        <Summary vaults={vaults} pageData={pageData} />
        <FlexTable
          loading={loading}
          columns={Columns}
          list={vaults}
          bodyWrapClass="h-[500px] overflow-y-auto mt-[20px]"
        />
      </div>
    </div>
  )
})
