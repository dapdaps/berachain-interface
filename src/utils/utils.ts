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


export function getProtocolIcon(protocal) {
  const ImageMapping = {
    infrared: "/images/dapps/infrared/infrared.svg",
    bex: "/images/dapps/beraswap.svg",
    kodiak: "/images/dapps/kodiak.svg",
    berps: "/images/dapps/infrared/berps.svg",
    aquabera: "/images/dapps/infrared/aquabera.png",
    hub: "/images/dapps/beraswap.svg"
  }
  return ImageMapping?.[protocal?.toLocaleLowerCase()] ?? "/images/dapps/dolomite.svg"
}

export const isVideoFile = (url: string) => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const fileExtMatch = pathname.match(/\.([^./?]+)(?:[?#]|$)/);
    if (!fileExtMatch) return false;

    const extension = fileExtMatch[1].toLowerCase();
    const videoExtensions = ['mp4', 'webm', 'ogg'];
    return videoExtensions.includes(extension);
  } catch (e) {
    const videoExtensions = ['.mp4', '.webm', '.ogg'];
    return videoExtensions.some(ext => url.toLowerCase().includes(ext));
  }
};


export function capitalize(str: string) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.substring(1);
}