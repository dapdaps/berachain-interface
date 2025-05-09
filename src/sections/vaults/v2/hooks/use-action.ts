import { MutableRefObject, useMemo, useRef, useState } from 'react';
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
import { bera } from '@/configs/tokens/bera';
import { useRequest } from 'ahooks';
import { Contract, utils } from 'ethers';
import { ABI } from '@/sections/staking/hooks/use-berapaw';

export default function useAction(): Action {
  const beraPawRef = useRef<any>();
  const [loading, setLoading] = useState(false);
  const { account, provider } = useCustomAccount();
  const toast = useToast();
  const { addAction } = useAddAction("vaults");
  const [amount, setAmount] = useState<string>();
  const [dappParams, setDappParams] = useState<any>({});
  const {
    currentProtocol,
    actionType,
    toggleActionVisible,
    getListData,
    isBeraPaw,
  } = useVaultsV2Context();

  let _currentProtocol = currentProtocol;
  if (isBeraPaw) {
    _currentProtocol = currentProtocol?.linkVault;
  }

  const { tokenBalance, update, isLoading } = useTokenBalance(
    actionType.value === ACTION_TYPE.DEPOSIT
      ? _currentProtocol?.token?.address
      : !["Kodiak", "Memeswap"].includes(_currentProtocol.protocol)
      ? _currentProtocol?.vaultAddress
      : "",
    _currentProtocol.protocol === "Yeet" &&
      actionType.value === ACTION_TYPE.WITHDRAW
      ? 23
      : _currentProtocol?.token?.decimals
  );

  const {
    balance: memeswapBalance,
    update: updateMemeswapBalance,
    loading: memeswapLoading,
    queuedAmount
  } = useMemeswapBalance();

  const { data: beraPawLBGTWithdrawBalance, loading: beraPawLBGTWithdrawBalanceLoading } = useRequest(async () => {
    if (actionType.value === ACTION_TYPE.DEPOSIT || !account) {
      return "0";
    }
    if (
      _currentProtocol.protocol !== "BeraPaw"
      || _currentProtocol.vault_address.toLowerCase() !== bera["stlbgt"].address.toLowerCase()
    ) {
      return "0";
    }
    try {
      const stLBGTContract = new Contract(_currentProtocol.vault_address, ABI, provider);
      const stLBGTPreviewRedeem = await stLBGTContract.previewRedeem(utils.parseUnits(tokenBalance, bera["stlbgt"].decimals));
      return utils.formatUnits(stLBGTPreviewRedeem, bera["stlbgt"].decimals);
    } catch (err: any) {
      console.log("get berapaw LBGT withdraw balance error: %o", err);
    }
    return "0";
  }, { refreshDeps: [actionType, account, provider, tokenBalance, _currentProtocol] });

  const { handleReportWithoutDebounce } = useClickTracking();

  const [balanceShown, balanceLoading, updateBalance] = useMemo(() => {
    if (
      actionType.value === ACTION_TYPE.DEPOSIT ||
      ["D2 Finance", "Yeet"].includes(_currentProtocol.protocol)
    ) {
      return [tokenBalance, isLoading, update];
    }
    if (_currentProtocol.protocol === "Memeswap") {
      return [memeswapBalance, memeswapLoading, updateMemeswapBalance];
    }
    // stake BeraPaw LBGT
    if (
      _currentProtocol.protocol === "BeraPaw"
      && _currentProtocol.vault_address.toLowerCase() === bera["stlbgt"].address.toLowerCase()
    ) {
      return [beraPawLBGTWithdrawBalance, isLoading || beraPawLBGTWithdrawBalanceLoading, update];
    }
    return [Big(tokenBalance || 0).gt(0) ? tokenBalance : _currentProtocol?.user_stake?.amount || "0", isLoading, update];
  }, [actionType, tokenBalance, _currentProtocol?.user_stake, memeswapBalance, isLoading, update, beraPawLBGTWithdrawBalance, beraPawLBGTWithdrawBalanceLoading]);

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
        _currentProtocol.protocol === "D2 Finance" &&
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
    if (!_currentProtocol) return;

    if (actionType.value !== ACTION_TYPE.EXIT) {
      handleReportWithoutDebounce(
        actionType.value === ACTION_TYPE.DEPOSIT
          ? "1022-001-010"
          : "1022-001-011",
        _currentProtocol.vaultAddress
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
          .mul(10 ** _currentProtocol.token.decimals)
          .toFixed(0),
        currentRecord: _currentProtocol,
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
        if (isBeraPaw && actionType.value === ACTION_TYPE.DEPOSIT) {
          setAmount("");
        } else {
          toggleActionVisible({ visible: false });
        }
        getListData();
      } else {
        toast.fail({ title: actionType.button + " failed!" });
      }
      setLoading(false);

      if (actionType.button === "Exit") return;
      addAction?.({
        type: "Staking",
        action: actionType.button === "Deposit" ? "Stake" : "Unstake",
        token: _currentProtocol.token,
        amount,
        template: _currentProtocol.protocol,
        add: false,
        status,
        transactionHash,
        sub_type: actionType.button === "Deposit" ? "Stake" : "Unstake",
        tokens:
          _currentProtocol.tokens.length === 1
            ? _currentProtocol.tokens
            : [
                {
                  ..._currentProtocol.token,
                  symbol: _currentProtocol.tokens
                    .map((token: any) => token.symbol)
                    .join("-")
                }
              ],
        amounts: [amount],
        extra_data: {}
      });
      beraPawRef.current?.getEstimateMintLBGT();
      updateBalance?.();
    } catch (err: any) {
      console.log('err: %o', err);
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
    queuedAmount,
    beraPawRef
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
  beraPawRef: MutableRefObject<any>;
}
