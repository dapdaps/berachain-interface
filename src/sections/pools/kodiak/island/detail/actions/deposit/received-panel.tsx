import Loading from "@/components/loading";
import { balanceFormated } from "@/utils/balance";
import Big from "big.js";

export default function ReceivedPanel({ querying, receives, data }: any) {
  return (
    <div className="rounded-[12px] border-[#373A53] border p-[14px] mt-[10px] text-[14px] text-[#3D405A] font-medium">
      <div className="flex justify-between items-start">
        <div>Estimated Received</div>
        {querying ? (
          <Loading />
        ) : (
          <div className="text-right">
            <div>
              {receives?.received ? balanceFormated(receives.received, 5) : "-"}{" "}
              {data.symbol}
            </div>
            {/* <div>
          (${" "}
          {receives?.received && data.price
            ? balanceFormated(
                Big(receives.received).mul(data.price).toString(),
                5
              )
            : "-"}{" "}
          )
        </div> */}
          </div>
        )}
      </div>
      <div className="flex justify-between items-start mt-[12px]">
        <div>Minimum Received</div>
        {querying ? (
          <Loading />
        ) : (
          <div className="text-right">
            <div>
              {receives?.miniReceived
                ? balanceFormated(receives.miniReceived, 5)
                : "-"}{" "}
              {data.symbol}
            </div>
            {/* {receives?.miniReceived && data.price && (
              <div>
                (${" "}
                {balanceFormated(
                  Big(receives.miniReceived).mul(data.price).toString(),
                  5
                )}
                )
              </div>
            )} */}
          </div>
        )}
      </div>
    </div>
  );
}
