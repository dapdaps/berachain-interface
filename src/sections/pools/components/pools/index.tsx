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
  dex
}: any) {
  const [searchVal, setSearchVal] = useState('');
  const [selectedReocrd, setSelectedRecord] = useState<any>(null);
  const [page, setPage] = useState(1);
  const isMobile = useIsMobile();

  return (
    <div className='pb-[20px]'>
      <div className='flex justify-between items-center'>
        <div className='md:px-[12px]'>
          {currentTab && (
            <SwitchTabs
              tabs={[
                { label: 'V3 Pools', value: 'v3' },
                { label: 'V2 Pools', value: 'v2' }
              ]}
              current={currentTab}
              onChange={onChangeTab}
              style={{
                width: 200,
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
            setSelectedRecord
          }}
        />
      ) : (
        <Laptop
          {...{
            pools,
            page,
            setPage,
            searchVal,
            setSelectedRecord
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
          version={currentTab}
          dex={dex}
        />
      )}
    </div>
  );
}
