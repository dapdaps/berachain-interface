import { useState } from "react";
import History from "./history";
import clsx from "clsx";

export default function YourRewords({ list, type = "beratown" }: { list: any; type?: "beratown" | "partners"; }) {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <div className="px-[30px]">
      <div className="mt-[40px] flex justify-between items-center">
        <div
          style={{
            WebkitTextStroke: "2px #000000",
          }}
          className="text-[24px] text-[#FDD54C] font-CherryBomb">
          Your Rewards
        </div>
        <button
          type="button"
          onClick={() => setIsHistoryOpen(true)}
          className="text-[14px] text-black font-Montserrat font-bold underline cursor-pointer"
        >
          History
        </button>
      </div>
      <div
        className="flex justify-between items-center mt-[20px] font-CherryBomb font-[16px] text-white"
        style={{
          WebkitTextStroke: "2px #000000",
        }}
      >
        {
          list?.map((item: any, index: number) => (
            <div key={index} className="w-[86px] h-[86px] relative flex-col flex justify-center items-center bg-[#FFFFFF33] border-dashed rounded-[20px] border-[3px] border-[#8B6A45]">
              <img
                src={item.icon}
                className={clsx("opacity-10 object-contain object-center", item.amount > 0 ? "opacity-100" : "opacity-10")}
                alt=""
                style={{
                  width: item.iconSize[0],
                  height: item.iconSize[1],
                }}
              />
              <div className={clsx("w-[calc(100%_+_10px)] overflow-hidden [text-shadow:0_2px_0_#000] font-[600] text-ellipsis text-center whitespace-nowrap opacity-10 mt-[-10px] text-[15px]", item.amount > 0 ? "opacity-100" : "opacity-10")}>
                {item.name}
              </div>
              {
                item.amount > 0 && (
                  <div
                    style={{
                      WebkitTextStroke: "2px #000000",
                    }}
                    className="absolute bottom-[-35px] left-[50%] translate-x-[-50%] font-CherryBomb text-[#FDD54C] text-[20px]"
                  >
                    X{item.amount}
                  </div>
                )
              }
            </div>
          ))
        }

        {
          [...new Array(Math.max(5 - (list?.length || 0), 0)).fill(0)].map((item) => (
            <div className="w-[86px] h-[86px] flex-col flex justify-center items-center bg-[#FFFFFF33] border-dashed rounded-[20px] border-[3px] border-[#8B6A45]">
              <div className="opacity-10 text-[42px] leading-[38px]">?</div>
            </div>
          ))
        }
      </div>
      {isHistoryOpen && <History type={type} onClose={() => setIsHistoryOpen(false)} />}
    </div >
  );
}