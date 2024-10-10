import FlexTable, { Column } from '@/components/flex-table';
import { useAccount } from 'wagmi';
import { useEffect } from 'react';
import useUser from '@/hooks/use-user';
import { useUserStore } from '@/stores/user';
import LazyImage from '@/components/layz-image';

const DashboardWallet = (props: Props) => {
  const {} = props;

  const userInfo = useUserStore((store: any) => store.user);
  const { address } = useAccount();
  const { accessToken, getUserInfo } = useUser();

  const columns: Column[] = [
    {
      dataIndex: 'token',
      title: 'Token',
      render: (_, record) => (
        <div className="flex items-center gap-x-[14px]">
          <div className="rounded-[50%] w-[26px] h-[26px] flex-shrink-0" />
          <div>{record.token}</div>
        </div>
      ),
      width: '37%'
    },
    {
      dataIndex: 'price',
      title: 'Price',
      width: '24%'
    },
    {
      dataIndex: 'amount',
      title: 'Amount',
      width: '24%'
    },
    {
      dataIndex: 'usd',
      title: 'USD Value',
      width: '15%'
    },
  ];

  const data = [...new Array(10)].map((_, i) => ({
    token: 'WETH' + i,
    price: `$${i * 100}`,
    amount: `$${i * 100}`,
    usd: `$${i * 100}`
  }));

  useEffect(() => {
    if (!accessToken) return;
    getUserInfo();
  }, [accessToken]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="bg-[#FFDC50] py-[18px] pl-[25px] pr-[13px] rounded-[10px] flex items-center gap-x-[18px] mb-[32px]">
        <LazyImage
          src={userInfo.avatar}
          width={85}
          height={85}
          className="w-[85px] h-[85px] rounded-full flex-shrink-0"
        />
        <div className="grow">
          <div className="font-CherryBomb text-black text-[32px] font-[400] mb-[6px] leading-none">@{userInfo.username}</div>
          <div className="text-[14px] text-[#3D405A] font-Montserrat">
            {address ? (address.slice(0, 6) + '...' + address.slice(-4)) : ''}
          </div>
        </div>
        <div className="flex-shrink-0">
          <div className="font-CherryBomb text-black text-[32px] font-[400] mb-[6px] leading-none">$2562.03</div>
          <div className="text-[14px] text-[#3D405A] font-Montserrat text-center">Total assets value</div>
        </div>
      </div>
      <FlexTable columns={columns} list={data} loading={false} />
    </div>
  );
};

export default DashboardWallet;

interface Props {
}
