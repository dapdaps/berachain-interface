import { ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import useCustomAccount from "./use-account";
import useInfraredList from "@/sections/staking/hooks/use-infrared-list";
import useToast from "@/hooks/use-toast";
import { useMultiState } from "@/hooks/use-multi-state";
import Big from "big.js";
import { useRouter, useSearchParams } from 'next/navigation';
import useClickTracking from "@/hooks/use-click-tracking";
import useAddAction from "@/hooks/use-add-action";
import useLpToAmount from "@/hooks/use-lp-to-amount";
import { bera } from '@/configs/tokens/bera';

export const IBGT_ADDRESS = "0xac03CABA51e17c86c921E1f6CBFBdC91F8BB2E6b";
export const STAKED_IBGT_ADDRESS = "0x75f3be06b02e235f6d0e7ef2d462b29739168301"
export const ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];

export type DataType = {
  count: number | string;
  total: number | string;
  staked: number | string;
};
export function useIBGT() {
  const { chainId } = useCustomAccount()
  const router = useRouter();
  const { handleReport } = useClickTracking();
  const { provider, account } = useCustomAccount();
  const searchParams = useSearchParams();
  const searchParamFrom = searchParams.get("from");
  const { addAction } = useAddAction(searchParamFrom === "vaults" ? "vaults" : "ibgt");
  const sender = account;

  const [data, setData] = useState<DataType>({
    count: 0,
    total: 0,
    staked: 0
  });

  const queryData = async function () {
    const FirstContract = new ethers.Contract(IBGT_ADDRESS, ABI, provider);
    const SecondContract = new ethers.Contract(STAKED_IBGT_ADDRESS, ABI, provider)
    try {
      const balanceOfResult = await FirstContract?.balanceOf(account);
      const totalSupplyResult = await FirstContract?.totalSupply();
      const stakedBalanceOfResult = await SecondContract?.totalSupply();
      setData((prev: DataType) => {
        return {
          ...prev,
          count: ethers.utils.formatUnits(balanceOfResult),
          total: ethers.utils.formatUnits(totalSupplyResult),
          staked: ethers.utils.formatUnits(stakedBalanceOfResult)
        };
      });
    } catch (error) {
      console.log("===error", error);
    }
  };
  const toast = useToast();
  const tabs = ["Stake", "Unstake"];
  const [tIndex, setTIndex] = useState(0);
  const [state, updateState] = useMultiState({
    balances: [],
    lpBalance: "",
    inAmount: "",
    lpAmount: "",
    isLoading: false,
    isError: false,
    loadingMsg: "",
    isTokenApproved: true,
    isTokenApproving: false,
    updater: 0
  });
  const sourceBalances: any = {};

  const {
    balances,
    inAmount,
    isLoading,
    isTokenApproved,
    isTokenApproving,
    lpBalance,
    lpAmount,
    updater
  } = state;

  const { loading, dataList, fullDataList } = useInfraredList(updater);
  const tokenData = useMemo(
    () => fullDataList?.find((d: any) => d.id === "iBGT"),
    [fullDataList]
  );
  const { tokens, decimals, id, LP_ADDRESS, rewardSymbol } = tokenData ?? {};
  const multipleAttributesTokens = useMemo(() => {
    if (Array.isArray(tokens)) {
      return tokens.map((token: any) => {
        let _token: any = {
          symbol: token,
        };
        const currToken = Object.values(bera).find((_t) => _t.symbol.toLowerCase() === token.toLowerCase());
        if (currToken) {
          _token = {
            ...currToken,
          };
        }
        return _token;
      });
    }
    return [];
  }, [tokens]);
  const rewardTokenWithMultipleAttributes = useMemo(() => {
    const currToken = Object.values(bera).find((_t) => _t.symbol.toLowerCase() === rewardSymbol?.toLowerCase());
    return {
      ...currToken,
    };
  }, [rewardSymbol]);

  const symbol = id;
  const isInSufficient = Number(inAmount) > Number(balances[symbol]);
  const isWithdrawInsufficient = Number(lpAmount) > Number(lpBalance);
  const balanceLp =
    !lpAmount || !lpBalance
      ? "-"
      : parseFloat(
        Big(lpAmount)
          .div(Big(lpBalance).gt(0) ? lpBalance : 1)
          .toFixed(4)
      );

  const { handleGetAmount } = useLpToAmount(LP_ADDRESS);

  const updateLPBalance = () => {
    const abi = ["function balanceOf(address) view returns (uint256)"];
    const contract = new ethers.Contract(
      tokenData?.vaultAddress,
      abi,
      provider
    );
    contract.balanceOf(sender).then((balanceBig: any) => {
      const adjustedBalance = ethers.utils.formatUnits(balanceBig, 18);
      updateState({
        lpBalance: adjustedBalance
      });
    });
  };
  const updateBalance = () => {
    const abi = ["function balanceOf(address) view returns (uint256)"];
    const contract = new ethers.Contract(
      LP_ADDRESS,
      abi,
      provider
    );
    contract
      .balanceOf(sender)
      .then((balanceBig: any) => {
        const adjustedBalance = Big(
          ethers.utils.formatUnits(balanceBig)
        ).toFixed();
        sourceBalances[symbol] = adjustedBalance;
        updateState({
          balances: sourceBalances
        });
      })
      .catch((error: Error) => {
        console.log("error: ", error);
        setTimeout(() => {
          updateBalance();
        }, 1500);
      });
  };
  const checkApproval = (amount: string) => {
    const wei: any = ethers.utils.parseUnits(
      Big(amount).toFixed(decimals),
      decimals
    );
    const abi = [
      "function allowance(address, address) external view returns (uint256)"
    ];
    const contract = new ethers.Contract(LP_ADDRESS, abi, provider.getSigner());
    updateState({
      isTokenApproved: false
    });
    contract
      .allowance(sender, tokenData?.vaultAddress)
      .then((allowance: any) => {
        const approved = !new Big(allowance.toString()).lt(wei);
        updateState({
          isTokenApproved: approved
        });
      })
      .catch((e: Error) => console.log(e));
  };

  const handleMax = () => {
    handleTokenChange(balances[symbol]);
  };

  const handleTokenChange = (amount: string) => {
    updateState({ inAmount: amount });
    if (amount === "") {
      updateState({
        inAmount: "",
        isTokenApproved: true
      });
      return;
    }
    checkApproval(amount);
  };
  const handleLPChange = (amount: string) => {
    updateState({
      lpAmount: amount
    });
  };

  const handleApprove = () => {
    const payload = { isTokenApproving: true };
    const amount = Big(inAmount).toFixed(decimals);
    const toastId = toast?.loading({
      title: `Approve ${symbol}`
    });
    updateState({
      ...payload,
      isLoading: true,
      loadingMsg: `Approving ${symbol}...`
    });
    const wei = ethers.utils.parseUnits(amount, decimals);
    const abi = ["function approve(address, uint) public"];
    const contract = new ethers.Contract(LP_ADDRESS, abi, provider.getSigner());

    contract
      .approve(tokenData?.vaultAddress, wei)
      .then((tx: any) => tx.wait())
      .then((receipt: any) => {
        const payload = { isTokenApproved: true, isTokenApproving: false };
        updateState({ ...payload, isLoading: false, loadingMsg: "" });
        toast?.dismiss(toastId);
        toast?.success({
          title: "Approve Successful!",
          tx: receipt.transactionHash,
          chainId
        });
      })
      .catch((error: Error) => {
        console.log("error: ", error);
        updateState({
          isError: true,
          isLoading: false,
          loadingMsg: error?.message,
          isTokenApproving: false
        });
        toast?.dismiss(toastId);
        toast?.fail({
          title: "Approve Failed!",
          text: error?.message?.includes("user rejected transaction")
            ? "User rejected transaction"
            : null
        });
      });
  };

  const handleDeposit = () => {
    const toastId = toast?.loading({
      title: `Depositing...`
    });
    updateState({
      isLoading: true,
      isError: false,
      loadingMsg: "Depositing..."
    });
    const wei = ethers.utils.parseUnits(
      Big(inAmount).toFixed(decimals),
      decimals
    );
    const abi = [
      {
        constant: false,
        inputs: [
          {
            name: "amount",
            type: "uint256"
          }
        ],
        name: "stake",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      }
    ];
    const contract = new ethers.Contract(
      tokenData?.vaultAddress,
      abi,
      provider.getSigner()
    );
    const createTx = (gas: any) => {
      contract
        .stake(wei, { gasLimit: gas })
        .then((tx: any) => tx.wait())
        .then((receipt: any) => {
          const { status, transactionHash } = receipt;
          const [amount0, amount1] = handleGetAmount(inAmount);
          addAction?.({
            type: "Staking",
            action: "Staking",
            tokens: multipleAttributesTokens,
            amount: inAmount,
            amounts: [inAmount],
            template: "Infrared",
            status: status,
            add: 1,
            transactionHash,
            chain_id: chainId,
            sub_type: "Stake",
            extra_data: {}
          });
          updateState({
            isLoading: false
            // isPostTx: true
          });
          setTimeout(() => {
            onSuccess?.();
          }, 3000);

          toast?.dismiss(toastId);
          toast?.success({
            title: "Deposit successful!"
          });
        })
        .catch((error: Error) => {
          console.log("error: ", error);
          updateState({
            isError: true,
            isLoading: false,
            loadingMsg: error?.message
          });
          toast?.dismiss(toastId);
          toast?.fail({
            title: "Deposit Failed!",
            text: error?.message?.includes("user rejected transaction")
              ? "User rejected transaction"
              : error?.message ?? ""
          });
        });
    };
    contract.estimateGas
      .stake(wei)
      .then((res: any) => {
        createTx(res);
      })
      .catch((err: any) => {
        createTx(4000000);
      });
  };
  const handleWithdraw = () => {
    const toastId = toast?.loading({
      title: `Withdrawing...`
    });
    updateState({
      isLoading: true,
      isError: false,
      loadingMsg: "Withdrawing..."
    });

    const lpWeiAmount = ethers.utils.parseUnits(Big(lpAmount).toFixed(18), 18);
    const abi = [
      {
        constant: false,
        inputs: [
          {
            name: "_shareAmt",
            type: "uint256"
          }
        ],
        name: "withdraw",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      }
    ];

    const contract = new ethers.Contract(
      tokenData?.vaultAddress,
      abi,
      provider.getSigner()
    );
    const createTx = (gas: any) => {
      contract
        .withdraw(lpWeiAmount, { gasLimit: gas })
        .then((tx: any) => tx.wait())
        .then((receipt: any) => {
          updateState({
            isLoading: false
          });
          const { status, transactionHash } = receipt;
          const [amount0, amount1] = handleGetAmount(lpAmount);
          addAction?.({
            type: "Staking",
            action: "UnStake",
            tokens: multipleAttributesTokens,
            amount: lpAmount,
            amounts: [lpAmount],
            template: "Infrared",
            status: status,
            add: 0,
            transactionHash,
            chain_id: chainId,
            sub_type: "Unstake",
            extra_data: {}
          });

          setTimeout(() => {
            onSuccess?.();
          }, 3000);

          toast?.dismiss(toastId);
          toast?.success({
            title: "Withdraw Successful!"
          });
        })
        .catch((error: Error) => {
          console.log("===error", error);
          updateState({
            isError: true,
            isLoading: false,
            loadingMsg: error?.message
          });
          toast?.dismiss(toastId);
          toast?.fail({
            title: "Withdraw Failed!",
            text: error?.message?.includes("user rejected transaction")
              ? "User rejected transaction"
              : error?.message ?? ""
          });
        });
    };
    contract.estimateGas
      .withdraw(lpWeiAmount)
      .then((res: any) => {
        createTx(res);
      })
      .catch((err: any) => {
        createTx(4000000);
      });
  };

  const handleClaim = function () {
    const toastId = toast?.loading({
      title: `Claim...`
    });
    const abi = [
      {
        constant: false,
        inputs: [],
        name: "getReward",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      }
    ];
    const contract = new ethers.Contract(
      tokenData?.vaultAddress,
      abi,
      provider.getSigner()
    );
    const createTx = (gas: any) => {
      contract
        .getReward({ gasLimit: gas })
        .then((tx: any) => tx.wait())
        .then((receipt: any) => {
          const { status, transactionHash } = receipt;
          addAction?.({
            type: "Staking",
            action: "Claim",
            tokens: tokenData ? [rewardTokenWithMultipleAttributes] : [],
            amount: tokenData?.earned,
            amounts: [tokenData?.earned],
            template: "Infrared",
            status: status,
            transactionHash,
            chain_id: chainId,
            sub_type: "Claim",
            extra_data: {}
          });
          toast?.dismiss(toastId);
          toast?.success({
            title: "Claim Successful!"
          });
          setTimeout(() => {
            onSuccess?.();
          }, 3000);
        })
        .catch((error: Error) => {
          console.log("error: ", error);
          toast?.dismiss(toastId);
          toast?.fail({
            title: "Claim Failed!",
            text: error?.message?.includes("user rejected transaction")
              ? "User rejected transaction"
              : error?.message ?? ""
          });
        });
    };
    contract.estimateGas
      .getReward()
      .then((res: any) => {
        createTx(res);
      })
      .catch((err: any) => {
        createTx(4000000);
      });
  };
  const onSuccess = function () {
    updateState({
      updater: Date.now(),
      isTokenApproved: true,
      isTokenApproving: false
    });
    tIndex === 0 ? handleTokenChange("") : handleLPChange("");
  };

  const handleMintIBGT = () => {
    router.push("/dex/bex?lp=");
    handleReport("1010-005-001");
  };

  useEffect(() => {
    if (!sender || !provider || !tokenData?.vaultAddress) return;
    updateBalance();
    updateLPBalance();
  }, [sender, provider, tokenData?.vaultAddress, updater]);

  useEffect(() => {
    provider && account && queryData();
  }, [provider, account, updater]);

  return {
    data,
    queryData,
    tokenData,
    loading,
    dataList,
    tabs,
    tIndex,
    setTIndex,
    state,
    updateState,
    sourceBalances,
    isInSufficient,
    isWithdrawInsufficient,
    balanceLp,
    updateLPBalance,
    updateBalance,
    checkApproval,
    handleMax,
    handleTokenChange,
    handleLPChange,
    handleApprove,
    handleDeposit,
    handleWithdraw,
    handleClaim,
    onSuccess,
    symbol,
    handleMintIBGT
  };
}

interface Props {
  query(): any;
}
