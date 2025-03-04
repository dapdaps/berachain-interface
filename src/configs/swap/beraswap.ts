import { bera } from "../tokens/bera";

export default {
  name: "BeraSwap",
  icon: "/images/dapps/beraswap.svg",
  path: "/dex/beraswap",
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
