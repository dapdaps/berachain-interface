import onBexClaim from "./bex/claim";
import onKodiakClaim from "./kodiak/claim";
import onInfraredClaim from "./infrared/claim";

export default function onClaim(params: any) {
  const { currentRecord } = params;

  if (currentRecord.protocol === "Hub") {
    return onBexClaim(params);
  }

  if (currentRecord.protocol === "Kodiak") {
    return onKodiakClaim(params);
  }

  if (currentRecord.protocol === "Infrared") {
    return onInfraredClaim(params);
  }
}
