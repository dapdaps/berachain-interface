import { bera } from "@/configs/tokens/bera";
export default {
  name: "Bedrock",
  icon: "/images/dapps/bedrock.svg",
  type: "Lst",
  chains: {
    80094: {
      uniBTC: {
        STAKE_ADDRESS: "0xE0240d05Ae9eF703E2b71F3f4Eb326ea1888DEa3",
        sourceToken: bera["wbtc"],
        targetToken: bera["unibtc"]
      },
      brBTC: {
        STAKE_ADDRESS: "0xF9775085d726E782E83585033B58606f7731AB18",
        sourceToken: bera["wbtc"],
        targetToken: bera["brbtc"]
      }
    }
  }
};
