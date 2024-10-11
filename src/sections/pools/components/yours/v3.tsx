import Image from 'next/image';
import List from '@/sections/marketplace/components/list';
import Dropdown from '@/sections/marketplace/components/dropdown';
import CircleLoading from '@/components/circle-loading';
import { StatusColor } from '../status/styles';
import Big from 'big.js';

export default function V3List({
  data,
  maxPage,
  setPage,
  loading,
  ticksInfo,
  onAction
}: any) {
  return (
    <List
      meta={[
        {
          title: 'Position',
          key: 'position',
          sort: false,
          width: '28%',
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
          title: 'Range',
          key: 'range',
          sort: true,
          width: '30%',
          render: (item: any, index: number) => {
            let status = '';
            const currentTick = ticksInfo[item.tokenId]?.tick;
            if (Big(item.liquidity || 0).eq(0)) {
              status = StatusColor.removed;
            } else if (currentTick) {
              status =
                currentTick < item.tickLower || currentTick >= item.tickUpper
                  ? StatusColor.out
                  : StatusColor.in;
            }

            return (
              <div className='flex items-center gap-[10px]'>
                {status ? (
                  <div
                    className='w-[8px] h-[8px] rounded-[50%]'
                    style={{ background: status }}
                  />
                ) : (
                  <CircleLoading size={8} />
                )}
                <div className='text-[14px]'>
                  <div className='flex gap-[3px]'>
                    <div className='text-[#979ABE]'>Min:</div>
                    <div>
                      {item.lowerPrice} {item.token1.symbol} per{' '}
                      {item.token0.symbol}
                    </div>
                  </div>
                  <div className='flex gap-[3px]'>
                    <div className='text-[#979ABE]'>Max:</div>
                    <div>
                      {item.upperPrice} {item.token1.symbol} per{' '}
                      {item.token0.symbol}
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        },
        {
          title: 'Unclaimed Fees',
          key: ' fees',
          sort: false,
          width: '15%',
          render: (item: any, index: number) => {
            return item['yours'] || '-';
          }
        },
        {
          title: 'My Position',
          key: 'position',
          sort: false,
          width: '15%',
          render: (item: any, index: number) => {
            return item['yours'] || '-';
          }
        },
        {
          title: 'Action',
          key: 'position',
          sort: false,
          width: '12%',
          render: (item: any, index: number) => {
            return (
              <div>
                <Dropdown
                  list={[
                    { key: 'increase', name: 'Increase' },
                    { key: 'remove', name: 'Remove' },
                    { key: 'claim', name: 'Claim Rewards' }
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
                    top: 36,
                    width: 130
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
