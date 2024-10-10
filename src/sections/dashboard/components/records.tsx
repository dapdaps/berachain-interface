import FlexTable, { Column } from '@/components/flex-table';

const DashboardRecords = (props: Props) => {
  const {} = props;
  const columns: Column[] = [
    {
      dataIndex: 'token',
      title: 'Record',
      render: (_, record) => (
        <div className="flex items-center gap-x-[14px]">
          <div className="rounded-[8px] w-[30px] h-[30px] flex-shrink-0 bg-black flex items-center justify-center">
            <div></div>
          </div>
          <div>{record.token}</div>
        </div>
      ),
      width: '28%'
    },
    {
      dataIndex: 'executed',
      title: 'Executed',
      render: () => (<div></div>)
    },
    {
      dataIndex: 'status',
      title: 'Status',
      width: '13%'
    },
    {
      dataIndex: 'time',
      title: (<span className="pr-[34px]">Time</span>),
      width: '24%',
      align: 'right',
      render: (_, record) => (<div className="pr-[20px]">{record.time}</div>)
    },
  ];

  const data = [...new Array(10)].map((_, i) => ({
    token: 'Ooga Booga' + i,
    status: 'Success',
    amount: `$${i * 100}`,
    time: '2023-10-20 10:45:45'
  }));
  return (
    <div className="h-full overflow-y-auto">
      <FlexTable columns={columns} list={data} loading={false} />
    </div>
  );
};

export default DashboardRecords;

interface Props {}
