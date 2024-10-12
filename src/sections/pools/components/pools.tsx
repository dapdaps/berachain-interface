import { useState, useMemo } from 'react';
import PoolTable from './pool-table';
import SearchBox from '@/sections/marketplace/components/searchbox';
import List from '@/sections/marketplace/components/list';
import SwitchTabs from '@/components/switch-tabs';
import AddLiquidityModal from '../add-liquidity-modal';

const PAGE_SIZE = 9;

export default function Pools({
  pools = [],
  onChangeTab,
  currentTab,
  dex
}: any) {
  const [searchVal, setSearchVal] = useState('');
  const [selectedReocrd, setSelectedRecord] = useState<any>(null);
  const [page, setPage] = useState(1);

  const list = useMemo(
    () =>
      pools.filter((pool: any) => {
        let flag = true;
        if (
          searchVal &&
          !(
            pool.token0.name.toLowerCase().includes(searchVal.toLowerCase()) ||
            pool.token0.symbol
              .toLowerCase()
              .includes(searchVal.toLowerCase()) ||
            pool.token1.name.toLowerCase().includes(searchVal.toLowerCase()) ||
            pool.token1.symbol.toLowerCase().includes(searchVal.toLowerCase())
          )
        )
          flag = false;
        return flag;
      }),
    [pools, searchVal]
  );

  const maxPage = useMemo(() => {
    return Math.ceil(list.length / PAGE_SIZE) || 1;
  }, [list]);

  const data = useMemo(
    () => list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [list, page]
  );

  return (
    <div className='pb-[20px]'>
      <div className='flex justify-between items-center'>
        <div>
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
                fontSize: 14,
                fontWeight: 'normal'
              }}
            />
          )}
        </div>
        <SearchBox value={searchVal} onChange={setSearchVal} />
      </div>
      <div className='mt-[20px]'>
        <List
          meta={[
            {
              title: '#',
              key: '#',
              sort: false,
              width: '5%',
              render: (item: any, index: number) => {
                return item.id;
              }
            },
            {
              title: 'Pool',
              key: 'pool',
              sort: false,
              width: '50%',
              render: (item: any, index: number) => {
                return <PoolTable item={item} />;
              }
            },
            {
              title: 'TVL',
              key: 'TVL',
              sort: true,
              width: '15%',
              render: (item: any, index: number) => {
                return item['tvl'] || '-';
              }
            },
            {
              title: ' 24h Volume',
              key: ' 24h Volume',
              sort: true,
              width: '15%',
              render: (item: any, index: number) => {
                return item['yours'] || '-';
              }
            },
            {
              title: ' 24h Fees',
              key: ' 24h Fees',
              sort: true,
              width: '15%',
              render: (item: any, index: number) => {
                return item['yours'] || '-';
              }
            }
          ]}
          list={data}
          maxPage={maxPage}
          onPageChange={setPage}
          bodyClassName='h-[480px] overflow-y-auto'
          onItemClick={(item: any) => {
            setSelectedRecord(item);
          }}
        />
      </div>
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
