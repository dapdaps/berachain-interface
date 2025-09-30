import { useEffect, useMemo, useState } from "react";
import { EMove } from "../config";
import useCustomAccount from "@/hooks/use-account";
import { useConnectWallet } from "@/hooks/use-connect-wallet";
import useToast from "@/hooks/use-toast";
import { useRequest } from "ahooks";
import { DEFAULT_CHAIN_ID } from "@/configs";
import { Contract, utils } from "ethers";
import { RPS_CONTRACT_ADDRESS, RPS_CONTRACT_ADDRESS_ABI } from "../contract";
import Big from "big.js";

export function useCreate(props?: any) {
  const {
    betToken,
    betTokenBalance,
    getBetTokenBalance,
    getList,
    getListDelay,
    gameConfig,
  } = props ?? {};

  const { accountWithAk, account, chainId, provider } = useCustomAccount();
  const { onConnect, onSwitchChain } = useConnectWallet();
  const toast = useToast();

  const [betMove, setBetMove] = useState<EMove[]>([]);
  const [betAmount, setBetAmount] = useState<string>();

  const onSelectMove = (move: EMove) => {
    setBetMove((prev) => {
      const _betMonster = [...prev];
      if (_betMonster.includes(move)) {
        _betMonster.splice(_betMonster.indexOf(move), 1);
      } else {
        _betMonster.push(move);
        if (_betMonster.length > 2) {
          _betMonster.shift();
        }
      }
      return _betMonster;
    });
  };

  const { runAsync: onCreate, loading: creating } = useRequest(async () => {
    if (!account) {
      onConnect();
      return;
    }
    if (chainId !== DEFAULT_CHAIN_ID) {
      onSwitchChain({ chainId: DEFAULT_CHAIN_ID });
      return;
    }
    let toastId = toast.loading({
      title: "Creating...",
    });

    const isDouble = betMove.length > 1;
    const parsedAmount = utils.parseUnits(Big(betAmount || "0").times(isDouble ? 2 : 1).toFixed(betToken.decimals), betToken.decimals);
    const signer = provider.getSigner(account);

    const contract = new Contract(RPS_CONTRACT_ADDRESS, RPS_CONTRACT_ADDRESS_ABI, signer);
    const options: any = {
      value: parsedAmount,
    };

    let params = [
      parsedAmount,
      betMove[0],
    ];
    if (isDouble) {
      params = [
        utils.parseUnits(betAmount || "0", betToken.decimals),
        betMove[0] < betMove[1] ? betMove[0] : betMove[1],
        betMove[1] < betMove[0] ? betMove[0] : betMove[1],
      ];
    }

    let method = "initRoom";
    if (isDouble) {
      method = "initAndJoinRoom";
    }

    console.log("create amount: %o", utils.formatUnits(parsedAmount, betToken.decimals));
    console.log("create params: %o", params);
    console.log("create method: %o", method);
    console.log("create options: %o", options);

    try {
      const estimatedGas = await contract.estimateGas[method](...params, options);
      options.gasLimit = Math.floor(Number(estimatedGas) * 1.2);
    } catch (err) {
      options.gasLimit = 10000000;
      console.log("estimate gas failed: %o", err);
    }

    try {
      const tx = await contract[method](...params, options);

      toast.dismiss(toastId);
      toastId = toast.loading({ title: "Confirming...", chainId, tx: tx.hash });
      const { status, transactionHash } = await tx.wait();
      toast.dismiss(toastId);

      if (status !== 1) {
        toast.fail({
          title: "Created failed",
          tx: transactionHash,
          chainId,
        });
        return;
      }

      toast.success({
        title: "Created successful",
        tx: transactionHash,
        chainId,
      });

      // reload list
      setBetMove([]);
      getBetTokenBalance();
      getListDelay();
    } catch (error: any) {
      console.log("create rps failed: %o", error);
      toast.dismiss(toastId);
      toast.fail({
        title: "Create failed",
        text: error?.message?.includes("user rejected transaction") ? "User rejected transaction" : "",
      });
    }
  }, {
    manual: true,
  });

  const buttonValid = useMemo(() => {
    const _result = { disabled: true, text: "", loading: false };
    if (!account) {
      _result.text = "Connect Wallet";
      _result.disabled = false;
      return _result;
    }
    if (chainId !== DEFAULT_CHAIN_ID) {
      _result.text = "Switch Network";
      _result.disabled = false;
      return _result;
    }
    if (creating) {
      _result.loading = true;
    }
    if (Big(betAmount || 0).lte(0)) {
      _result.text = "Enter an amount";
      return _result;
    }
    if (Big(betAmount || 0).gt(Big(betTokenBalance || 0))) {
      _result.text = "Insufficient balance";
      return _result;
    }
    if (Big(betAmount || 0).lt(gameConfig?.minBetAmount || 1)) {
      _result.text = `Minimum amount is ${gameConfig?.minBetAmount || 1}`;
      return _result;
    }
    if (betMove.length < 1) {
      _result.text = "Select your guess";
      return _result;
    }
    _result.disabled = false;
    return _result;
  }, [betAmount, betMove, creating, account, chainId, betTokenBalance, gameConfig]);

  useEffect(() => {
    if (!gameConfig?.minBetAmount) {
      setBetAmount("1");
      return;
    }
    setBetAmount(gameConfig.minBetAmount);
  }, [gameConfig]);

  return {
    betMove,
    onSelectMove,
    setBetAmount,
    betAmount,
    onCreate,
    creating,
    buttonValid,
  };
}
