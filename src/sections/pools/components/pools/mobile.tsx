import { useMemo } from 'react';
import List from '@/components/flex-table';
import PoolTable from '../pool-table';
import Empty from '@/components/empty';

const PAGE_SIZE = 9;

export default function Mobile({
  pools,
  page,
  setPage,
  searchVal,
  setSelectedRecord
}: any) {
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
    <div className='mt-[20px] h-full'>
      <List
        columns={[
          {
            title: 'Pool',
            dataIndex: 'pool',
            width: '70%',
            render: (_: any, record) => {
              return (
                <PoolTable
                  item={record}
                  onClick={() => {
                    setSelectedRecord(record);
                  }}
                />
              );
            }
          },
          {
            title: 'TVL',
            dataIndex: 'TVL',
            width: '30%',
            align: 'right',
            render: (_, record) => {
              return record['tvl'] || '-';
            }
          }
        ]}
        list={data}
        wrapperClass='h-[calc(100%-200px)] overflow-y-auto'
        bodyClass='py-[14px] h-[58px]'
        showHeader={false}
        renderEmpty={() => (
          <div className='mt-[50px] w-full flex justify-center items-center'>
            <Empty desc='No Pools.' />
          </div>
        )}
      />
    </div>
  );
}
