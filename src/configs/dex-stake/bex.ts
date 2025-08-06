import { bera } from "../tokens/bera";

export default {
  name: "Bex",
  icon: "/images/dapps/bex.svg",
  path: "/dex/bex",
  defaultInputCurrency: bera["bera"],
  defaultOutputCurrency: bera["swbera"],
  inputTokens: {
    80094: [
      bera["bera"],
      bera["wbera"],
    ]
  },
  outputTokens: {
    80094: [
      bera["swbera"],
    ]
  }
};
