import { rewardToken } from "@/configs/lending/bend";
import useAddAction from "@/hooks/use-add-action";
import useToast from "@/hooks/use-toast";
import { ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";

const vaultAddress = "0x2E8410239bB4b099EE2d5683e3EF9d6f04E321CC";


const useBendReward = ({ provider, account, onClaimSuccess }: any) => {
  const [claiming, setClaiming] = useState(false);
  const [reward, setReward] = useState<any>(0);
  const [debtVal, setDebtVal] = useState<any>();
  const toast = useToast();
  const { addAction } = useAddAction("bgt");
  
  const getBendRewards = () => {
    const rewardsProvider = new ethers.Contract(
      vaultAddress,
      [
        {
          type: "function",
          name: "earned",
          inputs: [
            {
              name: "account",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
      ],
      provider.getSigner()
    );
    rewardsProvider
      .earned(account)
      .then((res: any) => {
        setReward(ethers.utils.formatUnits(res.toString(), 18));
      })
      .catch((err: any) => {
        console.log("getAllUserRewards_error:", err);
      });
  };

  const claim = () => {
    const toastId = toast?.loading({
      title: `Claim...`
    });
    const claimProvider = new ethers.Contract(
      vaultAddress,
      [
        {
          type: "function",
          name: "getReward",
          inputs: [
            {
              name: "account",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "nonpayable",
        },
      ],
      provider.getSigner()
    );
    setClaiming(true);
    claimProvider
      .getReward(account)
      .then((tx: any) => {
        tx.wait().then((res: any) => {
          const { status, transactionHash } = res;
          onClaimSuccess?.(res);
          getBendRewards();
          toast?.success({
            title: 'Claim Successfully!'
          });

          addAction?.({
            type: "Lending",
            action: "Claim",
            token: {
              symbol: "VDHONEY",
            },
            amount: reward,
            template: 'Bend',
            add: false,
            status,
            transactionHash,
          });

        }).finally(() => {
          toast?.dismiss(toastId);
          setClaiming(false);
        })
      })
      .catch((err: any) => {
        console.log("claimAllRewards_error:", err);
        toast?.dismiss(toastId);
        setClaiming(false);
      })
  };

  const getVariableDebtBalanceOf = async () => {
    const contract = new ethers.Contract(
      "0x0bF0Eb9aE016A624E2149D4C5F47fD9276285C82",
      [
        {
          type: "function",
          name: "balanceOf",
          inputs: [
            {
              name: "account",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
      ],
      provider.getSigner()
    );
    const res = await contract.balanceOf(account);
    setDebtVal(ethers.utils.formatUnits(res.toString(), 18));
  };

  useEffect(() => {
    if (!provider || !account) return;
    getBendRewards();
    getVariableDebtBalanceOf();
  }, [provider, account]);

  return {
    ...rewardToken[0],
    claim,
    claiming,
    vaultToken: 'VDHONEY',
    icon: '/images/dapps/honey.png',
    platform: 'bend',
    depositAmount: debtVal,
    rewardValue: parseFloat(reward) === 0 ? '0' : (parseFloat(reward) < 0.01 ? '<0.01' : parseFloat(reward).toFixed(2)),
    rewardValueNumber: reward,
  };
};

export default useBendReward;
