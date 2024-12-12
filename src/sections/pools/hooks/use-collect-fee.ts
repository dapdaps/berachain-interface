import { Contract } from 'ethers';
import { useCallback, useState } from 'react';
import useAccount from '@/hooks/use-account';
import useToast from '@/hooks/use-toast';
import positionAbi from '../abi/position';

export default function useCollectFee({ tokenId, dex, onSuccess }: any) {
  const [loading, setLoading] = useState(false);
  const { account, chainId, provider } = useAccount();
  const toast = useToast();

  const onCollect = useCallback(async () => {
    if (!chainId) return;
    const { PositionManager } = dex.contracts[chainId];
    let toastId = toast.loading({ title: 'Confirming...' });
    try {
      setLoading(true);
      const signer = await provider.getSigner(account);
      const PositionContract = new Contract(
        PositionManager,
        positionAbi,
        signer
      );
      const params = [
        tokenId,
        account,
        '340282366920938463463374607431768211455',
        '340282366920938463463374607431768211455'
      ];

      const estimateGas = await PositionContract.estimateGas.collect(params);
      const tx = await PositionContract.collect(params, {
        gasLimit: estimateGas.add(1000)
      });
      toast.dismiss(toastId);
      toastId = toast.loading({ title: 'Pending...' });
      const { status, transactionHash } = await tx.wait();
      setLoading(false);
      toast.dismiss(toastId);
      if (status === 1) {
        toast.success({
          title: 'Collect fees successful!',
          tx: transactionHash,
          chainId
        });
        onSuccess();
      } else {
        toast.fail({ title: 'Collect fees failed!' });
      }
    } catch (err: any) {
      toast.dismiss(toastId);
      setLoading(false);
      toast.fail({
        title: err?.message?.includes('user rejected transaction')
          ? 'User rejected transaction'
          : `Collect fees failed!`
      });
    }
  }, [chainId, provider]);

  return { loading, onCollect };
}
