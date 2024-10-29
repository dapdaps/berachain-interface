import FlexTable, { Column } from '@/components/flex-table';
import { useAccount } from 'wagmi';
import React, { useEffect } from 'react';
import useUser from '@/hooks/use-user';
import LazyImage from '@/components/layz-image';
import { DefaultIcon } from '@/sections/dashboard/utils';
import { numberFormatter } from '@/utils/number-formatter';
import Big from 'big.js';
import Skeleton from 'react-loading-skeleton';
import Empty from '@/components/empty';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import useClickTracking from '@/hooks/use-click-tracking';

const DashboardWallet = (props: Props) => {
  const { tokens, loading, totalBalance } = props;

  const { address } = useAccount();
  const { accessToken, getUserInfo, userInfo } = useUser();
  const modal = useWeb3Modal();
  const { handleReport } = useClickTracking();

  const columns: Column[] = [
    {
      dataIndex: 'token',
      title: 'Token',
      render: (_, record) => (
        <div className="flex items-center gap-x-[14px]">
          <LazyImage
            src={record.logo}
            className="rounded-full w-[26px] h-[26px] flex-shrink-0"
            width={26}
            height={26}
            fallbackSrc={DefaultIcon}
          />
          <div>{record.symbol}</div>
        </div>
      ),
      width: '37%'
    },
    {
      dataIndex: 'price',
      title: 'Price',
      width: '24%',
      render: (_, record) => {
        return numberFormatter(record.price, 2, true, { prefix: '$' });
      },
    },
    {
      dataIndex: 'amount',
      title: 'Amount',
      width: '24%',
      render: (_, record) => {
        return numberFormatter(record.amount, 2, true);
      },
    },
    {
      dataIndex: 'usd',
      title: 'USD Value',
      width: '15%',
      render: (_, record) => {
        return numberFormatter(record.usd, 2, true, { prefix: '$' });
      },
    },
  ];

  useEffect(() => {
    if (!accessToken) return;
    getUserInfo();
  }, [accessToken]);

  useEffect(() => {
    handleReport('1011-001');
  }, []);

  return (
    <div className="h-full overflow-y-auto">
      <div className="bg-[#FFDC50] py-[18px] pl-[25px] pr-[13px] rounded-[10px] flex items-center gap-x-[18px] mb-[32px]">
        {
          !address || !userInfo.avatar ? (
            <div className="w-[85px] h-[85px] rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,#00D1FF_0deg,#FF008A_360deg)]" />
          ) : (
            <LazyImage
              src={userInfo.avatar}
              width={85}
              height={85}
              className="w-[85px] h-[85px] rounded-full flex-shrink-0"
            />
          )
        }
        {
          !address ? (
            <button
              className="underline"
              type="button"
              onClick={() => {
                modal.open();
              }}
            >
              Connect Wallet
            </button>
          ) : (
            <>
              <div className="grow">
                <div className="font-CherryBomb text-black text-[32px] font-[400] mb-[6px] leading-none">@{userInfo.username}</div>
                <div className="text-[14px] text-[#3D405A] font-Montserrat">
                  {address ? (address.slice(0, 6) + '...' + address.slice(-4)) : ''}
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="font-CherryBomb text-black text-[32px] font-[400] mb-[6px] leading-none">
                  {
                    loading ? (
                      <Skeleton width={140} height={32} />
                    ) : numberFormatter(totalBalance, 2, true, { prefix: '$' })
                  }
                </div>
                <div className="text-[14px] text-[#3D405A] font-Montserrat text-center">Total assets value</div>
              </div>
            </>
          )
        }
      </div>
      <FlexTable
        columns={columns}
        list={tokens}
        loading={loading}
        renderEmpty={() => (
          <div className="mt-[50px] w-full flex justify-center items-center">
            <Empty desc="No asset found" />
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
