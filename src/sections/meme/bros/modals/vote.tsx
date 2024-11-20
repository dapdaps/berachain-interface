import Basic from "./basic";
import RoundLabel from '@/sections/meme/bros/components/round-label';
import FlexTable from '@/components/flex-table';
import LazyImage from '@/components/layz-image';
import { numberFormatter } from '@/utils/number-formatter';
import Pager from '@/components/pager';
import Popover, { PopoverPlacement } from '@/components/popover';

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
            <Popover
              contentClassName="z-[200]"
              placement={PopoverPlacement.Right}
              content={!record.voted ? (
                <div className="border border-black rounded-[20px] bg-[#FFFDEB] shadow-shadow1 p-[12px_10px_15px_13px] text-[14px] text-black font-[400] leading-[120%]">
                  <div className="max-w-[212px]">
                    Each round can only vote for one MEME token once, after voting can not be changed.
                  </div>
                  <div className="mt-[9px] flex justify-center items-center">
                    <button
                      type="button"
                      className="h-[28px] leading-[26px] px-[10px] border border-black disabled:cursor-[default!important] rounded-[10px] bg-[#FFDC50] flex justify-center items-center gap-[5px] text-center text-black text-[14px] font-[600]"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              ) : null}
            >
              <button
                type="button"
                className="h-[28px] leading-[26px] px-[10px] border border-black disabled:cursor-[default!important] rounded-[10px] bg-[#FFDC50] flex justify-center items-center gap-[5px] text-center text-black text-[14px] font-[600]"
                style={record.voted ? {
                  background: '#7CB424',
                  borderColor: '#7CB424',
                  color: '#FFF',
                  borderRadius: 14,
                } : {}}
                disabled={record.voted}
              >
                {
                  record.voted ?
                    (
                      <>
                        <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 3.5L4.5 7L10.5 1" stroke="white" strokeWidth="2" />
                        </svg>
                        <div>You Voted</div>
                      </>
                    ) :
                    'Vote'
                }
              </button>
            </Popover>
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
    voted: idx % 5 === 0,
  }));

  return (
    <Basic
      open={true} onClose={() => {
    }} className="w-[916px]"
    >
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
          bodyClass="border-b border-b-[rgba(0,0,0,0.2)] max-h-[calc(100dvh_-_350px)] overflow-y-auto"
          rowClass="odd:bg-[unset] py-[12px] hover:bg-[rgba(0,0,0,0.06)]"
          colClass="text-[#3D405A] text-[14px] font-[600]"
          pagination={(
            <div className="pt-[12px] flex justify-end items-center">
              <Pager maxPage={10} onPageChange={() => {}} />
            </div>
          )}
        />
      </div>
    </Basic>
  );
}
