import onBexAction from "./bex/action";
import onDolomiteAction from "@/sections/vaults/dapps/dolomite/action";
import onKodiakAction from "./kodiak/action";
import onInfrared from "./infrared/action";
import onBeraDrome from "./bera-drome/action";
import onSlimee from "./slimee/action";
import onWeBera from "./webera/action";

export default function onAction(params: any) {
  const { currentRecord } = params;

  if (currentRecord.protocol === "Hub") {
    return onBexAction(params);
  }

  if (currentRecord.protocol === "Dolomite") {
    return onDolomiteAction(params);
  }

  if (currentRecord.protocol === "Kodiak") {
    return onKodiakAction(params);
  }

  if (currentRecord.protocol === "Infrared") {
    return onInfrared(params);
  }

  if (currentRecord.protocol === "BeraDrome") {
    return onBeraDrome(params);
  }

  if (currentRecord.protocol === "Slimee") {
    return onSlimee(params);
  }

  if (currentRecord.protocol === "WeBera") {
    return onWeBera(params);
  }
}
