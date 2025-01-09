import useCustomAccount from "@/hooks/use-account";
import useAddAction from "@/hooks/use-add-action";
import useToast from "@/hooks/use-toast";
import Big from "big.js";
import { ethers } from "ethers";
import { useEffect, useState } from "react";


export const ERC20_ABI = [{
  constant: true,
  inputs: [
    {
      name: '_owner',
      type: 'address'
    }
  ],
  name: 'balanceOf',
  outputs: [
    {
      name: 'balance',
      type: 'uint256'
    }
  ],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}]

const STAKE_ABI = [{
  "inputs": [
    {
      "internalType": "address",
      "name": "_token",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "_amount",
      "type": "uint256"
    }
  ],
  "name": "mint",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}]
export default function useBedrock(dexConfig) {

  const { addAction } = useAddAction("dapp")
  const {
    STAKE_ADDRESS,
    sourceToken,
    targetToken,
  } = dexConfig
  const {
    provider,
    account,
    chainId
  } = useCustomAccount()
  const toast = useToast()
  const [balance, setBalance] = useState(0)
  const [inAmount, setInAmount] = useState("")

  async function getBalance() {
    const contract = new ethers.Contract(sourceToken?.address, ERC20_ABI, provider)
    try {
      const result = await contract.balanceOf(account)
      setBalance(ethers.utils.formatUnits(result, sourceToken?.decimals))
    } catch (error) {
      console.log(error)
    }
  }
  function handleMax() {
    setInAmount(balance)
  }
  function handleAmountChange(amount) {
    setInAmount(amount)
  }

  function handleDeposit(updateState) {
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
      Big(inAmount).toFixed(sourceToken?.decimals),
      sourceToken?.decimals
    );
    const contract = new ethers.Contract(
      STAKE_ADDRESS,
      STAKE_ABI,
      provider?.getSigner()
    );
    const stakeMethod = "mint"
    const params: any = ["0x2577D24a26f8FA19c1058a8b0106E2c7303454a4", wei];

    const createTx = (gasLimit: any) => {
      contract[stakeMethod](...params, { gasLimit })
        .then((tx: any) => tx.wait())
        .then((receipt: any) => {
          const { status, transactionHash } = receipt;
          addAction?.({
            type: "Staking",
            action: "Staking",
            token: {
              symbol: sourceToken?.symbol
            },
            amount: inAmount,
            template: "Bedrock",
            status: status,
            add: 1,
            transactionHash,
            chain_id: chainId,
            sub_type: "Stake",
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
  }
  function onSuccess() {
    setInAmount("")
    getBalance()
  }

  function handleCopy(address) {
    navigator.clipboard.writeText(address as string);
    toast.success({
      title: `Copied address ${address}`,
    });
  };
  useEffect(() => {
    if (account && provider) {
      getBalance()
    }
  }, [account, provider])

  return {
    balance,
    inAmount,
    handleMax,
    handleAmountChange,
    handleDeposit,
    handleCopy
    // setInAmount
  }
}
