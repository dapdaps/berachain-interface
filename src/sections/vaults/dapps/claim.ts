import onBexClaim from "./bex/claim";
import onKodiakClaim from "./kodiak/claim";

export default function onClaim(params: any) {
  const { currentRecord } = params;

  if (currentRecord.protocol === "Bex") {
    return onBexClaim(params);
  }

  if (currentRecord.protocol === "Kodiak") {
    return onKodiakClaim(params);
  }
}
