import { useState } from 'react';
import SearchBox from '@/sections/marketplace/components/searchbox';
import SwitchTabs from '@/components/switch-tabs';
import AddLiquidityModal from '../../add-liquidity-modal';
import Laptop from './laptop';
import Mobile from './mobile';
import useIsMobile from '@/hooks/use-isMobile';

export default function Pools({
  pools = [],
  onChangeTab,
  currentTab,
  dex,
  tabs,
  loading
}: any) {
  const [searchVal, setSearchVal] = useState('');
  const [selectedReocrd, setSelectedRecord] = useState<any>(null);
  const [page, setPage] = useState(1);
  const isMobile = useIsMobile();

  return (
    <div className='pb-[20px] md:h-full'>
      <div className='flex justify-between items-center'>
        <div className='md:px-[12px]'>
          {currentTab && (
            <SwitchTabs
              tabs={tabs}
              current={currentTab}
              onChange={onChangeTab}
              style={{
                width: tabs.length * 100,
                height: 40,
                padding: 4
              }}
              tabStyle={{
                fontSize: 14
              }}
              className='md:bg-[#DFDCC4] md:border-none md:rounded-[12px]'
              cursorClassName='md:rounded-[12px]'
            />
          )}
        </div>
        <div className='md:hidden'>
          <SearchBox value={searchVal} onChange={setSearchVal} />
        </div>
      </div>
      {isMobile ? (
        <Mobile
          {...{
            pools,
            page,
            setPage,
            searchVal,
            setSelectedRecord,
            type: currentTab,
            loading
          }}
        />
      ) : (
        <Laptop
          {...{
            pools,
            page,
            setPage,
            searchVal,
            setSelectedRecord,
            type: currentTab,
            loading
          }}
        />
      )}
      {!!selectedReocrd && (
        <AddLiquidityModal
          open={!!selectedReocrd}
          onClose={() => {
            setSelectedRecord(null);
          }}
          token0={selectedReocrd.token0}
          token1={selectedReocrd.token1}
          fee={selectedReocrd.fee}
          version={selectedReocrd.version}
          dex={dex}
        />
      )}
    </div>
  );
}
