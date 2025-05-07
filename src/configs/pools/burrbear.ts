import burrbear from "../swap/burrbear";

const contracts: { [key: number]: any } = {
  80094: {
    Vault: "0xBE09E71BDc7b8a50A05F7291920590505e3C7744",
    BalancerQuery: "0x48205280899D45838dD01124C017C972A0E11Cd3"
  }
};

const tokens = burrbear.tokens;

export default {
  contracts,
  tokens,
  graph:
    "https://api.goldsky.com/api/public/project_cluukfpdrw61a01xag6yihcuy/subgraphs/berachain/prod/gn",
  officalSite: "/dex/bex/burrbear",
  name: "BurrBear"
};
