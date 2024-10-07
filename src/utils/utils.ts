import Big from "big.js";

export function isValid(a: any) {
  if (!a) return false;
  if (isNaN(Number(a))) return false;
  if (a === "") return false;
  return true;
}

export function formatHealthFactor(hf: any) {
  try {
    if (hf === "∞") return hf;

    if (!hf || !isValid(hf)) return "-";

    if (Big(hf).gt(10000)) return "∞";
    if (Number(hf) === -1) return "∞";
    return Big(hf).toFixed(2);
  } catch (error) {
    console.log("CATCH_formatHealthFactor:", error);
  }
}
