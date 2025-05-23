import clsx from "clsx";
import LabelIcon from "./label-icon";
import Empty from "@/components/empty";
import Loading from "@/components/loading";
import { useRouter } from "next/navigation";

export default function List({ vaults, loading, height }: any) {
  const router = useRouter();
  return (
    <div className="mt-[14px]" style={{ height }}>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Loading size={20} />
        </div>
      ) : (
        <>
          {!vaults?.length ? (
            <div className="flex justify-center items-center h-full">
              <Empty desc="No vaults" />
            </div>
          ) : (
            <>
              <div className="max-h-[calc(100%-46px)] overflow-y-auto flex flex-col gap-[10px]">
                {vaults?.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between h-[36px] w-full border border-[#392C1D] pr-[14px] shrink-0"
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
                              key={index}
                              src={token.logo || token.icon}
                              className={clsx(
                                "w-[26px] h-[26px] rounded-full",
                                index !== 0 && "ml-[-14px]"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex-1 font-Montserrat md:text-[12px] lg:text-[14px] text-[#392C1D] leading-[100%]">
                        Join{" "}
                        <span className="font-bold">
                          {item.tokens
                            .map((token: any) => token.symbol)
                            .join("-")}
                        </span>{" "}
                        vault , APY up to{" "}
                        <span className="font-bold">
                          {item.totalApy[1].toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  const searchParams = new URLSearchParams(
                    window.location.search
                  ).toString();
                  router.push(
                    `/vaults?from=boyco${
                      searchParams ? "&" + searchParams : ""
                    }`
                  );
                }}
                className="button text-[#E2CFB6] w-full h-[36px] bg-[#392C1D] text-[14px] leading-[100%] mt-[10px]"
              >
                View all vaults
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}
