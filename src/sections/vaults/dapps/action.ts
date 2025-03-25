import onBexAction from "./bex/action";

export default function onAction(params: any) {
  const { currentRecord } = params;

  if (currentRecord.protocol === "Bex") {
    return onBexAction(params);
  }
}
