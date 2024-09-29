import Big from 'big.js';
import { Contract, ethers } from 'ethers';
import { useEffect, useState } from 'react';
import useToast from '@/hooks/use-toast';

import type { Token } from '@/types';

import { useAccount } from 'wagmi';

export default function useApprove({
  token,
  amount,
  spender,
  isSkip,
  onSuccess
}: {
  token?: Token;
  amount?: string;
  spender?: string;
  isSkip?: boolean;
  onSuccess?: VoidFunction;
  checkApproved?: VoidFunction;
}) {
  const [approved, setApproved] = useState(false);
  const [approving, setApproving] = useState(false);
  const [checking, setChecking] = useState(false);
  const { address, connector } = useAccount();
  const toast = useToast();

  const checkApproved = async () => {
    if (!token?.address || !amount || !spender) return;
    try {
      const walletProvider: any = await connector?.getProvider();
      const provider = new ethers.providers.Web3Provider(walletProvider, 'any');
      const signer = provider.getSigner(address);

      setChecking(true);
      const TokenContract = new Contract(
        token.address,
        [
          {
            inputs: [
              { internalType: 'address', name: '', type: 'address' },
              { internalType: 'address', name: '', type: 'address' }
            ],
            name: 'allowance',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function'
          }
        ],
        signer
      );
      const allowanceRes = await TokenContract.allowance(address, spender);

      const needApproved = new Big(
        ethers.utils.formatUnits(allowanceRes.toString(), token.decimals)
      ).lt(amount);
      setApproved(!needApproved);
      setChecking(false);
    } catch (err) {
      console.log('check approved failed: %o', err);
      setChecking(false);
    }
  };

  const approve = async () => {
    if (!token?.address || !amount || !spender) return;
    setApproving(true);
    try {
      const walletProvider: any = await connector?.getProvider();
      const provider = new ethers.providers.Web3Provider(walletProvider, 'any');
      const signer = provider.getSigner(address);
      const TokenContract = new Contract(
        token.address,
        [
          {
            inputs: [
              { internalType: 'address', name: 'spender', type: 'address' },
              { internalType: 'uint256', name: 'value', type: 'uint256' }
            ],
            name: 'approve',
            outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
            stateMutability: 'nonpayable',
            type: 'function'
          }
        ],
        signer
      );
      const tx = await TokenContract.approve(
        spender,
        new Big(amount).mul(10 ** token.decimals).toFixed(0)
      );
      const res = await tx.wait();
      setApproving(false);
      if (res.status === 1) {
        setApproved(true);
        onSuccess?.();
        toast.success({
          title: 'Approve Successfully!'
        });
      }
    } catch (err: any) {
      toast.fail({
        title: 'Approve Failed!',
        text: err?.message?.includes('user rejected transaction')
          ? 'User rejected transaction'
          : ''
      });
      setApproving(false);
    }
  };

  useEffect(() => {
    if (token?.isNative || isSkip) {
      setApproved(true);
      return;
    }
    if (token && amount && spender) checkApproved();
  }, [token, amount, spender, isSkip]);

  return { approved, approve, approving, checking, checkApproved };
}
