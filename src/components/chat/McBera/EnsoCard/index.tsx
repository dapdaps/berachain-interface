import Big from "big.js";
import { numberFormatter } from "@/utils/number-formatter";
import { useMemo } from "react";
import useEnsoStore from "../../stores/useEnsoStore";
import { getTokenLogo } from "@/sections/dashboard/utils";
import ShadowButton from "../../components/ShadowButton";

export default function EnsoCard({ data }: any) {
  const ensoStore: any = useEnsoStore();
  const [vault, apr, token] = useMemo(() => {
    try {
      const _v =
        typeof data.vault === "string" ? JSON.parse(data.vault) : data.vault;
      let _a = Big(0);
      Object.values(_v.apr).forEach((item: any) => {
        _a = _a.add(item);
      });

      return [
        _v,
        _a.toFixed(2),
        {
          ...data.token,
          icon: getTokenLogo(data.token.symbol?.replace(/\s/g, ""))
        }
      ];
    } catch (err) {
      return [{}, 0, {}];
    }
  }, [data]);

  return data.enso.statusCode > 0 || !data.enso?.tx ? (
    "Oops, no route found. Please switch tokens, or try again later."
  ) : (
    <div className="text-[#471C1C] text-[14px] font-medium">
      <div>
        OK. Confirming:{" "}
        <span className="font-bold">
          Stake {data.token.amount} {data.token.symbol}
        </span>
        .
      </div>
      <div className="mt-[4px] flex items-center">
        <span>☑️ Best route found on</span>
        <img
          src="/images/enso-logo.png"
          className="w-[26px] h-[26px] ml-[4px]"
        />
        <span className="text-[12px] ml-[2px]">ENSO:</span>
      </div>
      <div className="mt-[6px]">
        <div className="border border-[#DAD9CD] rounded-[10px] p-[6px] flex items-center justify-between">
          <div className="flex gap-[10px] items-center">
            <div className="w-[56px] h-[26px] shrink-0 leading-[26px] text-center rounded-[6px] border border-[#000000] bg-[#FF888A] text-[12px] text-black font-bold">
              Vaults
            </div>
            <div className="text-[13px] text-black/50 truncate flex">
              {vault.project}
              <span
                className="font-bold truncate max-w-[162px] ml-[4px]"
                title={vault.name}
              >
                {vault.name}
              </span>
              , APY up to{" "}
              <span className="font-bold ml-[4px]">
                {numberFormatter(apr, 2, true)}%
              </span>
            </div>
          </div>
          <ShadowButton
            className="w-[56px] h-[26px]"
            onClick={() => {
              ensoStore.set({
                data: {
                  token,
                  enso: data.enso,
                  apr,
                  vault
                },
                modalOpen: true
              });
            }}
          >
            Stake
          </ShadowButton>
        </div>
      </div>
    </div>
  );
}
