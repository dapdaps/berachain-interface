import FlexTable, { Column } from '@/components/flex-table';

const DashboardWallet = (props: Props) => {
  const {} = props;

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

  return (
    <div>
      <div className="bg-[#FFDC50] py-[18px] pl-[25px] pr-[13px] rounded-[10px] flex items-center gap-x-[18px] mb-[32px]">
        <div className="w-[85px] h-[85px] rounded-[50%] flex-shrink-0"></div>
        <div className="grow">
          <div className="font-CherryBomb text-black text-[32px] font-[400] mb-[6px] leading-none">@beraman</div>
          <div className="text-[14px] text-[#3D405A] font-Montserrat">0x3bcb...b717</div>
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
