import { bera } from "../tokens/bera";

export default {
  name: "Ooga Booga",
  icon: "/images/dapps/ooga-booga.svg",
  path: "/dex/ooga-booga",
  defaultInputCurrency: bera["bera"],
  tokens: {
    80094: [
      bera["bera"],
      bera["wbera"],
      bera["weth"],
      bera["usdc.e"],
      bera["honey"],
      bera["wbtc"],
      bera["usdt0"]
    ]
  }
};
