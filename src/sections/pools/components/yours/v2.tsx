import Image from 'next/image';
import List from '@/sections/marketplace/components/list';
import Dropdown from '@/sections/marketplace/components/dropdown';

export default function V2List({
  data,
  maxPage,
  setPage,
  loading,
  onAction
}: any) {
  return (
    <List
      meta={[
        {
          title: 'Pair',
          key: 'pair',
          sort: false,
          width: '45%',
          render: (item: any, index: number) => {
            return (
              <div className='flex items-center gap-[12px]'>
                <div className='flex items-center'>
                  <Image
                    src={item.token0.icon || '/assets/tokens/default_icon.png'}
                    width={30}
                    height={30}
                    alt={item.token0.name}
                    className='rounded-[50%]'
                  />
                  <Image
                    src={item.token1.icon || '/assets/tokens/default_icon.png'}
                    width={30}
                    height={30}
                    alt={item.token1.name}
                    className='rounded-[50%] ml-[-8px]'
                  />
                </div>
                <div>
                  <div className='text-[16px]'>
                    {item.token0.symbol}-{item.token1.symbol}
                  </div>
                  {item.fee && (
                    <div className='text-[10px]'>{item.fee / 1e4} %</div>
                  )}
                </div>
              </div>
            );
          }
        },
        {
          title: 'You Deposit',
          key: 'deposit',
          sort: false,
          width: '20%',
          render: (item: any, index: number) => {
            return item['yours'] || '-';
          }
        },
        {
          title: 'Your Shares',
          key: 'shares',
          sort: false,
          width: '20%',
          render: (item: any, index: number) => {
            return item['yours'] || '-';
          }
        },
        {
          title: 'Action',
          key: 'position',
          sort: false,
          width: '15%',
          render: (item: any, index: number) => {
            return (
              <div>
                <Dropdown
                  list={[
                    { key: 'increase', name: 'Increase' },
                    { key: 'remove', name: 'Remove' }
                  ]}
                  value=''
                  placeholder='Manage'
                  onChange={(val) => {
                    onAction(val, item);
                  }}
                  style={{
                    height: 32,
                    width: 96,
                    padding: '0px 10px',
                    gap: 4,
                    background: '#FFDC50'
                  }}
                  dropdownStyle={{
                    top: 36
                  }}
                />
              </div>
            );
          }
        }
      ]}
      list={data}
      maxPage={maxPage}
      onPageChange={setPage}
      bodyClassName='h-[480px] overflow-y-auto'
      loading={loading}
    />
  );
}
