import { useState } from "react";
import useToast from "@/hooks/use-toast";
import useCustomAccount from "@/hooks/use-account";
import useAddAction from "@/hooks/use-add-action";
import { ethers } from "ethers";
import Big from "big.js";
import { DEFAULT_CHAIN_ID } from "@/configs";

export default function useInfrared({
  amount,
  decimals,
  vaultAddress,
  tokens,
  type,
  onSuccess,
  isBERPS,
  data
}: any) {
  const [loading, setLoading] = useState(false);
  const { account, provider } = useCustomAccount();
  const toast = useToast();
  const { addAction } = useAddAction("dapp");

  const onHandle = async () => {
    let toastId = toast?.loading({
      title: type ? "Unstaking..." : `Staking...`
    });
    setLoading(true);
    try {
      const wei = ethers.utils.parseUnits(
        Big(amount).toFixed(decimals),
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
        },
        {
          constant: false,
          inputs: [
            {
              name: "assets",
              type: "uint256"
            },
            {
              name: "receiver",
              type: "address"
            }
          ],
          name: "deposit",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function"
        },
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
        },
        {
          constant: false,
          inputs: [
            {
              name: "shares",
              type: "uint256"
            }
          ],
          name: "makeWithdrawRequest",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function"
        },
        {
          constant: false,
          inputs: [
            {
              name: "shares",
              type: "uint256"
            },
            {
              name: "receiver",
              type: "address"
            },
            {
              name: "owner",
              type: "address"
            }
          ],
          name: "redeem",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function"
        },
        {
          constant: false,
          inputs: [
            {
              name: "shares",
              type: "uint256"
            },
            {
              name: "unlockEpoch",
              type: "uint256"
            }
          ],
          name: "cancelWithdrawRequest",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function"
        },
        {
          inputs: [],
          name: "stakingToken",
          outputs: [
            { internalType: "contract ERC20", name: "", type: "address" }
          ],
          stateMutability: "view",
          type: "function"
        }
      ];
      const contract = new ethers.Contract(
        vaultAddress,
        abi,
        provider?.getSigner()
      );
      const stakeMethod = isBERPS ? "deposit" : "stake";
      const unStakeMethod = isBERPS ? "makeWithdrawRequest" : "withdraw";
      const params: any = [wei];
      if (isBERPS && !type) {
        params.push(account);
      }
      const tx = await contract[type ? unStakeMethod : stakeMethod](...params);
      const { status, transactionHash } = await tx.wait();
      const stakeTokenAddress = await contract.stakingToken();
      addAction?.({
        type: "Staking",
        action: type ? "UnStake" : "Staking",
        tokens: stakeTokenAddress
          ? [{ address: stakeTokenAddress, symbol: data?.poolName }]
          : [],
        amount: amount,
        template: "Infrared",
        status: status,
        add: 1,
        transactionHash,
        chain_id: DEFAULT_CHAIN_ID,
        sub_type: type ? "UnStake" : "Stake",
        amounts: [amount],
        extra_data: {}
      });

      setTimeout(() => {
        onSuccess?.();
      }, 3000);

      toast?.dismiss(toastId);
      toast?.success({
        title: type ? "Unstake Successful!" : "Stake Successful!"
      });
    } catch (err: any) {
      toast?.dismiss(toastId);
      toast?.fail({
        title: type ? "Unstake Failed!" : "Stake Failed!",
        text: err?.message?.includes("user rejected transaction")
          ? "User rejected transaction"
          : err?.message ?? ""
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, onHandle };
}
