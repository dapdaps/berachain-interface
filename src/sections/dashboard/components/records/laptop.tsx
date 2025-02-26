import FlexTable, { Column } from '@/components/flex-table';
import LazyImage from '@/components/layz-image';
import { DefaultIcon, txTimeFormatter } from '@/sections/dashboard/utils';
import clsx from 'clsx';

export default function Laptop({
  records,
  loading,
  pageIndex,
  onPrev,
  onNext,
  hasMore,
  formatColumns = (_columns: Column[]) => _columns,
  showHeader = true,
  tableBodyClassName,
  className
}: any) {
  const columns: Column[] = [
    {
      dataIndex: 'token',
      title: 'Record',
      render: (_, record) => (
        <div className='flex items-center gap-x-[14px]'>
          <div className='rounded-[8px] w-[30px] h-[30px] flex-shrink-0 bg-black flex items-center justify-center'>
            <div className="relative">
              <LazyImage
                src={record.dapp_logo}
                width={30}
                height={30}
                className='rounded-[8px]'
                fallbackSrc={DefaultIcon}
              />
              {
                record.isBeraTown && (
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
          <div className='text-[16px]'>{record.dapp_name}</div>
        </div>
      ),
      width: '28%'
    },
    {
      dataIndex: 'executed',
      title: 'Executed',
      render: (_, record) => {
        return record.executed;
      }
    },
    {
      dataIndex: 'status',
      title: 'Status',
      width: '13%',
      render: () => {
        return <div className='text-[14px]'>Success</div>;
      }
    },
    {
      dataIndex: 'time',
      title: <span className='pr-[34px]'>Time</span>,
      width: '24%',
      align: 'right',
      render: (_, record) => {
        return (
          <div className='pr-[20px] text-[14px]'>
            {txTimeFormatter(record.tx_time)}
          </div>
        );
      }
    }
  ];

  return (
    <div className={clsx("h-full overflow-y-auto", className)}>
      <FlexTable
        showHeader={showHeader}
        bodyClass={tableBodyClassName}
        columns={formatColumns(columns)}
        list={records}
        loading={loading}
        pagination={
          <div className='flex justify-end items-center gap-[20px] py-[10px] px-[5px]'>
            <button
              type='button'
              className='px-[4px]'
              disabled={pageIndex === 1}
              onClick={onPrev}
            >
              <svg
                width='8'
                height='14'
                viewBox='0 0 8 14'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  opacity={pageIndex === 1 ? 0.3 : 1}
                  d='M6.80005 1L2.00005 7L6.80005 13'
                  stroke='black'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
              </svg>
            </button>
            <button
              type='button'
              className='px-[4px]'
              disabled={!hasMore}
              onClick={onNext}
            >
              <svg
                width='8'
                height='14'
                viewBox='0 0 8 14'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  opacity={hasMore ? 1 : 0.3}
                  d='M1.80005 1L6.60005 7L1.80005 13'
                  stroke='black'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
              </svg>
            </button>
          </div>
        }
      />
    </div>
  );
}
