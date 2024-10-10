import { Contract } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import useAccount from '@/hooks/use-account';
import positionAbi from '../abi/position';
import { DEFAULT_CHAIN_ID } from '@/configs';

export default function useCollectInfo(tokenId: string, dex: any) {
  const [info, setInfo] = useState<any>();
  const [loading, setLoading] = useState(false);
  const { account, provider } = useAccount();

  const queryCollectInfo = useCallback(async () => {
    if (!tokenId || !dex.contracts[DEFAULT_CHAIN_ID] || !account || !provider)
      return;
    const { PositionManager } = dex.contracts[DEFAULT_CHAIN_ID];
    try {
      setLoading(true);
      const PositionContract = new Contract(
        PositionManager,
        positionAbi,
        provider
      );

      const result = await PositionContract.callStatic.collect([
        tokenId,
        account,
        '340282366920938463463374607431768211455',
        '340282366920938463463374607431768211455'
      ]);

      setInfo(result);
      setLoading(false);
    } catch (err) {
      console.log('err', err);
      setInfo(null);
      setLoading(false);
    }
  }, [provider, account]);

  useEffect(() => {
    queryCollectInfo();
  }, [account, provider]);

  return { loading, info, queryCollectInfo };
}
