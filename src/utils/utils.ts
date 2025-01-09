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

export function formatLongText(
  text?: string,
  front: number = 4,
  ending: number = 2
) {
  if (!text) return text;
  if (text.length <= front + ending) {
    return text;
  }
  return `${text.slice(0, front)}...${text.slice(-ending)}`;
}

export function readClipboard() {
  try {
    return navigator.clipboard.readText();
  } catch (err) {
    console.log('read clipboard failed: %o', err);
  }
  return Promise.resolve('');
}
