import Card from '@/components/card';
import Empty from '@/components/empty';
import LazyImage from '@/components/layz-image';
import BgtHead from '@/sections/bgt/components/bgt-head';
import Back from '@/sections/bgt/validator/components/back';
import Incentives from '@/sections/bgt/validator/components/incentives';
import Nav from '@/sections/bgt/validator/components/nav';
import RewardWeights from '@/sections/bgt/validator/components/reward-weights';
import Summary from '@/sections/bgt/validator/components/summary';
import { DefaultIcon, getTokenLogo } from '@/sections/dashboard/utils';
import clsx from 'clsx';
import { useMemo } from 'react';
import IncentivesEarned from './components/incentives-earned';
import Queued from './components/queued';
import YourBoosts from './components/your-boosts';
import IncentivesContextProvider from "./content/incentives";
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
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 my-[20px]">
          <div className="flex flex-col gap-4 flex-1 p-4 border border-[#9999] rounded-[8px]">
            <YourBoosts />
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
        <Incentives className="mt-[28px]" list={incentiveList} loading={loading} />
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
                        className={`${index % 2 === 0
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
