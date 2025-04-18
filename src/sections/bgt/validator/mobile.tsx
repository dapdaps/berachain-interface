import Back from '@/sections/bgt/validator/components/back';
import Nav from '@/sections/bgt/validator/components/nav';
import Summary from '@/sections/bgt/validator/components/summary';
import SwitchTabs from '@/components/switch-tabs';
import React, { useMemo } from 'react';
import Empty from '@/components/empty';
import Incentives from '@/sections/bgt/validator/components/incentives';
import RewardWeights from '@/sections/bgt/validator/components/reward-weights';
import { bera } from '@/configs/tokens/bera';
import LazyImage from '@/components/layz-image';
import { DefaultIcon, getTokenLogo } from '@/sections/dashboard/utils';
import clsx from 'clsx';
import Card from '@/components/card';
import BgtHead from '@/sections/bgt/components/bgt-head';

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
    incentiveList,
  } = props;

  const listData = currentTab === "gauges" ? vaults || [] : [];
  const columns = useMemo(() => {
    const _columns = [];
    let incentives = -1;
    let proposal = -1;
    let incentive = -1;

    for (let i = 0; i < Columns.length; i++) {
      const col: any = Columns[i];
      if (col.dataIndex === 'incentives') {
        incentives = i;
        continue;
      }
      if (col.dataIndex === 'proposal') {
        proposal = i;
        continue;
      }
      if (col.dataIndex === 'incentive') {
        incentive = i;
        continue;
      }
      _columns.push(col);
    }

    if (incentives > -1) {
      _columns.splice(1, 0, Columns[incentives]);
    }
    if (proposal > -1) {
      _columns.push(Columns[proposal]);
    }
    if (incentive > -1) {
      _columns.push(Columns[incentive]); 
    }
  
    return _columns;
  }, [Columns]);

  return (
    <div className="relative pt-[50px] h-full overflow-y-auto">
      <Card className="relative !rounded-b-0 !px-[12px] !pb-[64px]">
        <BgtHead
          bgtData={bgtData}
          className="inline-block !absolute left-1/2 -translate-x-1/2 -top-[26px]"
          valueClassName="text-white !text-[26px]"
          isShort={true}
        />
        <Back onBack={onBack} />
        <Nav pageData={pageData} handleClick={handleClick} />
        <Summary
          vaults={vaults}
          pageData={pageData}
          estReturnPerBGT={estReturnPerBGT}
          currentValidator={currentValidator}
          currentValidatorLoading={currentValidatorLoading}
        />
        <Incentives className="mt-[28px]" list={incentiveList} loading={loading} />
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
        <RewardWeights className="mt-[26px]" vaults={vaults} loading={loading} pageData={pageData} />
        {
          listData.length > 0 ? listData.map((d: any, idx: number) => {
            const incentives = d?.receivingVault?.activeIncentives?.reduce((acc: any, curr: any) => {
              if (!acc.find((incentive: any) => incentive?.token?.symbol === curr?.token?.symbol)) acc.push(curr);
              return acc
            }, []);
            return (
              <div className="bg-[rgba(0,0,0,0.06)] rounded-[10px] p-[17px_12px_24px] mt-[13px]">
                <div key={idx} className="w-full flex flex-wrap gap-y-[24px]">
                  {
                    columns.map((c: any, index: number) => (
                      <div
                        key={`col-${index}`}
                        className={`${
                          index % 2 === 0
                            ? (c.dataIndex === 'vaults' ? 'w-[75%]' : 'w-[60%]')
                            : (c.dataIndex === 'incentives' ? 'w-[25%]' : 'w-[40%]')
                        }`}
                      >
                        {['proposal', 'incentive'].includes(c.dataIndex) && (
                          <div className="text-[#3D405A] font-[500] text-[14px] mb-[5px] whitespace-nowrap">{c.title}</div>
                        )}
                        {['incentives'].includes(c.dataIndex) ? (
                          <div className="flex flex-col items-end gap-[4px]">
                            <div className="flex items-center justify-center">
                              {
                                incentives?.length > 0 ? incentives?.map((incentive: any, idx: number) => (
                                  <LazyImage
                                    key={idx}
                                    src={getTokenLogo(incentive?.token?.symbol)}
                                    fallbackSrc={DefaultIcon}
                                    containerClassName={clsx("shrink-0 !w-[20px] !h-[20px] object-center object-contain !rounded-full !overflow-hidden", idx > 0 && "ml-[-6px]")}
                                  />
                                )) : (
                                  <span className="text-black font-Montserrat text-[12px] font-semibold">
                                  No Incentives
                                </span>
                                )
                              }
                            </div>
                            <span className="text-black font-[500] text-[12px] mb-[5px] whitespace-nowrap leading-[90%]">
                            Incentives
                          </span>
                          </div>
                        ) : c.render(d[c.dataIndex], d)}
                      </div>
                    ))
                  }
                </div>
              </div>
            );
          }) : (
            <div className="">
              <Empty desc='No data' mt={20} />
            </div>
          )
        }
      </Card>
    </div>
  );
};

export default BgtValidatorMobile;
