import { useState, useEffect, useCallback } from "react";
import Big from "big.js";
import { ethers } from "ethers";
import useAddAction from "@/hooks/use-add-action";
import { isValid } from "@/utils/utils";
import useAccount from "@/hooks/use-account";
import useToast from "@/hooks/use-toast";

interface TokenInfo {
  symbol: string;
  balance: string;
  supplyAPY: string;
  decimals: number;
  underlyingAsset: string;
  name: string;
  underlyingBalance: string;
  aTokenAddress: string;
}

interface UseAaveActionsProps {
  token: TokenInfo | undefined;
  isDeposit: boolean;
  config: any;
  triggerUpdate: () => void;
}

export const useDepositAndWithdraw = ({
  token,
  isDeposit,
  config,
  triggerUpdate,
}: UseAaveActionsProps) => {
  const { addAction } = useAddAction("lending");
  const { provider, account } = useAccount();
  const toast = useToast();
  const {
    symbol,
    balance,
    supplyAPY,
    decimals,
    underlyingAsset,
    name,
    underlyingBalance,
    aTokenAddress,
  } = token || {};

  const [needApprove, setNeedApprove] = useState<boolean>(false);
  const [allowanceAmount, setAllowanceAmount] = useState<string>("");
  const [amount, setAmount] = useState<any>("");
  const [approving, setApproving] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const update = useCallback(() => {
    if (symbol === config.nativeCurrency.symbol) {
      setNeedApprove(false);
      return;
    }
    if (amount === "" || !isValid(amount)) return;

    if (isDeposit && Number(allowanceAmount) < Number(amount)) {
      setNeedApprove(true);
    } else {
      setNeedApprove(false);
    }
  }, [
    symbol,
    config.nativeCurrency.symbol,
    allowanceAmount,
    amount,
    isDeposit,
  ]);

  const getAllowance = useCallback(() => {
    return provider
      .getSigner()
      .getAddress()
      .then(async (userAddress: string) => {
        const address = isDeposit ? underlyingAsset : aTokenAddress;
        if (!address) return;
        const token = new ethers.Contract(
          address,
          config.erc20Abi,
          provider.getSigner()
        );
        const allowanceAddr = isDeposit
          ? config.aavePoolV3Address
          : config.wrappedTokenGatewayV3Address;
        token
          .allowance(userAddress, allowanceAddr)
          .then((allowanceAmount: ethers.BigNumber) =>
            allowanceAmount.toString()
          )
          .then((allowanceAmount: string) => {
            setAllowanceAmount(
              Big(allowanceAmount)
                .div(Big(10).pow(decimals || 18))
                .toFixed()
            );
          })
          .catch((err: any) => {
            console.log(err, "getAllowance---err");
          });
      });
  }, [provider, isDeposit, underlyingAsset, aTokenAddress, config, decimals]);

  const formatAddAction = useCallback(
    (_amount: string, status: number, transactionHash: string) => {
      addAction?.({
        type: "Lending",
        action: isDeposit ? "Supply" : "Withdraw",
        token: {
          symbol,
        },
        amount: _amount,
        template: 'Bend',
        add: false,
        status,
        transactionHash
      });
    },
    [addAction, symbol, config.name]
  );

  const handleApprove = useCallback(
    (amount: string) => {
      const address = isDeposit ? underlyingAsset : aTokenAddress;
      if (!address) return;
      const token = new ethers.Contract(
        address,
        config.erc20Abi,
        provider.getSigner()
      );

      const approveAmount = Big(amount)
        .mul(Big(10).pow(decimals || 18))
        .toFixed(0);

      const addr = isDeposit
        ? config.aavePoolV3Address
        : config.wrappedTokenGatewayV3Address;

      return token["approve(address,uint256)"](addr, approveAmount).then(
        (tx: ethers.ContractTransaction) => {
          setApproving(true);
          return tx
            .wait()
            .then((res: ethers.ContractReceipt) => {
              const { status } = res;
              if (status === 1) {
                setNeedApprove(false);
              } else {
                console.log("tx failed", res);
              }
            })
            .catch((err: any) => {
              console.log("handleApprove: --tx.wait on error", err);
            })
            .finally(() => {
              setApproving(false);
            });
        }
      );
    },
    [
      isDeposit,
      underlyingAsset,
      aTokenAddress,
      config,
      provider,
      decimals,
      amount,
    ]
  );

  const depositETH = useCallback(
    (amount: string) => {
      return provider
        .getSigner()
        .getAddress()
        .then((address: string) => {
          const wrappedTokenGateway = new ethers.Contract(
            config.wrappedTokenGatewayV3Address,
            config.wrappedTokenGatewayV3ABI,
            provider.getSigner()
          );
          return wrappedTokenGateway.depositETH(
            config.aavePoolV3Address,
            address,
            0,
            {
              value: amount,
              gasLimit: 90000000,
            }
          );
        })
        .then((tx: ethers.ContractTransaction) => {
          return tx.wait().then((res: ethers.ContractReceipt) => {
            const { status, transactionHash } = res;
            if (status === 1) {
              formatAddAction(
                Big(amount)
                  .div(Big(10).pow(decimals || 18))
                  .toFixed(8),
                status,
                transactionHash
              );
              triggerUpdate();
            } else {
              console.log("tx failed", res);
            }
          });
        })
        .catch((err: any) => {
          console.log(err, "<==Supply===depositETH");
        });
    },
    [provider, config, decimals, formatAddAction, triggerUpdate]
  );

  function depositFromApproval(amount: any) {
    const tokenAddress = underlyingAsset;
    const pool = new ethers.Contract(
      config.aavePoolV3Address,
      [
        {
          inputs: [
            { internalType: "address", name: "asset", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
            { internalType: "address", name: "onBehalfOf", type: "address" },
            { internalType: "uint16", name: "referralCode", type: "uint16" },
          ],
          name: "supply",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      provider.getSigner()
    );

    return provider
      .getSigner()
      .getAddress()
      .then((userAddress: any) => {
        return pool["supply(address,uint256,address,uint16)"](
          tokenAddress,
          amount,
          userAddress,
          0
        );
      });
  }

  const depositErc20 = useCallback(
    (amount: string) => {
      setLoading(true);
      depositFromApproval(amount)
        .then((tx: any) => {
          tx.wait()
            .then((res: any) => {
              const { status, transactionHash } = res;
              if (status === 1) {
                formatAddAction(
                  Big(amount)
                    .div(Big(10).pow(decimals || 18))
                    .toFixed(8),
                  status,
                  transactionHash
                );
                triggerUpdate();
                setAmount("");
              } else {
                console.log("tx failed", res);
              }
            })
            .catch((err: any) => {
              console.log("tx.wait on error depositErc20", err);
            })
            .finally(() => {
              setLoading(false);
            });
        })
        .catch((err: any) => {
          setLoading(false);
          console.log("err depositFromApproval", err);
        });
    },
    [account, token, config, provider, formatAddAction, triggerUpdate]
  );

  const withdrawETH = useCallback(
    (amount: string) => {
      return provider
        .getSigner()
        .getAddress()
        .then((address: string) => {
          const wrappedTokenGateway = new ethers.Contract(
            config.wrappedTokenGatewayV3Address,
            config.wrappedTokenGatewayV3ABI,
            provider.getSigner()
          );
          return wrappedTokenGateway.withdrawETH(
            config.aavePoolV3Address,
            amount,
            address
          );
        })
        .then((tx: ethers.ContractTransaction) => {
          return tx.wait().then((res: ethers.ContractReceipt) => {
            const { status, transactionHash } = res;
            if (status === 1) {
              formatAddAction(amount, status, transactionHash);
            } else {
              console.log("tx failed", res);
            }
          });
        })
        .catch((err: any) => {
          console.log("wrappedTokenGateway.withdrawETH on error", err);
        });
    },
    [provider, config, formatAddAction]
  );

  const withdrawErc20 = useCallback(
    (amount: string) => {
      setLoading(true);
      return provider
        .getSigner()
        .getAddress()
        .then((address: string) => {
          const pool = new ethers.Contract(
            config.aavePoolV3Address,
            config.aavePoolV3ABI,
            provider.getSigner()
          );

          return pool["withdraw(address,uint256,address)"](
            underlyingAsset,
            amount,
            address
          );
        })
        .then((tx: ethers.ContractTransaction) => {
          return tx
            .wait()
            .then((res: ethers.ContractReceipt) => {
              const { status, transactionHash } = res;
              if (status === 1) {
                formatAddAction(amount, status, transactionHash);
                triggerUpdate();
                setAmount("");
              } else {
                console.log("tx failed", res);
              }
            })
            .finally(() => {
              setLoading(false);
            });
        })
        .catch((err: any) => {
          setLoading(false);
          console.log("withdraw(address,uint256,address) on error", err);
        });
    },
    [provider, config, decimals, underlyingAsset, formatAddAction]
  );

  useEffect(() => {
    getAllowance();
    update();
  }, [getAllowance, update, isDeposit, token]);

  return {
    getAllowance,
    formatAddAction,
    handleApprove,
    depositETH,
    depositErc20,
    withdrawETH,
    withdrawErc20,
    needApprove,
    setAmount,
    amount,
    approving,
    loading,
    setLoading,
  };
};
