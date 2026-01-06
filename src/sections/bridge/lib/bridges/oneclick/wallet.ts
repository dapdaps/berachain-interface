import useCustomAccount from "@/hooks/use-account";
import { ZeroAddress } from "@/hooks/use-add-action";
import { usePriceStore } from "@/stores/usePriceStore";
import { getPrice } from "@/utils/formatMoney";
import { numberRemoveEndZero } from "@/utils/number-formatter";
import Big from "big.js";
import { Contract } from "ethers";
import { parseEther } from "ethers/lib/utils";

export function useOneclickWallet(props?: any) {
  const { } = props ?? {};

  const prices = usePriceStore((store) => store.price);
  const { account, provider } = useCustomAccount();

  const estimateTransferGas = async (params: {
    originAsset: string;
    depositAddress: string;
    amount: string;
  }): Promise<{
    gasLimit: bigint;
    gasPrice: bigint;
    estimateGas: bigint;
  }> => {
    const { originAsset, depositAddress, amount } = params;

    if (!provider) {
      throw new Error("Provider not available");
    }

    const fromAddress = await provider.getAddress();

    let gasLimit: bigint;

    if (originAsset === ZeroAddress) {
      // Estimate gas for ETH transfer
      const tx = {
        from: fromAddress,
        to: depositAddress,
        value: parseEther(amount)
      };
      gasLimit = await provider.estimateGas(tx);
    } else {
      // Estimate gas for ERC20 token transfer
      const contract = new Contract(originAsset, ERC20Abi, provider);
      gasLimit = await contract.transfer.estimateGas(depositAddress, amount);
    }

    // Increase gas limit by 20% to provide buffer
    gasLimit = (gasLimit * BigInt(120)) / BigInt(100);

    // Get gas price
    const feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice || BigInt(0);

    // Calculate estimated gas cost: gasLimit * gasPrice
    const estimateGas = gasLimit * gasPrice;

    return {
      gasLimit,
      gasPrice,
      estimateGas
    };
  };

  const getEstimateGas = async (params: any) => {
    const { gasLimit, price, nativeToken } = params;

    const feeData = await provider.getFeeData();
    const gasPrice = feeData.maxFeePerGas || feeData.gasPrice || BigInt("20000000000"); // Default 20 gwei

    const estimateGas = BigInt(gasLimit) * BigInt(gasPrice);
    const estimateGasAmount = Big(estimateGas.toString()).div(10 ** nativeToken.decimals);
    const estimateGasUsd = Big(estimateGasAmount).times(price || 1);

    return {
      gasPrice,
      usd: numberRemoveEndZero(Big(estimateGasUsd).toFixed(20)),
      wei: estimateGas,
      amount: numberRemoveEndZero(Big(estimateGasAmount).toFixed(nativeToken.decimals)),
    };
  };

  const sendTransaction = async (params: any) => {
    const {
      method,
      contract,
      param,
    } = params;

    const tx = await contract[method](...param);
    const txHash = tx.hash || tx;

    const receipt = await contract.provider.waitForTransaction(txHash);
    if (receipt.status !== 1) {
      throw new Error("Transaction failed");
    }
    return receipt.transactionHash;
  };

  const transfer = async (params: {
    originAsset: string;
    depositAddress: string;
    amount: string;
  }) => {
    const { originAsset, depositAddress, amount } = params;

    const signer = await provider.getSigner();

    if (originAsset === ZeroAddress) {
      const tx = await signer.sendTransaction({
        to: depositAddress,
        value: amount
      });
      const txHash = tx.hash || tx;
      const receipt = await provider.waitForTransaction(txHash);
      if (receipt.status !== 1) {
        throw new Error("Transaction failed");
      }
      return receipt.transactionHash;
    }

    const contract = new Contract(originAsset, ERC20Abi, signer);

    const tx = await contract.transfer(depositAddress, amount);
    const txHash = tx.hash || tx;
    const receipt = await provider.waitForTransaction(txHash);
    if (receipt.status !== 1) {
      throw new Error("Transaction failed");
    }
    return receipt.transactionHash;
  };

  const allowance = async (params: any) => {
    const {
      contractAddress,
      spender,
      address,
      amountWei,
    } = params;

    const signer = await provider.getSigner();
    const contract = new Contract(contractAddress, ERC20Abi, signer);

    // get allowance
    let allowance = "0";
    try {
      allowance = await contract.allowance(address, spender);
      allowance = allowance.toString();
    } catch (error) {
      console.log("Error getting allowance: %o", error)
    }

    return {
      contract,
      allowance,
      needApprove: Big(amountWei || 0).gt(allowance || 0),
    };
  }

  const approve = async (params: any) => {
    const {
      contractAddress,
      spender,
      amountWei,
      isApproveMax = false,
      isCheckAllowance = false,
    } = params;

    const signer = await provider.getSigner();
    const contract = new Contract(contractAddress, ERC20Abi, signer);

    let _amountWei = amountWei;
    if (isApproveMax) {
      _amountWei = MaxUint256;
    }

    try {
      const tx = await contract.approve(spender, _amountWei);
      const txHash = tx.hash || tx;
      const receipt = await provider.waitForTransaction(txHash);
      if (receipt.status === 1) {
        if (isCheckAllowance) {
          const _allowance = await allowance({
            contractAddress,
            spender,
            address: account,
            amountWei,
          });
          return !_allowance.needApprove;
        }
        return true;
      }
      return false;
    } catch (error) {
      console.log("Error approve: %o", error)
    }

    return false;
  }

  const quoteOneClickProxy = async (params: any) => {
    const {
      proxyAddress,
      abi,
      fromToken,
      refundTo,
      recipient,
      depositAddress,
      amountWei,
    } = params;

    const result: any = { fees: {} };

    if (fromToken.contractAddress !== ZeroAddress) {
      try {
        const _allowance = await allowance({
          contractAddress: fromToken.contractAddress,
          address: refundTo,
          spender: proxyAddress,
          amountWei: amountWei,
        });
        result.needApprove = _allowance.needApprove;
        result.approveSpender = proxyAddress;
      } catch (error) {
        console.log("oneclick check allowance failed: %o", error);
      }
    }

    const signer = await provider.getSigner();
    const proxyContract = new Contract(proxyAddress, abi, signer);
    const proxyParam: any = [
      // tokenAddress
      fromToken.contractAddress,
      // recipient
      depositAddress || recipient,
      // amount
      amountWei,
    ];
    result.sendParam = {
      method: "proxyTransfer",
      contract: proxyContract,
      param: proxyParam,
    };

    try {
      const gasLimit = await proxyContract.proxyTransfer.estimateGas(...proxyParam);
      const { usd, wei } = await getEstimateGas({
        gasLimit,
        price: getPrice(prices, fromToken.nativeToken.symbol),
        nativeToken: fromToken.nativeToken,
      });
      result.fees.sourceGasFeeUsd = numberRemoveEndZero(Big(usd).toFixed(20));
      result.estimateSourceGas = wei;
      result.estimateSourceGasUsd = numberRemoveEndZero(Big(usd).toFixed(20));
    } catch (error) {
      const { usd, wei } = await getEstimateGas({
        gasLimit: DEFAULT_GAS_LIMIT,
        price: getPrice(prices, fromToken.nativeToken.symbol),
        nativeToken: fromToken.nativeToken,
      });
      result.fees.sourceGasFeeUsd = numberRemoveEndZero(Big(usd).toFixed(20));
      result.estimateSourceGas = wei;
      result.estimateSourceGasUsd = numberRemoveEndZero(Big(usd).toFixed(20));
    }

    return result;
  };

  return {
    account,
    provider,
    prices,
    estimateTransferGas,
    getEstimateGas,
    sendTransaction,
    transfer,
    allowance,
    approve,
    quoteOneClickProxy,
  };
}

export const DEFAULT_GAS_LIMIT = BigInt(100000);

export const MaxUint256: bigint = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");

const ERC20Abi = [
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" }
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" }
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" }
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  }
];
