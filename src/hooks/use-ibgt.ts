import { ethers } from 'ethers';
import { useEffect, useMemo, useState } from 'react';
import useCustomAccount from './use-account';
import useInfraredList from '@/sections/staking/hooks/use-infrared-list';
import useToast from '@/hooks/use-toast';
import { useMultiState } from '@/hooks/use-multi-state';
import Big from 'big.js';
import { useRouter } from 'next/navigation';
import useClickTracking from '@/hooks/use-click-tracking';
import useAddAction from "@/hooks/use-add-action";
import useLpToAmount from '@/hooks/use-lp-to-amount';

const IBGT_ADDRESS = "0x46efc86f0d7455f135cc9df501673739d513e982"

const ABI = [{
  "inputs": [
    {
      "internalType": "address",
      "name": "account",
      "type": "address"
    }
  ],
  "name": "balanceOf",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "totalSupply",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function"
}]

export type DataType = {
  count: number | string;
  total: number | string;
  staked: number | string;
}
export function useIBGT(props: any) {

  const router = useRouter();
  const { handleReport } = useClickTracking();
  const { provider, account } = useCustomAccount();
  const { addAction } = useAddAction("ibgt");
  const sender = account;

  const [data, setData] = useState<DataType>({
    count: 0,
    total: 0,
    staked: 0,
  })

  const queryData = async function () {
    const contract = new ethers.Contract(IBGT_ADDRESS, ABI, provider?.getSigner())
    try {
      const balanceOfResult = await contract?.balanceOf(account)
      const totalSupplyResult = await contract?.totalSupply()
      const stakedBalanceOfResult = await contract?.balanceOf("0x4B95296B937AF613D65206Ba7C203CB9A1263003")
      setData((prev: DataType) => {
        return {
          ...prev,
          count: ethers.utils.formatUnits(balanceOfResult),
          total: ethers.utils.formatUnits(totalSupplyResult),
          staked: ethers.utils.formatUnits(stakedBalanceOfResult)
        }
      })
    } catch (error) {
      console.log('===error', error)
    }

  }

  const { loading, dataList } = useInfraredList()
  const tokenData = useMemo(() => dataList?.find((d: any) => d.id === "iBGT-HONEY"), [dataList])
  const toast = useToast();
  const tabs = ["Stake", "Unstake"]
  const [tIndex, setTIndex] = useState(0)
  const [state, updateState] = useMultiState({
    balances: [],
    lpBalance: '',
    inAmount: '',
    lpAmount: '',
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
  const { tokens, decimals, id, LP_ADDRESS } = tokenData ?? {};
  const symbol = id;
  const isInSufficient = Number(inAmount) > Number(balances[symbol]);
  const isWithdrawInsufficient = Number(lpAmount) > Number(lpBalance);
  const balanceLp =
    !lpAmount || !lpBalance
      ? '-'
      : parseFloat(
        Big(lpAmount)
          .div(Big(lpBalance).gt(0) ? lpBalance : 1)
          .toFixed(4)
      );

  const {
    handleGetAmount
  } = useLpToAmount(data?.LP_ADDRESS)

  const updateLPBalance = () => {
    const abi = ['function balanceOf(address) view returns (uint256)'];
    const contract = new ethers.Contract(tokenData?.vaultAddress, abi, provider?.getSigner());
    contract.balanceOf(sender).then((balanceBig: any) => {
      const adjustedBalance = ethers.utils.formatUnits(balanceBig, 18);
      updateState({
        lpBalance: adjustedBalance
      });
    });
  };
  const updateBalance = () => {
    const abi = ['function balanceOf(address) view returns (uint256)'];
    const contract = new ethers.Contract(LP_ADDRESS, abi, provider?.getSigner());
    contract
      .balanceOf(sender)
      .then((balanceBig: any) => {
        const adjustedBalance = Big(ethers.utils.formatUnits(balanceBig)).toFixed();
        sourceBalances[symbol] = adjustedBalance;
        updateState({
          balances: sourceBalances
        });
      })
      .catch((error: Error) => {
        console.log('error: ', error);
        setTimeout(() => {
          updateBalance();
        }, 1500);
      });
  };
  const checkApproval = (amount: string) => {
    const wei: any = ethers.utils.parseUnits(Big(amount).toFixed(decimals), decimals);
    const abi = ['function allowance(address, address) external view returns (uint256)'];
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
    const abi = ['function approve(address, uint) public'];
    const contract = new ethers.Contract(LP_ADDRESS, abi, provider.getSigner());

    contract
      .approve(tokenData?.vaultAddress, wei)
      .then((tx: any) => tx.wait())
      .then((receipt: any) => {
        const payload = { isTokenApproved: true, isTokenApproving: false };
        updateState({ ...payload, isLoading: false, loadingMsg: '' });
        toast?.dismiss(toastId);
        toast?.success({
          title: 'Approve Successfully!',
          tx: receipt.transactionHash,
          chainId: props.chainId
        });
      })
      .catch((error: Error) => {
        console.log('error: ', error);
        updateState({
          isError: true,
          isLoading: false,
          loadingMsg: error?.message,
          isTokenApproving: false
        });
        toast?.dismiss(toastId);
        toast?.fail({
          title: 'Approve Failed!',
          text: error?.message?.includes('user rejected transaction') ? 'User rejected transaction' : null
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
      loadingMsg: 'Depositing...'
    });
    const wei = ethers.utils.parseUnits(Big(inAmount).toFixed(decimals), decimals);
    const abi = [
      {
        constant: false,
        inputs: [
          {
            name: 'amount',
            type: 'uint256'
          }
        ],
        name: 'stake',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      }
    ];
    const contract = new ethers.Contract(tokenData?.vaultAddress, abi, provider.getSigner());
    contract
      .stake(wei)
      .then((tx: any) => tx.wait())
      .then((receipt: any) => {
        const { status, transactionHash } = receipt;
        const [amount0, amount1] = handleGetAmount(inAmount)
        addAction?.({
          type: 'Staking',
          action: 'Staking',
          token: {
            symbol: tokens.join('-')
          },
          amount: inAmount,
          template: "Infrared",
          status: status,
          add: 1,
          transactionHash,
          chain_id: props.chainId,
          sub_type: "Stake",
        });
        updateState({
          isLoading: false,
          // isPostTx: true
        });
        setTimeout(() => {
          onSuccess?.()
        }, 3000)

        toast?.dismiss(toastId);
        toast?.success({
          title: 'Deposit Successfully!'
        });
      })
      .catch((error: Error) => {
        console.log('error: ', error);
        updateState({
          isError: true,
          isLoading: false,
          loadingMsg: error?.message
        });
        toast?.dismiss(toastId);
        toast?.fail({
          title: 'Deposit Failed!',
          text: error?.message?.includes('user rejected transaction')
            ? 'User rejected transaction'
            : (error?.message ?? '')
        });
      });
  };
  const handleWithdraw = () => {
    const toastId = toast?.loading({
      title: `Withdrawing...`
    });
    updateState({
      isLoading: true,
      isError: false,
      loadingMsg: 'Withdrawing...'
    });

    const lpWeiAmount = ethers.utils.parseUnits(Big(lpAmount).toFixed(18), 18);
    const abi = [
      {
        constant: false,
        inputs: [
          {
            name: '_shareAmt',
            type: 'uint256'
          }
        ],
        name: 'withdraw',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      }
    ];

    const contract = new ethers.Contract(tokenData?.vaultAddress, abi, provider.getSigner());
    contract
      .withdraw(lpWeiAmount)
      .then((tx: any) => tx.wait())
      .then((receipt: any) => {
        updateState({
          isLoading: false,
        });
        const { status, transactionHash } = receipt;
        const [amount0, amount1] = handleGetAmount(lpAmount)
        addAction?.({
          type: 'Staking',
          action: 'UnStake',
          token: {
            symbol: tokens.join('-')
          },
          symbol: tokens.join("-"),
          amount: lpAmount,
          template: "Infrared",
          status: status,
          add: 0,
          transactionHash,
          chain_id: props.chainId,
          sub_type: "Unstake",
        });

        setTimeout(() => {
          onSuccess?.()
        }, 3000)

        toast?.dismiss(toastId);
        toast?.success({
          title: 'Withdraw Successfully!'
        });
      })
      .catch((error: Error) => {
        console.log('===error', error)
        updateState({
          isError: true,
          isLoading: false,
          loadingMsg: error?.message
        });
        toast?.dismiss(toastId);
        toast?.fail({
          title: 'Withdraw Failed!',
          text: error?.message?.includes('user rejected transaction')
            ? 'User rejected transaction'
            : (error?.message ?? '')
        });
      });
  };

  const handleClaim = function () {

    const toastId = toast?.loading({
      title: `Claim...`
    });

    const abi = [{
      "constant": false,
      "inputs": [],
      "name": "getReward",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }]
    const contract = new ethers.Contract(tokenData?.vaultAddress, abi, provider.getSigner())
    contract
      .getReward()
      .then((tx: any) => tx.wait())
      .then((receipt: any) => {
        const { status, transactionHash } = receipt;
        addAction?.({
          type: 'Staking',
          action: 'Claim',
          token: {
            symbol: tokens.join('-')
          },
          amount: data?.earned,
          template: "Infrared",
          status: status,
          transactionHash,
          chain_id: props.chainId,
          sub_type: "Claim"
        });
        toast?.dismiss(toastId);
        toast?.success({
          title: 'Claim Successfully!'
        });
        setTimeout(() => {
          onSuccess?.()
        }, 3000)
      })
      .catch((error: Error) => {
        console.log('error: ', error);
        toast?.dismiss(toastId);
        toast?.fail({
          title: 'Claim Failed!',
          text: error?.message?.includes('user rejected transaction')
            ? 'User rejected transaction'
            : (error?.message ?? '')
        });
      });
  }
  const onSuccess = function () {
    updateState({
      updater: Date.now(),
      isTokenApproved: true,
      isTokenApproving: false
    })
    tIndex === 0 ? handleTokenChange("") : handleLPChange("")
  }

  const handleMintIBGT = () => {
    router.push("/dex/bex?lp=");
    handleReport('1010-005-001');
  };

  useEffect(() => {
    if (!sender || !tokenData?.vaultAddress) return;
    updateBalance();
    updateLPBalance();
  }, [sender, tokenData?.vaultAddress, updater]);

  useEffect(() => {
    provider && account && queryData()
  }, [provider, account])

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
    handleMintIBGT,
  }
}

interface Props {
  query(): any;
}
