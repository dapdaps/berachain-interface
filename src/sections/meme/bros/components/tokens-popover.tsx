import Image from "next/image";
import {
  formatThousandsSeparator,
  balanceShortFormated
} from "@/utils/balance";

export default function TokensPopover({ tokens }: any) {
  return (
    <div className="w-[236px] rounded-[20px] border border-black bg-[#FFFDEB] shadow-shadow1 px-[14px] py-[16px]">
      {tokens.map((token: any) => (
        <div className="flex justify-between items-start" key={token.address}>
          <div className="flex items-center gap-[5px]">
            <Image src={token.logo} width={20} height={20} alt={token.symbol} />
            <span className="text-[14px] font-semibold">{token.symbol}</span>
          </div>
          <div className="text-right">
            <div className="text-[14px] font-semibold">
              {formatThousandsSeparator(token.amount, 3)}
            </div>
            <div className="text-[14px] font-medium">
              ${balanceShortFormated(token.usd, 2)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
