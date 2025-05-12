import FlexTable, { Column } from '@/components/flex-table';
import React, { useEffect } from 'react';
import LazyImage from '@/components/layz-image';
import { DefaultIcon } from '@/sections/dashboard/utils';
import { numberFormatter } from '@/utils/number-formatter';
import Big from 'big.js';
import Empty from '@/components/empty';
import useClickTracking from '@/hooks/use-click-tracking';
import UserCard from './user-card';
import useIsMobile from '@/hooks/use-isMobile';

const DashboardWallet = (props: Props) => {
  const { tokens, loading, totalBalance } = props;

  const { handleReport } = useClickTracking();
  const isMobile = useIsMobile();

  const columns: Column[] = [
    {
      dataIndex: 'token',
      title: 'Token',
      render: (_, record) => (
        <div className='flex items-center gap-x-[14px]'>
          <LazyImage
            src={record.logo}
            className='rounded-full w-[26px] h-[26px] flex-shrink-0'
            width={26}
            height={26}
            fallbackSrc={DefaultIcon}
          />
          <div>{record.symbol}</div>
        </div>
      ),
      width: '40%'
    },
    // {
    //   dataIndex: 'price',
    //   title: 'Price',
    //   width: '24%',
    //   render: (_, record) => {
    //     return numberFormatter(record.price, 2, true, { prefix: '$' });
    //   }
    // },
    {
      dataIndex: 'amount',
      title: 'Amount',
      width: '30%',
      align: 'right',
      render: (_, record) => {
        return numberFormatter(record.amount, 2, true);
      }
    },
    {
      dataIndex: 'usd',
      title: 'USD Value',
      width: '30%',
      align: 'right',
      render: (_, record) => {
        return numberFormatter(record.usd, 2, true, { prefix: '$' });
      }
    }
  ];

  useEffect(() => {
    handleReport(isMobile ? '1018-001' : '1011-001');
  }, [isMobile]);

  return (
    <div className='h-full overflow-y-auto'>
      <UserCard type="wallet" loading={loading} totalBalance={totalBalance} />
      <FlexTable
        columns={columns}
        list={tokens}
        loading={loading}
        renderEmpty={() => (
          <div className='mt-[50px] w-full flex justify-center items-center'>
            <Empty desc='No asset found' />
          </div>
        )}
      />
    </div>
  );
};

export default DashboardWallet;

interface Props {
  tokens: any;
  totalBalance?: Big.Big;
  loading?: boolean;
}
