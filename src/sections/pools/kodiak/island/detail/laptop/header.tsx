import Back from "./back";
import { balanceShortFormated } from "@/utils/balance";

export default function Header({ onBack = () => {}, data }: any) {
  return (
    <div className="rounded-[10px] bg-[#FFDC50] p-[16px] flex gap-[22px] items-start">
      <Back onClick={onBack} />
      <div>
        <div className="flex items-center gap-[24px]">
          <div className="flex items-center">
            <img
              src={data.token0.icon}
              alt={data.token0.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <img
              src={data.token1.icon}
              alt={data.token1.name}
              width={40}
              height={40}
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
        <div className="flex gap-[60px] mt-[8px]">
          <div>
            <div className="text-[14px] font-medium">TVL</div>
            <div className="text-[18px] font-semibold">
              ${balanceShortFormated(data.tvl, 2)}
            </div>
          </div>
          <div>
            <div className="text-[14px] font-medium">Island APR</div>
            <div className="text-[18px] font-semibold">
              {Number(data?.apr || 0).toFixed(2)}%
            </div>
          </div>
          <div>
            <div className="text-[14px] font-medium">Volume (All Time)</div>
            <div className="text-[18px] font-semibold">
              ${balanceShortFormated(data.volume, 2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
