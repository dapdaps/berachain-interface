import beraswap from "../swap/beraswap";

const contracts: { [key: number]: any } = {
  80094: {
    Vault: "0x4Be03f781C497A489E3cB0287833452cA9B9E80B",
    BalancerQuery: "0x3C612e132624f4Bd500eE1495F54565F0bcc9b59"
  }
};
const tokens = beraswap.tokens;

export default {
  contracts,
  tokens,
  officalSite: "/dex/beraswap/pools",
  name: "BeraSwap",
  graph: "https://chgbtcc9ffu7rbdw2kmu4urwy.stellate.sh"
};
