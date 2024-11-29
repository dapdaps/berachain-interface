import Skeleton from 'react-loading-skeleton';
import React from 'react';
import Popover, { PopoverPlacement } from '@/components/popover';
import Button from '@/components/button';
import { Props } from '@/sections/Lending/components/markets/index';

const MarketsLaptop = (props: Props) => {
  const { loading, loadingLength = 4, columns, markets, depositPanel, withdrawPanel, laptopGridCols, onDeposit, onWithdraw } = props;

  return (
    <div className="rounded-lg p-4">
      <div className={`grid ${laptopGridCols} gap-4 font-bold mb-2`}>
        {
          columns.map((col: any, idx: number) => (
            <div key={idx} className="font-[500] text-[#3D405A]">
              {col.title}
            </div>
          ))
        }
      </div>
      {
        loading ? [...new Array(loadingLength)].map((_, i) => (
          <div
            key={i}
            className={`grid ${laptopGridCols} gap-4 items-center py-[10px]`}
          >
            {
              columns.map((col: any, idx: number) => (
                <Skeleton key={idx} width={col.skeletonWidth} height={39} />
              ))
            }
          </div>
        )) : markets.map((market: any, index: number) => (
          <div
            key={`row-${index}`}
            className={`grid ${laptopGridCols} gap-4 items-center py-[10px]`}
          >
            {
              columns.map((col: any, idx: number) => {
                if (typeof col.render === 'function') {
                  return (
                    <div className="font-[600] text-[16px]" key={idx}>
                      {col.render(market[col.dataIndex], market, index)}
                    </div>
                  )
                }
                if (col.type === 'asset') {
                  return (
                    <div className="flex items-center space-x-[12px]" key={idx}>
                      <img src={market.icon} alt={market.symbol} className="w-[30px] h-[30px]" />
                      <div>
                        <div className="font-[600] text-[16px]">{market.symbol}</div>
                        <div className="text-[10px] text-black">{market.name}</div>
                      </div>
                    </div>
                  );
                }
                if (col.type === 'assets') {
                  return (
                    <div className="flex items-center space-x-[12px]" key={idx}>
                      <div className="flex items-center">
                        {
                          market.underlyingTokens.map((t: any, i: number) => (
                            <img
                              src={t.icon}
                              alt={t.symbol}
                              className="w-[30px] h-[30px]"
                              style={{ marginLeft: i > 0 ? -10 : 0 }}
                            />
                          ))
                        }
                      </div>
                      <div className="font-[600] text-[16px]">{market.symbol}</div>
                    </div>
                  );
                }
                if (col.type === 'action') {
                  const disabled = col.actionDisabled?.(market, index);
                  return (
                    <div className="flex space-x-[10px]" key={idx}>
                      <Popover
                        placement={PopoverPlacement.BottomRight}
                        content={depositPanel?.(market, index)}
                      >
                        <Button
                          style={{ width: 32 }}
                          onClick={() => onDeposit?.(market, index)}
                          disabled={disabled?.deposit}
                        >
                          +
                        </Button>
                      </Popover>
                      <Popover
                        placement={PopoverPlacement.BottomRight}
                        content={withdrawPanel?.(market, index)}
                      >
                        <Button
                          style={{ width: 32 }}
                          onClick={() => onWithdraw?.(market, index)}
                          disabled={disabled?.withdraw}
                        >
                          -
                        </Button>
                      </Popover>
                    </div>
                  )
                }
                return (
                  <div className="font-[600] text-[16px]" key={idx}>{market[col.dataIndex]}</div>
                )
              })
            }
          </div>
        ))
      }
    </div>
  );
};

export default MarketsLaptop;
