import Back from '@/sections/bgt/validator/components/back';
import Nav from '@/sections/bgt/validator/components/nav';
import Summary from '@/sections/bgt/validator/components/summary';
import SwitchTabs from '@/components/switch-tabs';
import React, { useMemo } from 'react';
import Empty from '@/components/empty';

const BgtValidatorMobile = (props: any) => {
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
    visible,
    validator,
    operationType,
    handleClose,
    onBack,
    estReturnPerBGT,
    currentValidator,
    currentValidatorLoading,
  } = props;

  const listData = currentTab === "gauges" ? vaults || [] : [];
  const columns = useMemo(() => {
    const _columns = [];
    let incentives = -1;
    for (let i = 0; i < Columns.length; i++) {
      const col: any = Columns[i];
      if (col.dataIndex === 'incentives') {
        incentives = i;
        continue;
      }
      _columns.push(col);
    }
    if (incentives > -1) {
      _columns.splice(1, 0, Columns[incentives]);
    }
    return _columns;
  }, [Columns]);

  return (
    <div className="relative px-[12px] pt-[19px] pb-[80px] h-full overflow-y-auto">
      <Back onBack={onBack} />
      <Nav pageData={pageData} handleClick={handleClick} />
      <Summary
        vaults={vaults}
        pageData={pageData}
        estReturnPerBGT={estReturnPerBGT}
        currentValidator={currentValidator}
        currentValidatorLoading={currentValidatorLoading}
      />
      {/* <SwitchTabs
        current={currentTab}
        tabs={Tabs}
        onChange={(key) => setCurrentTab(key as string)}
        style={{
          width: '100%',
          height: 40,
          padding: 4,
          borderRadius: 12,
        }}
        tabStyle={{
          fontWeight: 500,
          fontSize: 14,
        }}
        cursorStyle={{
          borderRadius: 10,
        }}
      /> */}

      {
        listData.length > 0 ? listData.map((d: any, idx: number) => (
          <div className="bg-[rgba(0,0,0,0.06)] rounded-[10px] p-[17px_12px_24px] mt-[13px]">
            <div key={idx} className="w-full flex flex-wrap gap-y-[36px]">
              {
                columns.map((c: any, index: number) => (
                  <div key={`col-${index}`} className={`${index % 2 === 0 ? 'w-[60%]' : 'w-[40%]'}`}>
                    {['proposal', 'incentive'].includes(c.dataIndex) && (
                      <div className="text-[#3D405A] font-[500] text-[14px] mb-[5px] whitespace-nowrap">{c.title}</div>
                    )}
                    {['incentives'].includes(c.dataIndex) ? (
                      <div className="flex flex-col">
                        <span className="text-[#3D405A] font-[500] text-[14px] mb-[5px] whitespace-nowrap leading-[90%]">Incentives</span>
                        <span className="text-black font-Montserrat text-[16px] font-semibold">No Incentives</span>
                      </div>
                    ) : c.render(d[c.dataIndex], d)}
                  </div>
                ))
              }
            </div>
          </div>
        )) : (
          <div className="">
            <Empty desc='No data' />
          </div>
        )
      }

    </div>
  );
};

export default BgtValidatorMobile;
