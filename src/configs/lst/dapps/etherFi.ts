import { bera } from "@/configs/tokens/bera";
export default {
  name: "EtherFi",
  icon: "/images/dapps/bedrock.svg",
  type: "Lst",
  chains: {
    80094: {
      STAKE_ADDRESS: "0x6Ee3aaCcf9f2321E49063C4F8da775DdBd407268",
      sourceToken: bera["wbtc"],
      targetToken: bera["eBTC"]
    }
  }
};
