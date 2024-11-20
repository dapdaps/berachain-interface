import Image from "next/image";
import Back from "./back";
import { balanceShortFormated } from "@/utils/balance";

export default function Header({ onBack = () => {}, data }: any) {
  return (
    <div className="relative rounded-[20px] bg-white/60 px-[14px] py-[12px] backdrop-blur">
      <div className="absolute left-[14px] top-[14px]">
        <Back onClick={onBack} />
      </div>
      <div className="flex justify-center">
        <div className="flex items-center gap-[6px]">
          <div className="flex items-center">
            <Image
              src={data.token0.icon}
              alt={data.token0.name}
              width={36}
              height={36}
              className="rounded-full"
            />
            <Image
              src={data.token1.icon}
              alt={data.token1.name}
              width={36}
              height={36}
              className="ml-[-10px] rounded-full"
            />
          </div>
          <div>
            <div className="text-[20px] font-semibold">
              {data.token0.symbol}-{data.token1.symbol}
            </div>
            {data.fee && (
              <div className="text-[12px] font-normal">{data.fee / 1e4}%</div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-nowrap mt-[12px]">
        <div className="w-1/2">
          <div className="text-[14px] font-medium text-[#3D405A]">TVL</div>
          <div className="text-[16px] font-bold">
            ${balanceShortFormated(data.tvl, 2)}
          </div>
        </div>
        <div className="w-1/2">
          <div className="text-[14px] font-medium text-[#3D405A]">
            Island APR
          </div>
          <div className="text-[16px] font-bold	">
            {Number(data?.apr || 0).toFixed(2)}%
          </div>
        </div>
      </div>
      <div className="flex flex-nowrap mt-[12px]">
        <div className="w-1/2">
          <div className="text-[14px] font-medium text-[#3D405A]">Farm APR</div>
          <div className="text-[16px] font-bold">-%</div>
        </div>
        <div className="w-1/2">
          <div className="text-[14px] font-medium text-[#3D405A]">
            Volume (All Time)
          </div>
          <div className="text-[16px] font-bold">
            ${balanceShortFormated(data.volume, 2)}
          </div>
        </div>
      </div>
    </div>
  );
}
