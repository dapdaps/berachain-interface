import { useContext } from 'react';
import clsx from 'clsx';
import DashboardRecords from '../records';
import Loading from '@/components/loading';
import Popover, { PopoverPlacement, PopoverTrigger } from '@/components/popover';
import { FeeRebaseContext } from '@/sections/dashboard/components/fee-rebate/context';
import { ActionRecord } from '@/sections/dashboard/components/fee-rebate/hooks';
import * as dateFns from 'date-fns';
import chains from '@/configs/chains';
import LazyImage from '@/components/layz-image';
import { DefaultIcon } from '@/sections/dashboard/utils';
import { formatTokenAction } from '@/sections/dashboard/components/fee-rebate/utils';
import { usePriceStore } from '@/stores/usePriceStore';

interface FeeRebateListProps {
  className?: string;
}

const FeeRebateList = ({ className }: FeeRebateListProps) => {
  const {
    list,
    listPage,
    listTotal,
    listTotalPage,
    listLoading,
    handleSelected,
    hasSelected,
    refunding,
    handleRefund,
    selectedList,
    hasPrevPage,
    hasNextPage,
    handlePrevPage,
    handleNextPage,
  } = useContext(FeeRebaseContext);
  const prices = usePriceStore((store) => store.price);

  return (
    <div className={clsx('flex flex-col gap-2', className)}>
      <DashboardRecords
        className="max-h-[450px]"
        isReport={false}
        showHeader={false}
        pageIndex={listPage ?? 1}
        pageTotal={listTotalPage ?? 0}
        loading={listLoading}
        hasMore={hasNextPage}
        records={list}
        tableBodyClassName={(record: ActionRecord) => {
          let _className = 'odd:bg-[unset] hover:bg-[rgba(0,0,0,0.06)] transition-all duration-150';
          if (record.refund_status === 1) {
            _className += ' opacity-50';
          }
          return _className;
        }}
        onNext={() => handleNextPage?.()}
        onPrev={() => handlePrevPage?.()}
        formatColumns={(columns) => {
          return columns.map((c) => {
            if (c.dataIndex === 'token') {
              c.render = ((_: any, record: ActionRecord) => (
                <div className='flex items-center gap-x-[14px]'>
                  <div className='rounded-[8px] w-[30px] h-[30px] flex-shrink-0 bg-black flex items-center justify-center'>
                    <div className="relative">
                      <LazyImage
                        src={record.dapp_logo || ''}
                        width={30}
                        height={30}
                        className='rounded-[8px]'
                        fallbackSrc={DefaultIcon}
                      />
                      {
                        record.source === 'BeraTown' && (
                          <img
                            src="/images/logo.svg"
                            alt=""
                            width={21}
                            height={21}
                            className="rounded-full absolute right-[-3px] bottom-[-2px]"
                          />
                        )
                      }
                    </div>
                  </div>
                  <div className='text-[16px]'>{record.template}</div>
                </div>
              )) as any
            }
            if (c.dataIndex === 'time') {
              c.width = '37%';
              c.render = ((_: any, record: ActionRecord) => {
                const _selected = selectedList?.some?.((_it) => _it.id === record.id);
                return (
                  <div className='pr-[20px] text-[14px] flex justify-end items-center gap-[6px] whitespace-nowrap'>
                    <div>{dateFns.format(record.create_time, 'yyyy-MM-dd hh:mm:ss')}</div>
                    <a href={`${chains[80094].blockExplorers.default.url}tx/${record.tx_id}`} target="_blank">
                      <img src="/images/dashboard/icon-link.svg" alt="" className="w-[11px] h-[11px]" />
                    </a>
                    <Popover
                      content={record.refund_status === 1 ? (
                        <div className="w-[154px] rounded-[10px] border border-black bg-[#FFFDEB] shadow-[10px_10px_0px_0px_rgba(0,0,0,0.25)] p-[13px_8px_12px] text-black font-montserrat text-[14px] font-semibold leading-[100%]">
                          This Txn has been already rebate fee
                        </div>
                      ) : null}
                      placement={PopoverPlacement.Top}
                      trigger={PopoverTrigger.Hover}
                      contentClassName="z-[1200]"
                      offset={10}
                      closeDelayDuration={0}
                    >
                      <div
                        className={clsx(
                          'ml-[7px] flex justify-center items-center w-[20px] h-[20px] rounded-[6px] border border-black transition-all duration-150',
                          _selected ? 'bg-[#FFDC50]' : 'bg-white',
                          (record.refund_status === 1 || refunding) ? '!cursor-not-allowed !opacity-50' : 'cursor-pointer'
                        )}
                        onClick={() => handleSelected?.(record as ActionRecord)}
                      >
                        <img
                          src="/images/dashboard/icon-check.svg"
                          alt=""
                          className={clsx(
                            'w-[11px] h-[9px] transition-all duration-150',
                            _selected ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                      </div>
                    </Popover>
                  </div>
                );
              }) as any
            }
            if (c.dataIndex === 'executed') {
              c.render = ((_: any, record: ActionRecord) => formatTokenAction(record, prices)) as any
            }
            return c;
          }).filter((c) => c.dataIndex !== 'status');
        }}
      />
      <button
        className="mt-[20px] w-full h-[46px] flex border border-black justify-center items-center gap-[10px] bg-[#FFDC50] rounded-[10px] font-[600] disabled:opacity-50 disabled:!cursor-not-allowed text-[18px] text-black"
        onClick={handleRefund}
        disabled={refunding || listLoading || !hasSelected}
      >
        {refunding && (<Loading size={16} />)}
        <div className="">Request {selectedList?.length || 0} Fee Rebate</div>
      </button>
    </div>
  );
};

export default FeeRebateList;
