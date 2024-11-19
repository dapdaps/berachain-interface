import Basic from "./basic";
import RoundLabel from '@/sections/meme/bros/components/round-label';
import FlexTable from '@/components/flex-table';
import LazyImage from '@/components/layz-image';
import { numberFormatter } from '@/utils/number-formatter';

export default function Vote() {

  const columns: any = [
    {
      title: '#',
      dataIndex: 'sn',
      align: 'center',
      width: '10%',
      render: (text: any, record: any, index: number) => {
        return (index + 1);
      }
    },
    {
      title: 'Meme Token',
      dataIndex: 'name',
      width: '30%',
      render: (text: any, record: any) => {
        return (
          <div className="text-[#3D405A] text-[14px] font-[600] flex items-center gap-[5px]">
            <LazyImage src={record.icon} width={26} height={26} className="rounded-full" />
            <div className="">
              {record.name}
            </div>
          </div>
        );
      }
    },
    {
      title: 'Incentives',
      dataIndex: 'incentives',
      width: '30%',
      render: (text: any, record: any) => {
        return (
          <div className="text-[#3D405A] text-[14px] font-[600] flex items-center gap-[12px]">
            <div className="">
              {numberFormatter(record.incentives, 2, true, { prefix: '$', isShort: true })}
            </div>
            <button
              type="button"
              className="h-[28px] leading-[26px] px-[10px] border border-black rounded-[10px] bg-[#FFDC50] text-center text-black text-[14px] font-[600]"
            >
              Add incentives
            </button>
          </div>
        );
      }
    },
    {
      title: 'Supporters',
      dataIndex: 'supporters',
      width: '30%',
      render: (text: any, record: any) => {
        return (
          <div className="text-[#3D405A] text-[14px] font-[600] flex items-center gap-[12px]">
            <div className="">
              {numberFormatter(record.supporters, 0, true)}
            </div>
            <button
              type="button"
              className="h-[28px] leading-[26px] px-[10px] border border-black rounded-[10px] bg-[#FFDC50] text-center text-black text-[14px] font-[600]"
            >
              Vote
            </button>
          </div>
        );
      }
    },
  ];
  const list: any = [...new Array(10)].map((_, idx) => ({
    name: 'sPepe',
    icon: '/images/eth.svg',
    incentives: Math.floor(Math.random() * Math.pow(10, Math.ceil(Math.random() * 10))),
    supporters: Math.floor(Math.random() * Math.pow(10, Math.ceil(Math.random() * 10))),
  }));

  return (
    <Basic open={true} onClose={() => {}} className="w-[916px]">
      <div className="flex items-center gap-[12px] text-[20px] font-bold mt-[16px] px-[13px]">
        <span>Vote for the next round</span>
      </div>
      <div className="flex justify-between items-center mt-[10px] pl-[13px] pr-[5px]">
        <RoundLabel
          title="Round 4"
          subTitle="Dec.18, 2024 - Jan.01, 2025"
          className="w-[342px]"
        />
        <button
          type="button"
          className="h-[36px] leading-[34px] px-[27px] rounded-[10px] border border-black bg-[#FFDC50] text-center text-black text-[14px] font-[600]"
        >
          List Meme
        </button>
      </div>
      <div className="mt-[5px]">
        <FlexTable
          columns={columns}
          list={list}
          headClass="py-[12px] border-b border-b-[rgba(0,0,0,0.2)]"
          headColClass="text-[#3D405A] font-[500]"
          bodyClass="odd:bg-[unset] py-[12px]"
          bodyColClass="text-[#3D405A] text-[14px] font-[600]"
        />
      </div>
    </Basic>
  );
}
