import Value from '@/sections/dashboard/components/value';
import FlexTable, { Column } from '@/components/flex-table';
import { useMemo } from 'react';
import Big from 'big.js';
import { numberFormatter } from '@/utils/number-formatter';
import LazyImage from '@/components/layz-image';
import { DefaultIcon } from '@/sections/dashboard/utils';
import DappName from './dapp-name';

const DashboardPortfolioDetail = (props: Props) => {
  const { dapp } = props;

  const { dappLogo, show_name, type, totalUsd, version } = dapp;

  const isLending = ['Lending', 'Yield'].includes(type);

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
                  className='w-[26px] h-[26px] rounded-[50%] shrink-0 group:not(:first-child):ml-[-10px]'
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
            {record.assets.map((token: any) => token.symbol).join(' / ')}
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

  const tableList = useMemo<any[]>(() => {
    // merge same currency
    if (isLending) {
      const _tableList: any = [];
      dapp.detailList.forEach((it: any) => {
        // Supply / Borrow
        const _type = it.type;
        // const _tokenList: any = [];
        it.assets.forEach((token: any) => {
          const tokenIdx = _tableList.findIndex(
            (_it: any) => _it.symbol === token.symbol
          );
          if (tokenIdx < 0) {
            const cell = {
              symbol: token.symbol,
              decimals: token.decimals,
              logo: token.tokenLogo,
              usd: Big(token.usd || 0),
              supplyAmount: Big(0),
              borrowAmount: Big(0),
              totalUsd: Big(0)
            };
            if (_type === 'Supply') {
              cell.supplyAmount = Big(token.amount || 0);
              cell.totalUsd = Big(cell.totalUsd).plus(token.usd || 0);
            }
            if (_type === 'Borrow') {
              cell.borrowAmount = Big(token.amount || 0);
              cell.totalUsd = Big(cell.totalUsd).minus(token.usd || 0);
            }
            _tableList.push(cell);
          } else {
            if (_type === 'Supply') {
              _tableList[tokenIdx].supplyAmount = Big(
                _tableList[tokenIdx].supplyAmount
              ).plus(token.amount || 0);
              _tableList[tokenIdx].totalUsd = Big(
                _tableList[tokenIdx].totalUsd
              ).plus(token.usd || 0);
            }
            if (_type === 'Borrow') {
              _tableList[tokenIdx].borrowAmount = Big(
                _tableList[tokenIdx].borrowAmount
              ).plus(token.amount || 0);
              _tableList[tokenIdx].totalUsd = Big(
                _tableList[tokenIdx].totalUsd
              ).minus(token.usd || 0);
            }
          }
        });
      });
      return _tableList;
    }
    return dapp.detailList;
  }, [dapp, isLending]);

  return (
    <div className='mt-[18px] flex-1 border border-[#373A53] rounded-[12px] bg-white p-[11px_12px_11px_9px] md:rounded-t-[20px] md:rounded-b-none md:h-full'>
      <div className='flex justify-between items-center gap-[10px]'>
        <DappName
          icon={dappLogo}
          name={`${show_name}${version ? ' ' + version : ''}`}
          category={type}
        />
        <Value>{totalUsd}</Value>
      </div>
      <div>
        <FlexTable
          loading={false}
          columns={isLending ? LendingColumns : columns}
          list={tableList}
        />
      </div>
    </div>
  );
};

export default DashboardPortfolioDetail;

interface Props {
  dapp: any;
}

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
