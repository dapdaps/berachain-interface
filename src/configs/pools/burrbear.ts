import burrbear from "../swap/burrbear";

const contracts: { [key: number]: any } = {
  80084: {
    Vault: "0xFDb2925aE2d3E2eacFE927611305e5e56AA5f832",
    BalancerQuery: "0x878aB84Abc562e311fCe6DfB1d2b74B746D95ae4"
  }
};
const tokens = burrbear.tokens;

export default {
  contracts,
  tokens,
  graph: {
    80084:
      "https://api.goldsky.com/api/public/project_cluukfpdrw61a01xag6yihcuy/subgraphs/bartio/0.0.2/gn"
  },
  officalSite: "/dex/bex/burrbear",
  name: "Burrbear"
};
