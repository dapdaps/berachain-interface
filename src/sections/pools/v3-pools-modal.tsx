'use client';

import BasicModal from './components/modal';
import Big from 'big.js';
import List from '@/sections/marketplace/components/list';
import { StatusColor } from './components/status/styles';
import CircleLoading from '@/components/circle-loading';

export default function V3PoolsModal({
  token0,
  token1,
  dex,
  fee,
  open,
  onClose,
  ticksInfo,
  onPick,
  data,
  loading
}: any) {
  return (
    <BasicModal
      title={`Remove ${token0?.symbol}-${token1?.symbol}`}
      dex={dex}
      fee={fee}
      version='v3'
      open={open}
      onClose={onClose}
    >
      <div className='pb-[20px]'>
        <List
          meta={[
            {
              title: 'Range',
              key: 'range',
              sort: true,
              width: '100%',
              render: (item: any, index: number) => {
                let status = '';
                const currentTick = (ticksInfo as any)?.[item.tokenId]?.tick;
                if (Big(item.liquidity || 0).eq(0)) {
                  status = StatusColor.removed;
                } else if (currentTick) {
                  status =
                    currentTick < item.tickLower ||
                    currentTick >= item.tickUpper
                      ? StatusColor.out
                      : StatusColor.in;
                }

                return (
                  <div
                    className='flex items-center gap-[10px]'
                    onClick={() => {
                      onPick(item);
                    }}
                  >
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
            }
          ]}
          list={data}
          bodyClassName='h-[480px] overflow-y-auto'
          loading={loading}
          withoutHeader={true}
        />
      </div>
    </BasicModal>
  );
}
