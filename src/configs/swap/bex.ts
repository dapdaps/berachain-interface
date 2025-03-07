import { bera } from "../tokens/bera";

export default {
  name: "Bex",
  icon: "/images/dapps/beraswap.svg",
  path: "/dex/bex",
  defaultInputCurrency: bera["bera"],
  tokens: {
    80094: [
      bera["bera"],
      bera["wbera"],
      bera["weth"],
      bera["usdc.e"],
      bera["honey"],
      bera["wbtc"],
      bera["usdt0"],
    ]
  }
};
