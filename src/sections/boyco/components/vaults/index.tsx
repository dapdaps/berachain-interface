import clsx from "clsx";
import List from "./list";
import { numberFormatter } from "@/utils/number-formatter";

export default function Vaults({
  vaults,
  assets,
  loading
}: {
  vaults: any;
  assets: any;
  loading: boolean;
}) {
  return (
    <>
      <div className="text-[#392C1D] text-[30px] font-bold leading-[100%]">
        Yield Opportunities Based on Your Locked Assets.
      </div>
      <div className="text-[#392C1D] text-[14px] font-normal leading-[100%] mt-[30px]">
        Est. Unlocked assets (Available in vaults)
      </div>
      <div className="flex gap-[10px] flex-wrap">
        {assets?.map((item: any, index: number) => (
          <div
            className="px-[8px] py-[4px] h-[34px] border border-[#5B4E3C] rounded-[8px] flex items-center gap-[7px] mt-[10px]"
            key={index}
          >
            <div className="flex">
              {item.tokens.map((token: any, index: number) => (
                <img
                  src={token.logo}
                  className={clsx(
                    "w-[26px] h-[26px] rounded-full",
                    index !== 0 && "ml-[-14px]"
                  )}
                />
              ))}
            </div>
            <div className="text-[#392C1D] text-[14px] leading-[100%]">
              <span className="font-bold">
                {numberFormatter(item.amount, 2, true, {
                  isShort: true
                })}
              </span>{" "}
              {item.name}
            </div>
          </div>
        ))}
      </div>
      <List vaults={vaults} loading={loading} />
    </>
  );
}
