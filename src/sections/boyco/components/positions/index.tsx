import List from "./list";
import Chart from "./chart";
import Switch from "../switch";
import { useState } from "react";
import { numberFormatter } from "@/utils/number-formatter";

export default function Positions({
  positions,
  totalUsd,
  assets,
  loading
}: {
  positions: any;
  totalUsd?: string;
  assets: any;
  loading: boolean;
}) {
  const [type, setType] = useState("list");

  return (
    <>
      <div className="text-[#392C1D] text-[14px] font-normal leading-[100%] mt-[10px]">
        Total Locked Assets on <span className="font-bold">Boyco</span>
      </div>
      <div className="flex items-center justify-between mt-[6px]">
        <div className="text-[#392C1D] text-[36px] font-bold leading-[100%]">
          ${numberFormatter(totalUsd, 2, true, { isShort: true })}
        </div>
        <button
          className="button"
          onClick={() => setType(type === "list" ? "chart" : "list")}
        >
          <Switch tab={type} />
        </button>
      </div>
      {type === "list" ? (
        <List positions={positions} loading={loading} />
      ) : (
        <Chart assets={assets} loading={loading} />
      )}
    </>
  );
}
