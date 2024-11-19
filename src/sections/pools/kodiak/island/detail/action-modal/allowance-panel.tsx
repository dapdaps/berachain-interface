import { balanceFormated } from "@/utils/balance";

export default function AllowancePanel({ amount, allowance, token }: any) {
  return (
    <div className="mt-[20px] rounded-[12px] border border-[#373A53] p-[12px]">
      <div className="flex items-center justify-between mt-[6px]">
        <div className="font-semibold text-[16px]">
          {balanceFormated(amount, 10)}
        </div>
        <div className="font-semibold text-[16px]">{token.symbol}</div>
      </div>
      <div className="flex items-center justify-between mt-[6px]">
        <div className="text-[14px] font-medium	text-[#3D405A]">
          Current allowance
        </div>
        <div className="text-[14px] font-medium">
          {balanceFormated(allowance, 10)} {token.symbol}
        </div>
      </div>
      <div className="flex items-center justify-between mt-[6px]">
        <div className="text-[14px] font-medium	text-[#3D405A]">
          Requested allowance
        </div>
        <div className="text-[14px] font-medium">∞</div>
      </div>
    </div>
  );
}
