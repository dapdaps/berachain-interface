import { useEffect, useState } from "react";
import { useVaultsV2Context } from "@/sections/vaults/v2/context";
import useCustomAccount from "@/hooks/use-account";
import { ACTION_TYPE } from "@/sections/vaults/v2/config";
import abi from "../../dapps/memeswap/abi";
import { Contract } from "ethers";
import Big from "big.js";

export default function useMemeswapBalance() {
  const [balance, setBalance] = useState("0");
  const [loading, setLoading] = useState(false);
  const { account, provider } = useCustomAccount();
  const [queuedAmount, setQueuedAmount] = useState("");

  const { currentProtocol, actionType } = useVaultsV2Context();

  const update = async () => {
    const VaultContract = new Contract(
      currentProtocol.vaultAddress,
      abi,
      provider
    );
    try {
      setLoading(true);

      const queued = await VaultContract.getUserTotalQueue(account);
      setQueuedAmount(
        Big(queued?.toString() || 0)
          .div(10 ** currentProtocol.token.decimals)
          .toFixed(currentProtocol.token.decimals)
      );
      if (actionType.value === ACTION_TYPE.WITHDRAW) {
        const balance = await VaultContract.toWithdraw(account);
        setBalance(
          Big(balance?.toString() || 0)
            .div(10 ** currentProtocol.token.decimals)
            .toFixed(currentProtocol.token.decimals)
        );
        return;
      }
      const balance = await VaultContract.balances(account);

      setBalance(
        Big(balance?.toString() || 0)
          .minus(Big(queued?.toString() || 0))
          .div(10 ** currentProtocol.token.decimals)
          .toFixed(currentProtocol.token.decimals)
      );
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!account) return;
    if (currentProtocol.protocol !== "Memeswap") return;
    if (actionType.value === ACTION_TYPE.DEPOSIT) return;
    update();
  }, [currentProtocol, account, actionType]);

  return { balance, loading, update, queuedAmount };
}
