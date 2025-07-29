import FlexTable, { Column } from '@/components/flex-table';
import { numberFormatter } from '@/utils/number-formatter';
import LazyImage from '@/components/layz-image';
import { DefaultIcon } from '@/sections/dashboard/utils';
import Big from 'big.js';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

export function calcDebtRatio(borrowAmount: Big.Big, supplyAmount: Big.Big) {
  if (Big(supplyAmount).eq(0)) {
    if (Big(borrowAmount).gt(0)) {
      return Big(100);
    }
    return Big(0);
  }
  if (Big(borrowAmount).eq(0)) {
    return Big(0);
  }
  return Big(borrowAmount).div(supplyAmount).times(100);
}

export default function Laptop({ isLending, tableList }: any) {
  const router = useRouter();
  const columns: Column[] = [
    {
      title: 'Pool',
      dataIndex: 'pool',
      align: 'left',
      width: '55%',
      render: (text, record) => {
        if (!record.assets) {
          return null;
        }
        return (
          <div className='flex items-center gap-[14px] text-black text-[14px]'>
            <div className='items-center flex text-black text-[16px] font-[600]'>
              {record.assets.map((token: any, idx: number) => (
                <div
                  className={clsx(
                    'w-[26px] h-[26px] rounded-[50%] shrink-0',
                    idx > 0 ? 'ml-[-10px]' : ''
                  )}
                  key={idx}
                >
                  <LazyImage
                    src={token.tokenLogo}
                    alt=''
                    width={26}
                    height={26}
                    style={{
                      borderRadius: '50%'
                    }}
                    fallbackSrc={DefaultIcon}
                  />
                </div>
              ))}
            </div>
            <div>
              {record.assets.map((token: any) => token.symbol).join(' / ')}
              {(record.dappType === "Yield" && record.dappName?.toLowerCase() === "kodiak") ? "(Bault)" : ""}
            </div>
            <div>{record.version}</div>
          </div>
        );
      }
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      align: 'left',
      width: '30%',
      render: (text, record) => {
        if (!record.assets) {
          return null;
        }
        return (
          <div className='flex flex-col text-black text-[14px] gap-[5px] font-[600]'>
            {record.assets.map((asset: any, idx: number) => (
              <span key={idx}>
                {numberFormatter(asset.amount, 6, true)} {asset.symbol}
              </span>
            ))}
          </div>
        );
      }
    },
    {
      title: 'Value',
      dataIndex: 'value',
      align: 'right',
      width: '15%',
      render: (text, record) => {
        return (
          <div className='font-[600]'>
            {numberFormatter(record.totalUsd, 2, true, { prefix: '$' })}
          </div>
        );
      }
    }
  ];

  const LendingColumns: Column[] = [
    {
      title: 'Pool',
      dataIndex: 'pool',
      align: 'left',
      width: '20%',
      render: (text: string, record: any) => {
        return (
          <div className='flex items-center gap-[14px] text-black text-[16px] font-[600]'>
            <div className='flex items-center text-white text-[14px]'>
              <div className='w-[26px] h-[26px] rounded-[50%] shrink-0 group:not(:first-child):ml-[-10px]'>
                <LazyImage
                  src={record.logo}
                  alt=''
                  width={26}
                  height={26}
                  style={{
                    borderRadius: '50%'
                  }}
                  fallbackSrc={DefaultIcon}
                />
              </div>
            </div>
            {record.symbol}
            {(record.dappType === "Yield" && record.dappName?.toLowerCase() === "kodiak") ? "(Bault)" : ""}
          </div>
        );
      }
    },
    {
      title: 'Supply',
      dataIndex: 'supply',
      align: 'left',
      width: '25%',
      render: (text, record) => {
        if (Big(record.supplyAmount).gt(0)) {
          return (
            <div className='font-[600]'>
              {numberFormatter(record.supplyAmount, 6, true)}
              {record.symbol}
            </div>
          );
        }
        return '-';
      }
    },
    {
      title: 'Borrow',
      dataIndex: 'borrow',
      align: 'left',
      width: '25%',
      render: (text, record) => {
        if (Big(record.borrowAmount).gt(0)) {
          return (
            <div className='font-[600]'>
              {numberFormatter(record.borrowAmount, 6, true)}
              {record.symbol}
            </div>
          );
        }
        return '-';
      }
    },
    {
      title: 'Debt Ratio',
      dataIndex: 'debtRatio',
      align: 'left',
      width: '15%',
      render: (text, record) => {
        return (
          <div className='font-[600]'>
            {calcDebtRatio(record.borrowAmount, record.supplyAmount).toFixed(2)}
            %
          </div>
        );
      }
    },
    columns[2]
  ];
  return (
    <FlexTable
      loading={false}
      columns={isLending ? LendingColumns : columns}
      list={tableList}
      onRow={(record) => {
        // if (!record?.path) return;
        // router.push(record.path);
      }}
    />
  );
}
