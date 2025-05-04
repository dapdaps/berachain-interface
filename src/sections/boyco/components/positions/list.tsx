import { numberFormatter } from "@/utils/number-formatter";
import clsx from "clsx";
import Empty from "@/components/empty";
import Loading from "@/components/loading";

export default function List({ positions, loading }: any) {
  return (
    <div className="mt-[20px] flex flex-col gap-[10px] h-[440px] overflow-y-auto">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Loading size={20} />
        </div>
      ) : (
        <>
          {!positions?.length && (
            <div className="flex justify-center items-center h-full">
              <Empty desc="No positions" />
            </div>
          )}
          {positions?.map((it: any, index: number) => (
            <div
              key={index}
              className="flex items-center h-[50px] border border-[#392C1D] relative"
            >
              <div className="flex w-full gap-[12px] px-[14px] py-[10px]">
                <div className="flex">
                  {it.tokens.map((item: any, i: number) => (
                    <img
                      src={item.logo}
                      className={clsx(
                        "w-[26px] h-[26px] rounded-full",
                        i !== 0 && "ml-[-10px]"
                      )}
                    />
                  ))}
                </div>
                <div className="grow">
                  <div className="flex justify-between items-center text-[#392C1D] text-[14px] font-bold">
                    <div>
                      {it.tokens.map((item: any) => item.symbol).join("-")}
                    </div>
                    <div>
                      {numberFormatter(it.amount, 2, true, { isShort: true })}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[#392C1D] text-[12px] mt-[2px]">
                    <div>{it.name}</div>
                    <div>
                      $
                      {numberFormatter(it.amountUsd, 2, true, {
                        isShort: true
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
