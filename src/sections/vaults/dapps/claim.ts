import onBexClaim from "./bex/claim";

export default function onClaim(params: any) {
  const { currentRecord } = params;

  if (currentRecord.protocol === "Bex") {
    return onBexClaim(params);
  }
}
