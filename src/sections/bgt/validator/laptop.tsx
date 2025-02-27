import FlexTable from "@/components/flex-table";
import SwitchTabs from '@/components/switch-tabs';
import BgtHead from '@/sections/bgt/components/bgt-head';
import { memo } from "react";
import Back from '@/sections/bgt/validator/components/back';
import Nav from '@/sections/bgt/validator/components/nav';
import Summary from '@/sections/bgt/validator/components/summary';

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


  console.log('====pageData====', pageData)
  console.log('====vaults====', vaults)
  return (
    <div className="flex flex-col items-center pt-[75px]">
      <BgtHead bgtData={bgtData} />
      <div className="relative w-[1200px] p-[30px] rounded-[20px] border border-black bg-[#FFFDEB] shadow-[10px_10px_0_0_rgba(0,0,0,0.25)">
        <Back />
        <Nav pageData={pageData} handleClick={handleClick} />
        <Summary vaults={vaults} pageData={pageData} />
        {/* <SwitchTabs
          current={currentTab}
          tabs={Tabs}
          onChange={(key) => setCurrentTab(key as string)}
          style={{
            width: 340,
            height: 40,
            padding: 4,
          }}
          tabStyle={{
            fontWeight: 500,
            fontSize: 14,
          }}
        /> */}
        <FlexTable
          loading={loading}
          columns={Columns}
          list={vaults}
        />
      </div>
    </div>
  )
})
