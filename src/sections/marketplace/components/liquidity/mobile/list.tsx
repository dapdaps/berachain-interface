import Image from "next/image";
import { balanceFormated, formatValueDecimal } from "@/utils/balance";
import clsx from "clsx";
import Big from "big.js";

const MobileList = ({ list, onClick }: any) => {
  if (!list || !list.length) return null;

  const Item = ({ item, onClick }: any) => {
    return (
      <div>
        <div className="bg-[#F0EEDC] rounded-[10px] p-[14px] mb-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-[10px]">
              <div className="flex items-center relative">
                {item?.token0 && (
                  <Image
                    className="mr-[-8px] rounded-full"
                    src={item.token0.icon || "/assets/tokens/default_icon.png"}
                    width={40}
                    height={40}
                    alt="Token"
                  />
                )}
                {item?.token1 && (
                  <Image
                    className="rounded-full"
                    src={item.token1.icon || "/assets/tokens/default_icon.png"}
                    width={40}
                    height={40}
                    alt="Token"
                  />
                )}
                <Image
                  className="absolute right-[-2px] bottom-[0px]"
                  src={item.protocolIcon}
                  width={20}
                  height={20}
                  alt="Protocol"
                />
              </div>
              <div>
                <div className="text-[16px] font-semibold flex items-center gap-2">
                  <div>
                    {item.token0.symbol}-{item.token1.symbol}
                  </div>
                  {item.fee && (
                    <div className="text-[10px] rounded-[6px] p-[4px] bg-[#D9D9D9]">{item.fee / 1e4} %</div>
                  )}
                </div>
                <div className="text-[14px] mt-[4px]">{item?.protocol}</div>
              </div>
            </div>
            <button
              onClick={() => {
                onClick(0, item);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="34"
                height="34"
                viewBox="0 0 34 34"
                fill="none"
              >
                <rect
                  x="1"
                  y="1"
                  width="32"
                  height="32"
                  rx="10"
                  fill="#FFDC50"
                  stroke="black"
                />
                <path
                  d="M18.0211 18.0921L22.7387 18.0922C23.0934 18.0921 23.381 17.8651 23.3809 17.5852L23.3809 16.5566C23.3809 16.2767 23.0932 16.0504 22.7383 16.05L18.021 16.0502L18.0209 11.3328C18.0211 10.9779 17.7943 10.6901 17.5142 10.6902L16.4855 10.6903C16.2059 10.6901 15.9789 10.9777 15.9791 11.3327L15.9792 16.0502L11.2615 16.0503C10.9069 16.0503 10.6191 16.2767 10.6191 16.5567L10.6191 17.5853C10.6191 17.8652 10.9068 18.0922 11.2614 18.0923L15.9792 18.0922L15.9792 22.8093C15.9791 23.1647 16.2058 23.4519 16.4857 23.452L17.5144 23.4519C17.7942 23.4518 18.0211 23.1644 18.0213 22.8097L18.0211 18.0921Z"
                  fill="black"
                />
              </svg>
            </button>
          </div>
          <div className="mt-[16px] flex justify-between">
            <div>
              <div className="font-medium	text-[14px]">TVL</div>
              <div className="font-semibold text-[16px] mt-[8px]">
                {formatValueDecimal(
                  item["tvl"] || balanceFormated(Math.random() * 1400, 2),
                  "$",
                  2,
                  true
                )}
              </div>
            </div>
            <div>
              <div className="font-medium	text-[14px]">24h Volume</div>
              <div className="font-semibold text-[16px] mt-[8px]">
                {formatValueDecimal(
                  item["yours"] || balanceFormated(Math.random() * 14, 2),
                  "$",
                  2,
                  true
                )}
              </div>
            </div>
            <div>
              <div className="font-medium	text-[14px]"> 24h Fees</div>
              <div className="font-semibold text-[16px] mt-[8px]">
                {formatValueDecimal(
                  item["yours"] || balanceFormated(Math.random() * 14, 2),
                  "$",
                  2,
                  true
                )}
              </div>
            </div>
          </div>
        </div>
        {Big(item?.usdDepositAmount || 0).gt(0) && (
          <div className="text-white bg-[#E2E0CF] rounded-[10px] p-[14px] flex items-center justify-between gap-[20px]">
            <UserInfo data={item} />
            <button
              onClick={() => {
                onClick(1);
              }}
            >
              <svg
                width="34"
                height="34"
                viewBox="0 0 34 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="1"
                  y="1"
                  width="32"
                  height="32"
                  rx="10"
                  fill="white"
                  stroke="black"
                />
                <path
                  d="M15 23L20 17L15 11"
                  stroke="black"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    );
  };

  const UserInfo = ({ data, className }: any) => {
    return (
      <div className={clsx("flex items-center gap-[30px]", className)}>
        <div className="flex">
          <div className="text-[14px]">Your Positions</div>
          <span className="text-[16px] font-semibold">
            {formatValueDecimal(data?.usdDepositAmount, "$", 2, true, false)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-auto">
      {list.map((item: any, index: number) => {
        return <Item key={index} item={item} onClick={onClick} />;
      })}
    </div>
  );
};

export default MobileList;
