import { useWalletInfo } from '@reown/appkit/react';
import { useAccount as useWagmiAccount } from 'wagmi';
import { useMemo } from 'react';

export function useWalletName() {
  const { walletInfo } = useWalletInfo();
  const { connector } = useWagmiAccount();

  const info = useMemo(() => {
    let walletName = connector?.name || '';
    let walletIcon = connector?.icon || '';
    if (!walletName) {
      walletName = walletInfo?.name || '';
      walletName = walletName.replace(/^io\./, '');
      walletName = walletName.charAt(0).toUpperCase() + walletName.slice(1);
    }
    if (!walletIcon) {
      walletIcon = walletInfo?.icon || '';
    }
    if (walletName === 'BeraSig Wallet') {
      walletName = 'Berasig';
    }
    return { name: walletName, icon: walletIcon };
  }, [walletInfo, connector]);

  return { ...info };
}
