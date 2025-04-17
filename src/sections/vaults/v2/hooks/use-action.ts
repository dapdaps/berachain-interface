import { useMemo, useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import useToast from "@/hooks/use-toast";
import useAddAction from "@/hooks/use-add-action";
import { useVaultsV2Context } from "@/sections/vaults/v2/context";
import handleAction from "../../dapps/action";
import { DEFAULT_CHAIN_ID } from "@/configs";
import useTokenBalance from "@/hooks/use-token-balance";
import Big from "big.js";
import { ACTION_TYPE } from "@/sections/vaults/v2/config";
import useClickTracking from "@/hooks/use-click-tracking";
import useMemeswapBalance from "./use-memeswap-balance";

export default function useAction(): Action {
  const [loading, setLoading] = useState(false);
  const { account, provider } = useCustomAccount();
  const toast = useToast();
  const { addAction } = useAddAction("vaults");
  const [amount, setAmount] = useState<string>();
  const [dappParams, setDappParams] = useState<any>({});
  const { currentProtocol, actionType, toggleActionVisible, getListData } =
    useVaultsV2Context();

  const { tokenBalance, update, isLoading } = useTokenBalance(
    actionType.value === ACTION_TYPE.DEPOSIT
      ? currentProtocol?.token?.address
      : !["Kodiak", "Memeswap"].includes(currentProtocol.protocol)
      ? currentProtocol?.vaultAddress
      : "",
    currentProtocol?.token?.decimals
  );

  const {
    balance: memeswapBalance,
    update: updateMemeswapBalance,
    loading: memeswapLoading,
    queuedAmount
  } = useMemeswapBalance();

  const { handleReportWithoutDebounce } = useClickTracking();

  const [balanceShown, balanceLoading, updateBalance] = useMemo(() => {
    if (
      actionType.value === ACTION_TYPE.DEPOSIT ||
      currentProtocol.protocol === "D2 Finance"
    ) {
      return [tokenBalance, isLoading, update];
    }
    if (currentProtocol.protocol === "Memeswap") {
      return [memeswapBalance, memeswapLoading, updateMemeswapBalance];
    }
    return [currentProtocol?.user_stake?.amount || "0", isLoading, update];
  }, [actionType, tokenBalance, currentProtocol?.user_stake, memeswapBalance]);

  const [inputError, inputErrorMessage] = useMemo<
    [boolean, string | undefined]
  >(() => {
    const DEFAULT: [boolean, string | undefined] = [false, void 0];
    if (Big(amount || 0).eq(0)) return [false, "Enter an amount"];
    if (actionType.value === ACTION_TYPE.DEPOSIT) {
      if (Big(balanceShown || 0).lt(amount || 0)) {
        return [true, "Insufficient Balance"];
      }
      if (
        currentProtocol.protocol === "D2 Finance" &&
        Big(balanceShown || 0).lt(1)
      ) {
        return [true, "At least 1 token"];
      }
    }
    if (actionType.value === ACTION_TYPE.WITHDRAW) {
      if (Big(balanceShown).lt(amount || 0)) {
        return [true, "Insufficient Balance"];
      }
    }
    return DEFAULT;
  }, [balanceShown, actionType, amount]);

  const handleAmountChange = (_amount: string) => {
    setAmount(_amount);
  };

  const onAction = async () => {
    if (!currentProtocol) return;

    if (actionType.value !== ACTION_TYPE.EXIT) {
      handleReportWithoutDebounce(
        actionType.value === ACTION_TYPE.DEPOSIT
          ? "1022-001-010"
          : "1022-001-011",
        currentProtocol.vaultAddress
      );
    }

    let toastId = toast.loading({ title: "Confirming..." });
    try {
      setLoading(true);
      const signer = provider.getSigner(account);

      const tx = await handleAction({
        actionType: actionType.button,
        signer,
        account,
        amount: Big(amount || 0)
          .mul(10 ** currentProtocol.token.decimals)
          .toFixed(0),
        currentRecord: currentProtocol,
        dappParams
      });
      toast.dismiss(toastId);
      if (!tx) {
        setLoading(false);
        toast.fail({ title: actionType.button + " failed!" });
        return;
      }
      toastId = toast.loading({ title: "Pending..." });
      const { status, transactionHash } = await tx.wait();
      toast.dismiss(toastId);
      if (status === 1) {
        toast.success({
          title: actionType.button + " successful!",
          tx: transactionHash,
          chainId: DEFAULT_CHAIN_ID
        });
        toggleActionVisible({ visible: false });
        getListData();
      } else {
        toast.fail({ title: actionType.button + " failed!" });
      }
      setLoading(false);

      if (actionType.button === "Exit") return;
      addAction?.({
        type: "Staking",
        action: actionType.button === "Deposit" ? "Stake" : "Unstake",
        token: currentProtocol.token,
        amount,
        template: currentProtocol.protocol,
        add: false,
        status,
        transactionHash,
        sub_type: actionType.button === "Deposit" ? "Stake" : "Unstake",
        tokens:
          currentProtocol.tokens.length === 1
            ? currentProtocol.tokens
            : [
                {
                  ...currentProtocol.token,
                  symbol: currentProtocol.tokens
                    .map((token: any) => token.symbol)
                    .join("-")
                }
              ],
        amounts: [amount],
        extra_data: {}
      });
    } catch (err: any) {
      toast.dismiss(toastId);
      setLoading(false);
      toast.fail({
        title: err?.message?.includes("user rejected transaction")
          ? "User rejected transaction"
          : actionType.button + " failed!"
      });
      setLoading(false);
    }
  };

  return {
    loading,
    onAction,
    amount,
    handleAmountChange,
    inputError,
    inputErrorMessage,
    balance: tokenBalance,
    balanceLoading,
    updateBalance,
    dappParams,
    setDappParams,
    balanceShown,
    queuedAmount
  };
}

export interface Action {
  loading: boolean;
  onAction: () => Promise<void>;
  amount: string | undefined;
  handleAmountChange: (_amount: string) => void;
  inputError: boolean;
  inputErrorMessage: string | undefined;
  balance: string | undefined;
  balanceLoading: boolean;
  updateBalance: () => void;
  dappParams: any;
  setDappParams: React.Dispatch<React.SetStateAction<any>>;
  balanceShown: string;
  queuedAmount?: string;
}
