import { useState, useEffect, useCallback } from "react";
import Big from "big.js";
import { ethers } from "ethers";
import useAddAction from "@/hooks/use-add-action";
import { isValid } from "@/utils/utils";

interface TokenInfo {
  symbol: string;
  balance: string;
  supplyAPY: string;
  decimals: number;
  underlyingAsset: string;
  name: string;
  underlyingBalance: string;
  aTokenAddress: string;
  variableDebtTokenAddress: string;
}

interface UseAaveActionsProps {
  token: TokenInfo;
  isBorrow: boolean;
  provider: ethers.providers.Web3Provider;
  chainId: number;
  account: string;
  config: any;
  triggerUpdate: () => void;
}

export const useBorwAndRepay = ({
  token,
  isBorrow,
  provider,
  chainId,
  account,
  config,
  triggerUpdate,
}: UseAaveActionsProps) => {
  const { addAction } = useAddAction("lending");

  const {
    symbol,
    decimals,
    underlyingAsset,
    name,
    aTokenAddress,
    variableDebtTokenAddress,
  } = token;
  
  const [needApprove, setNeedApprove] = useState<boolean>(false);
  const [allowanceAmount, setAllowanceAmount] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [approving, setApproving] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const update = useCallback(() => {
    if (symbol === config.nativeCurrency.symbol) {
      setNeedApprove(false);
      return;
    }

    if (
      !isValid(amount) ||
      !isValid(allowanceAmount) ||
      Number(allowanceAmount) < Number(amount) ||
      Number(amount) === 0
    ) {
      setNeedApprove(true);
    } else {
      setNeedApprove(false);
    }
  }, [symbol, config.nativeCurrency.symbol, allowanceAmount, amount, isBorrow]);

  const getAllowance = useCallback(async () => {
    try {
      const signer = provider.getSigner();
  
      const address = isBorrow ? aTokenAddress : underlyingAsset;
      const abi = isBorrow ? config.variableDebtTokenABI : config.erc20Abi;
      const contract = new ethers.Contract(address, abi, signer);

      const allowanceAddr = isBorrow
        ? config.wrappedTokenGatewayV3Address
        : config.aavePoolV3Address;
  
      const allowanceAmount: ethers.BigNumber = await contract.allowance(account, allowanceAddr);
  
      setAllowanceAmount(
        Big(allowanceAmount.toString()).div(Big(10).pow(decimals)).toFixed()
      );
    } catch (err) {
      console.error(err, "getAllowance---err");
    }
  }, [provider, isBorrow, underlyingAsset, aTokenAddress, config, decimals]);
  
  const formatAddAction = useCallback(
    (_amount: string, status: number, transactionHash: string) => {
      addAction?.({
        type: "Lending",
        action: isBorrow ? "Borrow" : "Repay",
        token: {
          symbol,
        },
        amount: _amount,
        template: config.name,
        add: false,
        status,
        transactionHash,
      });
    },
    [addAction, symbol, config.name]
  );

  function approveDelegation(vwETHAddress: string) {
    const vToken = new ethers.Contract(
      vwETHAddress,
      config.variableDebtTokenABI,
      provider.getSigner()
    );
    const maxUint256 = ethers.BigNumber.from(
      "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
    );
    return vToken.approveDelegation(
      config.wrappedTokenGatewayV3Address,
      maxUint256
    );
  }

  const handleApprove = useCallback(
    () => {
      if (isBorrow) {
        setApproving(true);
        return approveDelegation(variableDebtTokenAddress)
          .then((tx: ethers.ContractTransaction) => {
            return tx.wait().then((res: ethers.ContractReceipt) => {
              const { status } = res;
              if (status === 1) {
                console.log("tx succeeded", res);
                setNeedApprove(false);
              } else {
                console.log("tx failed", res);
              }
            }).finally(() => {
              setApproving(false);
            })
          })
          .catch((err: any) => {
            setApproving(false);
            console.log("approveDelegation-err", err);
          })
      }

      const token = new ethers.Contract(
        underlyingAsset,
        config.erc20Abi,
        provider.getSigner()
      );

      const approveAmount = Big(amount).mul(Big(10).pow(decimals)).toFixed(0);
      setApproving(true)
      return token["approve(address,uint256)"](
        config.aavePoolV3Address,
        approveAmount
      ).then((tx: ethers.ContractTransaction) => {
        return tx.wait().then((res: ethers.ContractReceipt) => {
          const { status } = res;
          if (status === 1) {
            console.log("tx succeeded", res);
            setNeedApprove(false);
          } else {
            console.log("tx failed", res);
          }
        })
        .finally(() => {
          setApproving(false);
        })
      }).catch((err: any) => {
        setApproving(false);
        console.log("approve-err", err);
      })
    },
    [
      isBorrow,
      underlyingAsset,
      variableDebtTokenAddress,
      config,
      provider,
      decimals,
      amount,
    ]
  );

  function borrowETH(amount: string) {
    setLoading(true);
    const wrappedTokenGateway = new ethers.Contract(
      config.wrappedTokenGatewayV3Address,
      config.wrappedTokenGatewayV3ABI,
      provider.getSigner()
    );
    return wrappedTokenGateway
      .borrowETH(
        config.aavePoolV3Address,
        amount,
        2, // variable interest rate
        0
      )
      .then((tx: any) => {
        tx.wait().then((res: any) => {
          const { status, transactionHash } = res;
          if (status === 1) {
            formatAddAction(
              Big(amount).div(Big(10).pow(decimals)).toFixed(8),
              status,
              transactionHash
            );
            triggerUpdate();
            setAmount("");
          } else {
            console.log("tx failed", res);
          }
        }).finally(() => {
          setLoading(false);
        })
      })
      .catch((err: any) => {
        setLoading(false);
        console.log(err, "err");
      })
  }

  function borrowERC20(amount: string) {
    setLoading(true);
    const pool = new ethers.Contract(
      config.aavePoolV3Address,
      config.aavePoolV3ABI,
      provider.getSigner()
    );
    provider
      .getSigner()
      .getAddress()
      .then((address: any) => {
        return pool["borrow(address,uint256,uint256,uint16,address)"](
          underlyingAsset,
          amount,
          2, // variable interest rate
          0,
          address
        );
      })
      .then((tx: any) => {
        tx.wait().then((res: any) => {
          const { status, transactionHash } = res;
          if (status === 1) {
            formatAddAction(
              Big(amount).div(Big(10).pow(decimals)).toFixed(8),
              status,
              transactionHash
            );
            triggerUpdate();
            setAmount("");
            console.log("tx succeeded", res);
          } else {
            console.log("tx failed", res);
          }
        }).finally(() => {
          setLoading(false);
        })
      })
      .catch((err: any) => {
        console.log("borrowERC20-err", err);
      });
  }
  function repayFromApproval(amount: any) {
    const tokenAddress = underlyingAsset;
    const pool = new ethers.Contract(
      config.aavePoolV3Address,
      config.aavePoolV3ABI,
      provider.getSigner()
    );

    return provider
      .getSigner()
      .getAddress()
      .then((userAddress: any) => {
        return pool["repay(address,uint256,uint256,address)"](
          tokenAddress,
          amount,
          2, // variable interest rate
          userAddress
        );
      });
  }

  function repayETH(amount: any) {
    setLoading(true);
    const wrappedTokenGateway = new ethers.Contract(
      config.wrappedTokenGatewayV3Address,
      config.wrappedTokenGatewayV3ABI,
      provider.getSigner()
    );

    provider
      .getSigner()
      .getAddress()
      .then((address: any) => {
        wrappedTokenGateway
          .repayETH(
            config.aavePoolV3Address,
            amount,
            2, // variable interest rate
            address,
            {
              value: amount,
            }
          )
          .then((tx: any) => {
            tx.wait().then((res: any) => {
              const { status, transactionHash } = res;
              if (status === 1) {
                formatAddAction(
                  Big(amount).div(Big(10).pow(decimals)).toFixed(8),
                  status,
                  transactionHash
                )
              } else {
                console.log("tx failed", res);
              }
            })
            .finally(() => {
              setLoading(false);
            })
          })
          .catch((err: any) => {
            setLoading(false);
            console.log(err, "err");
          });
      })
  }

  /**
   *
   * @param {*} rawSig signature from signERC20Approval
   * @param {string} address user address
   * @param {string} asset asset address (e.g. USDT)
   * @param {string} amount repay amount in full decimals
   * @param {number} deadline UNIX timestamp in SECONDS
   * @returns
   */
  function repayERC20(amount: any) {
    setLoading(true)
    return repayFromApproval(amount).then((tx: any) => {
      tx.wait().then((res: any) => {
        const { status, transactionHash } = res;
        if (status === 1) {
          formatAddAction(
            Big(amount).div(Big(10).pow(decimals)).toFixed(8),
            status,
            transactionHash
          );
          triggerUpdate();
          setAmount("");
        } else {
          console.log("tx failed", res);
        }
      }).finally(() => {
        setLoading(false);
      })
    })
    .catch((err: any) => {
      setLoading(false);
      console.log("repayERC20-err", err);
    });
  }

  useEffect(() => {
    getAllowance();
    update();
  }, [getAllowance, update, isBorrow, amount]);

  return {
    getAllowance,
    formatAddAction,
    handleApprove,
    needApprove,
    setAmount,
    amount,
    borrowETH,
    borrowERC20,
    repayETH,
    repayERC20,
    approving,
    loading,
  };
};
