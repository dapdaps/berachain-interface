import onBexAction from "./bex/action";
import onDolomiteAction from "@/sections/vaults/dapps/dolomite/action";
import onKodiakAction from "./kodiak/action";

export default function onAction(params: any) {
  const { currentRecord } = params;

  if (currentRecord.protocol === "Bex") {
    return onBexAction(params);
  }

  if (currentRecord.protocol === "Dolomite") {
    return onDolomiteAction(params);
  }

  if (currentRecord.protocol === "Kodiak") {
    return onKodiakAction(params);
  }
}
