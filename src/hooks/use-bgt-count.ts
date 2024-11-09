import useCustomAccount from '@/hooks/use-account';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { ABI as IBGT_ABI, IBGT_ADDRESS } from '@/hooks/use-ibgt';
import { ABI as BGT_ABI, BGT_ADDRESS } from '@/hooks/use-bgt';

export function useBgtCount() {
  const { provider, account } = useCustomAccount();

  const [iBGTCount, setIBGTCount] = useState<string>();
  const [BGTCount, setBGTCount] = useState<string>();

  const queryBGTCount = async () => {
    const iBGTContract = new ethers.Contract(IBGT_ADDRESS, IBGT_ABI, provider?.getSigner());
    const BGTContract = new ethers.Contract(BGT_ADDRESS, BGT_ABI, provider?.getSigner())
    const balanceOfIBGT = await iBGTContract?.balanceOf(account);
    const balanceOfBGT = await BGTContract.balanceOf(account)
    const iBGT = ethers.utils.formatUnits(balanceOfIBGT);
    const BGT = ethers.utils.formatUnits(balanceOfBGT);
    setIBGTCount(iBGT);
    setBGTCount(BGT);
  };

  useEffect(() => {
    if (!account || !provider) {
      setIBGTCount('0');
      setBGTCount('0');
      return;
    }
    queryBGTCount();
    const timer = setInterval(() => {
      queryBGTCount();
    }, 60000);
    return () => {
      clearInterval(timer);
    };
  }, [account, provider]);

  return {
    iBGTCount,
    BGTCount,
  };
}
