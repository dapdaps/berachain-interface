import useCustomAccount from "@/hooks/use-account";
import { GACHA_CONTRACT_ADDRESS } from "../config";
import gachaAbi from "../abi";
import { multicall, multicallAddresses } from "@/utils/multicall";
import { DEFAULT_CHAIN_ID } from "@/configs";
import Big from "big.js";
import { useRequest } from "ahooks";

export default function useConfig() {
  const { provider } = useCustomAccount();

  const { runAsync: getConfig, data: config } = useRequest(
    async () => {
      if (!provider) {
        return;
      }

      try {
        const multicallAddress = multicallAddresses[DEFAULT_CHAIN_ID];

        const result = await multicall({
          abi: gachaAbi,
          options: {},
          calls: [
            {
              address: GACHA_CONTRACT_ADDRESS,
              name: "getTierConfig",
              params: [0]
            },
            {
              address: GACHA_CONTRACT_ADDRESS,
              name: "getTierConfig",
              params: [1]
            },
            {
              address: GACHA_CONTRACT_ADDRESS,
              name: "getTierConfig",
              params: [2]
            }
          ],
          multicallAddress,
          provider
        });

        return result.map((item: any) => item.config);
      } catch (err: any) {}
    },
    {
      manual: false,
      refreshDeps: [provider]
    }
  );

  return {
    config
  };
}
