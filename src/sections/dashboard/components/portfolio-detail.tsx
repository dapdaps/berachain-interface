import Value from '@/sections/dashboard/components/value';
import { useMemo } from 'react';
import Big from 'big.js';
import DappName from './dapp-name';
import ProtocolDetailTable from './protocol-detail-table';

const DashboardPortfolioDetail = (props: Props) => {
  const { dapp } = props;

  const { dappLogo, show_name, type, totalUsd, version } = dapp;

  const isLending = ['Lending', 'Yield'].includes(type);

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
              totalUsd: Big(0),
              path: it.path,
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
    <div className='mt-[18px] flex-1 border border-[#373A53] rounded-[12px] bg-white p-[11px_12px_11px_9px] md:rounded-t-[20px] md:rounded-b-[20px] md:h-full'>
      <div className='flex justify-between items-center gap-[10px]'>
        <DappName
          icon={dappLogo}
          name={`${show_name}`}
          category={type}
        />
        <Value>{totalUsd}</Value>
      </div>
      <ProtocolDetailTable isLending={isLending} tableList={tableList} />
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
