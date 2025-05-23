import { useRouter } from "next/navigation";
import { useMemo } from "react";
import LazyImage from '@/components/layz-image';

export default function PoolTable({ item, onClick = () => {} }: any) {

  const tokens = useMemo(
    () => item.tokens || [item.token0, item.token1],
    [item]
  );

  return (
    <div className="flex items-center gap-[12px]" onClick={onClick}>
      <div className="flex items-center relative">
        {tokens.map((token: any, i: number) => (
          <LazyImage
            key={i}
            src={token.icon}
            alt={token.name}
            fallbackSrc="/assets/tokens/default_icon.png"
            containerClassName={`!w-[30px] !h-[30px] !rounded-full !overflow-hidden !shrink-0 ${i !== 0 && "!ml-[-20px]"}`}
          />
        ))}
        {item.protocolIcon && (
          <img
            className="absolute right-[-2px] bottom-[0px]"
            src={item.protocolIcon}
            width={16}
            height={16}
            alt="Protocol"
          />
        )}
      </div>
      <div className="flex items-center gap-1">
        <div className="text-[16px]">
          {item.symbol || `${item.token0.symbol}-${item.token1.symbol}`}
        </div>
        {item.fee && (
          <div className="text-[10px] p-1 bg-[#D9D9D9] rounded-md text-black leading-[9px] font-Montserrat font-medium">
            {item.fee / 1e4} %
          </div>
        )}

        {item.type && (
          <div className="text-[10px] p-1 bg-[#D9D9D9] rounded-md text-black leading-[9px] font-Montserrat font-medium">
            {item.type}
          </div>
        )}

        {/* {
          item?.protocol === "bex" && (
            <div
              className="w-[30px] cursor-pointer"
              onClick={() => {
                router.push("/bgt/gauge?address=" + item?.vaultAddress)
              }}
            >
              <img src="/images/hall/icon-bgt.svg" alt="icon-bgt" />
            </div>
          )
        } */}
      </div>
    </div>
  );
}
