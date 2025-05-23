import onBexClaim from "./bex/claim";
import onKodiakClaim from "./kodiak/claim";
import onInfraredClaim from "./infrared/claim";
import onBurrBearClaim from "./burrbear/claim";
import onBeraDromeClaim from "./bera-drome/claim";
import onMemeswapClaim from "./memeswap/claim";
import onBeraPawClaim from "./berapaw/claim";

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

  if (currentRecord.protocol === "BurrBear") {
    return onBurrBearClaim(params);
  }

  if (currentRecord.protocol === "BeraDrome") {
    return onBeraDromeClaim(params);
  }

  if (currentRecord.protocol === "Memeswap") {
    return onMemeswapClaim(params);
  }

  if (currentRecord.protocol === "BeraPaw") {
    return onBeraPawClaim(params);
  }
}
