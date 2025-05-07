import { bera } from "../tokens/bera";

export default {
  name: "BurrBear",
  icon: "/images/dapps/burrbear.svg",
  path: "/dex/burrbear",
  defaultInputCurrency: bera["bera"],
  tokens: {
    80094: [
      bera["bera"],
      bera["wbera"],
      bera["wgbera"],
      bera["nect"],
      bera["honey"],
      bera["usdc.e"],
      bera["snect"],
      bera["ibgt"],
      bera["lbgt"],
      bera["burr"],
      bera["plug"]
    ]
  }
};
