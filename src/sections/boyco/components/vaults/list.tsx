import clsx from "clsx";
import LabelIcon from "./label-icon";
import Empty from "@/components/empty";
import Loading from "@/components/loading";

export default function List({ vaults, loading }: any) {
  return (
    <div className="flex flex-col gap-[10px] mt-[14px] h-[calc(100%-160px)] overflow-y-auto">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Loading size={20} />
        </div>
      ) : (
        <>
          {!vaults?.length && (
            <div className="flex justify-center items-center h-full">
              <Empty desc="No vaults" />
            </div>
          )}
          {vaults?.map((item: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between h-[36px] w-full border border-[#392C1D] pr-[14px]"
            >
              <div className="grow flex items-center">
                <div
                  className="relative h-full flex justify-center"
                  style={{
                    width: 50 + (item.tokens.length - 1) * 16
                  }}
                >
                  <LabelIcon
                    width={50 + (item.tokens.length - 1) * 16}
                    className="absolute top-[-5px] left-[0px] z-[1]"
                  />
                  <div className="flex relative z-[2]">
                    {item.tokens.map((token: any, index: number) => (
                      <img
                        src={token.icon}
                        className={clsx(
                          "w-[26px] h-[26px] rounded-full",
                          index !== 0 && "ml-[-10px]"
                        )}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-[14px] text-[#392C1D]">
                  Join <span className="font-bold">{item.name}</span> vaults ,
                  APY up to{" "}
                  <span className="font-bold">
                    {item.totalApy[1].toFixed(2)}%
                  </span>
                </div>
              </div>
              <button className="button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path
                    d="M2 10L11 1M11 1H2M11 1V10"
                    stroke="#392C1D"
                    stroke-width="2"
                    stroke-linecap="square"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
