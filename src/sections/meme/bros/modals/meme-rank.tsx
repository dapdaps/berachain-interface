import Basic from "./basic";
import FlexTable from "@/components/flex-table";
import Empty from "@/components/empty";
import Image from "next/image";

export default function MemeRank({ open, onClose }: any) {
  return (
    <Basic
      open={open}
      onClose={onClose}
      className="w-full text-[14px] font-medium"
    >
      <div className="text-[20px] font-bold">Meme Rank</div>
      <div className="text-[14px] font-semibold leading-none">Round 3</div>
      <div className="text-[14px] font-semibold leading-none">
        Dec.18, 2024 - Jan.01, 2025
      </div>
      <div className="mt-[16px]">
        <FlexTable
          rowClass="h-[54px] !rounded-[10px]"
          columns={[
            {
              dataIndex: "index",
              title: "Index",
              render: (_, record) => {
                return <div className="text-[14px] font-semibold">1</div>;
              },
              width: "10%"
            },
            {
              dataIndex: "token",
              title: "Token",
              render: (_, record) => (
                <div className="flex items-center gap-[6px]">
                  <Image
                    src="/assets/tokens/bera.svg"
                    className="rounded-full flex-shrink-0"
                    width={26}
                    height={26}
                    alt="Token"
                  />
                  <div className="text-[14px] font-semibold">sPepe</div>
                </div>
              ),
              width: "45%"
            },
            {
              dataIndex: "amount",
              title: "Amount",
              align: "right",
              render: (_, record) => (
                <div className="text-[14px]">
                  <div className="font-semibold">123,454.765</div>
                  <div className="font-medium">$1.23K</div>
                </div>
              ),
              width: "45%"
            }
          ]}
          list={[{}, {}]}
          loading={false}
          renderEmpty={() => (
            <div className="mt-[50px] w-full flex justify-center items-center">
              <Empty desc="No asset found" />
            </div>
          )}
          showHeader={false}
        />
      </div>
    </Basic>
  );
}
