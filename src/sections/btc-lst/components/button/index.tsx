import CircleLoading from "@/components/circle-loading";
import { useMultiState } from "@/hooks/use-multi-state";
import clsx from "clsx";
import { ethers } from "ethers";
import { memo, useEffect } from "react";
import Big from "big.js";
import useToast from "@/hooks/use-toast";
import useCustomAccount from "@/hooks/use-account";
import useExecutionContract from "@/hooks/use-execution-contract";
import useLpToAmount from "@/hooks/use-lp-to-amount";
import { VAULT_MAPPING } from "@/sections/bgt/config/gauge";
import useAddAction from "@/hooks/use-add-action";

import { useAppKit } from "@reown/appkit/react";
import { DEFAULT_CHAIN_ID } from "@/configs";
import { useSwitchChain } from "wagmi";
import { STAKE_ABI } from "../../constant";
import { EnabledLstItem } from "../../hooks/use-page";

interface IProps {
  type: "deposit" | "withdraw";
  amount: string;
  balance: string;
  onSuccess?: VoidFunction;
  children?: React.ReactNode;
  item?: EnabledLstItem;
}

export const PROJECT_STRATEGIES: any = {
  bedrock: {
    deposit: {
      method: "mint",
      approvalToken: "token0",
      formatParams: (tokenAddress: string, amount: ethers.BigNumber) => [tokenAddress, amount],
      spender: (item: EnabledLstItem) => item.dappConfig.STAKE_ADDRESS
    }
  },
  etherfi: {
    deposit: {
      method: "deposit",
      fee: 0.003,
      approvalToken: "token1",
      formatParams: (tokenAddress: string, amount: ethers.BigNumber) => {
        return [tokenAddress, amount, 0];
      },
      spender: (item: EnabledLstItem) => item.targetToken.address
    },
  }
};


export default function Button(props: IProps) {
  const { type, amount, balance, item, onSuccess } = props;

  const modal = useAppKit();
  const { addAction } = useAddAction("dapp");
  const { account, provider, chainId } = useCustomAccount();
  const toast = useToast();
  const { executionContract } = useExecutionContract();
  const { switchChain } = useSwitchChain();
  
  const token0 = item?.sourceToken;
  const token1 = item?.targetToken;

  const [state, updateState] = useMultiState({
    isLoading: false,
    isApproved: true,
    isApproving: false,
  });
  const BTN_CLASS =
    "w-full cursor-pointer flex items-center justify-center h-[60px] rounded-[10px] border border-black bg-[#FFDC50]  text-black font-Montserrat text-[18px] font-semibold leading-[90%]";

  const isInSufficient = Number(amount) > Number(balance);

  const checkApproval = (_amount: string) => {
    if (!item) return;
    
    const projectName = item.name.toLowerCase();
    const projectStrategy = PROJECT_STRATEGIES[projectName];
    
    if (!projectStrategy || !projectStrategy[type]) return;
    
    const approvalTokenType = projectStrategy[type].approvalToken || "token1";
    const tokenToApprove = approvalTokenType === "token0" ? token0 : token1;
    
    if (!tokenToApprove) return;
    
    const spenderAddress = projectStrategy[type].spender 
      ? projectStrategy[type].spender(item) 
      : item.dappConfig.STAKE_ADDRESS;
    
    const wei: any = ethers.utils.parseUnits(
      Big(_amount).toFixed(tokenToApprove?.decimals),
      tokenToApprove?.decimals
    );
    const _abi = [
      "function allowance(address, address) external view returns (uint256)",
    ];
    const contract = new ethers.Contract(
      tokenToApprove.address,
      _abi,
      provider?.getSigner()
    );
    updateState({
      isApproved: false,
    });
    contract
      .allowance(account, spenderAddress)
      .then((allowance: any) => {
        const approved = !new Big(allowance.toString()).lt(wei);
        updateState({
          isApproved: approved,
        });
      })
      .catch((e: Error) => console.log(e));
  };
  
  const handleApprove = () => {
    if (!item) return;
    
    const projectName = item.name.toLowerCase();
    const projectStrategy = PROJECT_STRATEGIES[projectName];
    
    if (!projectStrategy || !projectStrategy[type]) return;
    
    const approvalTokenType = projectStrategy[type].approvalToken || "token1";
    const tokenToApprove = approvalTokenType === "token0" ? token0 : token1;
    
    if (!tokenToApprove) return;
    
    const spenderAddress = projectStrategy[type].spender 
      ? projectStrategy[type].spender(item) 
      : item.dappConfig.STAKE_ADDRESS;
    
    const payload = { isApproving: true };
    const _amount = Big(amount).toFixed(tokenToApprove.decimals);
    const toastId = toast?.loading({
      title: `Approve ${tokenToApprove.symbol}`,
    });
    updateState({
      ...payload,
      isLoading: true,
    });
  
    const wei = ethers.utils.parseUnits(_amount, tokenToApprove.decimals);
    const _abi = ["function approve(address, uint) public"];
    const contract = new ethers.Contract(
      tokenToApprove.address,
      _abi,
      provider?.getSigner()
    );
  
    contract
      .approve(spenderAddress, wei)
      .then((tx: any) => tx.wait())
      .then((receipt: any) => {
        const payload = { isApproved: true, isApproving: false };
        updateState({ ...payload, isLoading: false });
        toast?.dismiss(toastId);
        toast?.success({
          title: "Approve Successful!",
          tx: receipt.transactionHash,
          chainId,
        });
      })
      .catch((error: Error) => {
        console.log("error: ", error);
        updateState({
          isLoading: false,
          isApproving: false,
        });
        toast?.dismiss(toastId);
        toast?.fail({
          title: "Approve Failed!",
          text: error?.message?.includes("user rejected transaction")
            ? "User rejected transaction"
            : null,
        });
      });
  };

  const handleDepositOrWithdraw = async function () {
    if (!token0 || !item) return;
    const toastId = toast?.loading({
      title: type === "deposit" ? "Depositing..." : "Withdrawing...",
    });
    updateState({
      isLoading: true,
    });
  
    try {
      const wei = ethers.utils.parseUnits(amount, token0.decimals);
      const contract = new ethers.Contract(
        item.dappConfig.STAKE_ADDRESS,
        STAKE_ABI,
        provider?.getSigner()
      );
  
      const projectName = item.name.toLowerCase();
      const projectStrategy = PROJECT_STRATEGIES[projectName];
      
      if (!projectStrategy) {
        return
      }
      
      const operationConfig = projectStrategy[type];
      
      if (!operationConfig) {
        return
      }
      
      const methodName = operationConfig.method;
      const params = operationConfig.formatParams(token0.address, wei);

      const receipt = await executionContract({
        contract,
        method: methodName,
        params
      });

      if (!receipt) {
        return
      }

      const { status, transactionHash } = receipt;
      const addParams = {
        type: "Staking",
        action: "Staking",
        tokens: [{ symbol: token0.symbol }],
        amount,
        template: "btc-lst",
        status: status,
        add: 1,
        transactionHash,
        chain_id: chainId,
        sub_type: type === "deposit" ? "Stake" : "Unstake",
      };
      
      addAction?.(addParams);
      updateState({
        isLoading: false,
      });
      
      setTimeout(() => {
        onSuccess?.();
      }, 3000);
  
      toast?.dismiss(toastId);
      toast?.success({
        title: `${type === "deposit" ? "Deposit" : "Withdraw"} successful!`,
        tx: transactionHash,
        chainId,
      });
    } catch (error: any) {
      console.log(error, '<<---error');
      toast?.dismiss(toastId);
      toast?.fail({
        title: `${type === "deposit" ? "Deposit" : "Withdraw"} failed!`,
        text: error?.message?.includes("user rejected transaction")
          ? "user rejected transaction"
          : error?.message ?? "",
      });
    } finally {
      updateState({
        isLoading: false,
      });
    }
  };

  useEffect(() => {
    if (type === "deposit") {
      if (amount === "") {
        updateState({
          isApproved: true,
        });
      } else {
        checkApproval(amount);
      }
    }
  }, [amount]);

  if (!account) {
    return (
      <button
        className={BTN_CLASS}
        onClick={() => modal.open()}
      >
        Connect Wallet
      </button>
    );
  }

    if (DEFAULT_CHAIN_ID !== chainId) {
      return (
        <button
          className={BTN_CLASS}
          onClick={() =>
            switchChain({
              chainId: DEFAULT_CHAIN_ID,
            })
          }
        >
          Switch Network
        </button>
      );
    }

  if (isInSufficient) {
    return (
      <div className={clsx(BTN_CLASS, "opacity-60 !cursor-not-allowed")}>
        InSufficient Balance
      </div>
    );
  }

  if (Number(amount) <= 0) {
    return (
      <div className={clsx(BTN_CLASS, "opacity-60 !cursor-not-allowed")}>
        {props?.children}
      </div>
    );
  }

  if (state?.isLoading) {
    return (
      <div className={clsx(BTN_CLASS, "!opacity-50 !cursor-not-allowed")}>
        <CircleLoading size={14} />
      </div>
    );
  }

  if ((state?.isApproved && !state?.isApproving) || type === "withdraw") {
    return (
      <div className={BTN_CLASS} onClick={handleDepositOrWithdraw}>
        {props?.children}
      </div>
    );
  } else {
    return (
      <button
        disabled={state?.isApproved || state?.isApproving}
        className={clsx(BTN_CLASS, {
          "opacity-50": state?.isApproved || state?.isApproving,
        })}
        onClick={() => handleApprove()}
      >
        {state?.isApproving ? (
          <CircleLoading size={14} />
        ) : (
          <>
            {state?.isApproved ? "Approved" : "Approve"} {token0?.symbol}
          </>
        )}
      </button>
    );
  }
}
