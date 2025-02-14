import { useMultiState } from "@/hooks/use-multi-state";
import config from "@/configs/staking/dapps/infrared";
import { DEFAULT_CHAIN_ID } from "@/configs";
import Big from "big.js";
import { ethers } from "ethers";
import { useEffect, useMemo, useRef, useState } from "react";
import { stakeAbi, withdrawAbi } from "@/sections/staking/Bridge/Detail";
import kodiak from "@/configs/pools/kodiak";
import { useProvider } from "@/hooks/use-provider";
import useAccount from "@/hooks/use-account";
import useToast from "@/hooks/use-toast";
import useLpToAmount from "@/hooks/use-lp-to-amount";
import useAddAction from "@/hooks/use-add-action";

export function useDetail(props: any) {
  const { id, name, data, defaultIndex } = props;

  const { provider } = useProvider();
  const { account: sender, chainId } = useAccount();
  const toast = useToast();
  const { handleGetAmount } = useLpToAmount(
    data?.LP_ADDRESS,
    data?.initialData?.protocol
  );
  const { addAction } = useAddAction("dapp");

  const detailBerpsRef = useRef<any>();
  const [claiming, setClaiming] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isBerpsDepositVisible, setIsBerpsDepositVisible] = useState(false);

  const isBERPS = name === "Berps";
  const isInfraredBerps =
    name === "Infrared" &&
    data?.initialData?.pool?.protocol?.id === "berps" &&
    data?.initialData?.pool?.name === "BHONEY";

  const symbol = isBERPS ? data?.depositToken?.symbol : id;
  const { decimals, tokens, LP_ADDRESS } = data || {};

  const [state, updateState] = useMultiState<any>({
    // isDeposit: tab === "Stake" || !tab,
    balances: [],
    lpBalance: "",
    inAmount: "",
    // lpAmount: '',
    isLoading: false,
    isTokenApproved: true,
    isTokenApproving: false,
    updater: 0
  });

  const {
    // isDeposit,
    balances,
    inAmount,
    isLoading,
    isTokenApproved,
    isTokenApproving,
    lpBalance,
    lpAmount,
    updater
  } = state;

  const sourceBalances: any = {};
  const contractAddr = isBERPS ? data?.depositToken?.address : LP_ADDRESS;

  const approveSpender = isBERPS
    ? data?.withdrawToken?.address
    : data.vaultAddress;
  const stakeMethod = isBERPS ? "deposit" : "stake";
  const unStakeMethod = isBERPS ? "makeWithdrawRequest" : "withdraw";

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

  const updateLPBalance = () => {
    const abi = ["function balanceOf(address) view returns (uint256)"];
    let _contractAddr = data.vaultAddress;
    if (isBERPS) {
      _contractAddr = data?.withdrawToken?.address;
    }

    const contract = new ethers.Contract(
      _contractAddr,
      abi,
      provider?.getSigner()
    );
    contract.balanceOf(sender).then((balanceBig: any) => {
      const adjustedBalance = ethers.utils.formatUnits(
        balanceBig,
        data.decimals
      );

      updateState({
        lpBalance: adjustedBalance
      });
    });
  };
  const updateBalance = () => {
    const abi = ["function balanceOf(address) view returns (uint256)"];
    const contract = new ethers.Contract(
      contractAddr,
      abi,
      provider?.getSigner()
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
  const checkApproval = (amount: any) => {
    const wei: any = ethers.utils.parseUnits(
      Big(amount).toFixed(decimals),
      decimals
    );
    const abi = [
      "function allowance(address, address) external view returns (uint256)"
    ];
    const contract = new ethers.Contract(
      contractAddr,
      abi,
      provider?.getSigner()
    );
    updateState({
      isTokenApproved: false
    });
    contract
      .allowance(sender, approveSpender)
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

  const handleTokenChange = (amount: any) => {
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
    const contract = new ethers.Contract(
      contractAddr,
      abi,
      provider?.getSigner()
    );

    contract
      .approve(approveSpender, wei)
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
      title: `Staking...`
    });
    updateState({
      toastId,
      isLoading: true,
      isError: false,
      loadingMsg: "Staking..."
    });
    const wei = ethers.utils.parseUnits(
      Big(inAmount).toFixed(decimals),
      decimals
    );
    const contract = new ethers.Contract(
      approveSpender,
      stakeAbi,
      provider?.getSigner()
    );
    const params: any = [wei];
    if (isBERPS) {
      params.push(sender);
    }
    const createTx = (gasLimit: any) => {
      contract[stakeMethod](...params, { gasLimit })
        .then((tx: any) => tx.wait())
        .then((receipt: any) => {
          const { status, transactionHash } = receipt;
          const [amount0, amount1] = handleGetAmount(inAmount);
          const _symbol = tokens.join("-");
          addAction?.({
            type: "Staking",
            action: "Staking",
            tokens:
              _symbol === "YEET-BERA"
                ? [{ symbol: "KODIAK-3" }]
                : tokens.map((token: string) => ({ symbol: token })),
            amount: inAmount,
            template: name || "Infrared",
            status: status,
            add: 1,
            transactionHash,
            chain_id: chainId,
            sub_type: "Stake",
            amounts: [amount0, amount1],
            extra_data: {}
          });
          updateState({
            isLoading: false,
            isPostTx: true
          });
          setTimeout(() => {
            onSuccess?.();
          }, 3000);

          toast?.dismiss(toastId);
          toast?.success({
            title: "Stake Successful!",
            tx: transactionHash,
            chainId
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
            title: "Stake Failed!",
            text: error?.message?.includes("user rejected transaction")
              ? "User rejected transaction"
              : error?.message ?? ""
          });
        });
    };
    contract.estimateGas[stakeMethod](...params)
      .then((res: any) => {
        createTx(res);
      })
      .catch((err: any) => {
        console.log("estimateGas failed: %o", err);
        createTx(4000000);
      });
  };
  const handleWithdraw = () => {
    const toastId = toast?.loading({
      title: `Unstaking...`
    });
    updateState({
      isLoading: true,
      isError: false,
      loadingMsg: "Unstaking..."
    });

    const lpWeiAmount = ethers.utils.parseUnits(Big(lpAmount).toFixed(18), 18);

    const contract = new ethers.Contract(
      approveSpender,
      withdrawAbi,
      provider?.getSigner()
    );
    const createTx = (gasLimit: any) => {
      contract[unStakeMethod](lpWeiAmount, { gasLimit })
        .then((tx: any) => tx.wait())
        .then((receipt: any) => {
          updateState({
            isLoading: false,
            isPostTx: true
          });
          const { status, transactionHash } = receipt;
          const [amount0, amount1] = handleGetAmount(lpAmount);
          const _symbol = tokens.join("-");
          addAction?.({
            type: "Staking",
            action: "UnStake",
            tokens:
              _symbol === "YEET-BERA"
                ? [{ symbol: "KODIAK-3" }]
                : tokens.map((token: string) => ({ symbol: token })),
            amount: lpAmount,
            template: name || "Infrared",
            status: status,
            add: 0,
            transactionHash,
            chain_id: chainId,
            sub_type: "Unstake",
            amounts: [amount0, amount1],
            extra_data: {}
          });
          setTimeout(() => {
            onSuccess?.();
          }, 3000);

          toast?.dismiss(toastId);
          toast?.success({
            title: "Unstake Successful!",
            tx: transactionHash,
            chainId
          });
          if (isBERPS) {
            detailBerpsRef.current?.getList?.();
          }
        })
        .catch((error: Error) => {
          updateState({
            isError: true,
            isLoading: false,
            loadingMsg: error?.message
          });
          toast?.dismiss(toastId);
          toast?.fail({
            title: "Unstake Failed!",
            text: error?.message?.includes("user rejected transaction")
              ? "User rejected transaction"
              : error?.message ?? ""
          });
        });
    };
    contract.estimateGas[unStakeMethod](lpWeiAmount)
      .then((res: any) => {
        createTx(res);
      })
      .catch((err: any) => {
        console.log("estimateGas failed: %o", err);
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
      data?.vaultAddress,
      abi,
      provider.getSigner()
    );

    setClaiming(true);
    contract
      .getReward()
      .then((tx: any) => tx.wait())
      .then((receipt: any) => {
        const { status, transactionHash } = receipt;
        addAction?.({
          type: "Staking",
          action: "Claim",
          tokens: tokens.map((token: string) => ({ symbol: token })),
          amount: data?.earned,
          template: name || "Infrared",
          status: status,
          transactionHash,
          chain_id: chainId,
          sub_type: "Claim"
        });
        toast?.dismiss(toastId);
        toast?.success({
          title: "Claim Successful!"
        });
        setTimeout(() => {
          onSuccess?.();
        }, 3000);
        setClaiming(false);
      })
      .catch((error: Error) => {
        console.log("error: ", error);
        setClaiming(false);
        toast?.dismiss(toastId);
        toast?.fail({
          title: "Claim Failed!",
          text: error?.message?.includes("user rejected transaction")
            ? "User rejected transaction"
            : error?.message ?? ""
        });
      });
  };
  const onUpdateLpPercent = (percent: number) => {
    updateState({
      lpPercent: percent
    });
  };

  const onSuccess = function () {
    updateState({
      updater: Date.now(),
      isTokenApproved: true,
      isTokenApproving: false
    });
    Number(defaultIndex) === 0 ? handleTokenChange("") : handleLPChange("");
    props.onSuccess?.();
  };

  const handleMintLP = (visible: boolean) => {
    if (isInfraredBerps) {
      setIsBerpsDepositVisible(visible);
      return;
    }
    setShowAddModal(visible);
  };

  const mintData = useMemo<any>(() => {
    const protocol = data?.initialData?.protocol;
    if (!protocol) return;
    if (!["beraswap", "kodiak"].includes(protocol?.id)) return null;
    const sweetenedIslandItem = (kodiak.sweetenedIslands as any)[
      data?.initialData?.stake_token?.address
    ];
    if (protocol?.id === "kodiak" && sweetenedIslandItem) {
      return {
        token0: sweetenedIslandItem.token0,
        token1: sweetenedIslandItem.token1,
        version: "island",
        protocol: "kodiak",
        stakingToken: data?.initialData?.stake_token
      };
    }
    const index = kodiak?.islands?.findIndex(
      (address: string) => data?.initialData?.stake_token?.address === address
    );
    const underlying_tokens = data?.initialData?.underlying_tokens;
    if (index > -1) {
      const array = data?.initialData?.stake_token?.name?.split("-");
      const symbol0 = array[0];
      const symbol1 = array[1];
      const token0 =
        underlying_tokens?.find((token) => token?.name === symbol0) ?? null;
      const token1 =
        underlying_tokens?.find((token) => token?.name === symbol1) ?? null;
      if (token0 && token1) {
        return {
          protocol: protocol?.id,
          token0: { ...token0, icon: token0?.image },
          token1: { ...token1, icon: token1?.image },
          version: "island",
          protocol: "kodiak",
          stakingToken: data?.initialData?.stake_token
        };
      } else {
        console.error("some error");
      }
    }
    if (underlying_tokens?.length === 2)
      return {
        protocol: protocol?.id,
        token0: { ...underlying_tokens[0], icon: data.images[0] },
        token1: { ...underlying_tokens[1], icon: data.images[1] },
        version: "v2"
      };
    return null;
  }, [data]);

  const withdrawable = useMemo(() => {
    return !(isWithdrawInsufficient || isLoading || Number(lpAmount || 0) <= 0);
  }, [isWithdrawInsufficient, isLoading, lpAmount]);

  useEffect(() => {
    if (!sender || !data.vaultAddress || !provider) return;
    updateBalance();
    updateLPBalance();
  }, [sender, data, updater, provider]);

  return {
    state,
    updateState,
    isBERPS,
    isInfraredBerps,
    symbol,
    contractAddr,
    vaultAddress: data.vaultAddress,
    approveSpender,
    stakeMethod,
    unStakeMethod,
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
    onUpdateLpPercent,
    onSuccess,
    handleMintLP,
    mintData,
    withdrawable,
    showAddModal,
    setShowAddModal,
    detailBerpsRef,
    claiming,
    isBerpsDepositVisible,
    setIsBerpsDepositVisible
  };
}
