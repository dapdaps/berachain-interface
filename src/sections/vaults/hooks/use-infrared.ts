import { useState } from 'react';
import useToast from '@/hooks/use-toast';
import useCustomAccount from '@/hooks/use-account';
import useAddAction from '@/hooks/use-add-action';
import { ethers } from 'ethers';
import Big from 'big.js';
import { DEFAULT_CHAIN_ID } from '@/configs';

export default function useInfrared({
  amount,
  decimals,
  vaultAddress,
  tokens,
  type,
  onSuccess
}: any) {
  const [loading, setLoading] = useState(false);
  const { provider } = useCustomAccount();
  const toast = useToast();
  const { addAction } = useAddAction('dapp');

  const onHandle = async () => {
    let toastId = toast?.loading({
      title: type ? 'Unstaking...' : `Staking...`
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
              name: 'amount',
              type: 'uint256'
            }
          ],
          name: 'stake',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
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
      const contract = new ethers.Contract(
        vaultAddress,
        abi,
        provider?.getSigner()
      );
      const tx = await contract[type ? 'withdraw' : 'stake'](wei);
      const { status, transactionHash } = await tx.wait();

      addAction?.({
        type: 'Liquidity',
        action: type ? 'Withdraw' : 'Deposit',
        token0: tokens[0],
        token1: tokens[1],
        amount: amount,
        template: 'Infrared',
        status: status,
        add: 1,
        transactionHash,
        chain_id: DEFAULT_CHAIN_ID,
        sub_type: 'Add'
      });

      setTimeout(() => {
        onSuccess?.();
      }, 3000);

      toast?.dismiss(toastId);
      toast?.success({
        title: type ? 'Unstake Successfully!' : 'Stake Successfully!'
      });
    } catch (err: any) {
      toast?.dismiss(toastId);
      toast?.fail({
        title: type ? 'Unstake Failed!' : 'Stake Failed!',
        text: err?.message?.includes('user rejected transaction')
          ? 'User rejected transaction'
          : err?.message ?? ''
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, onHandle };
}
