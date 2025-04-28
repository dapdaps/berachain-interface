'use client';

import dapps from '@/configs/staking';
import Vaults from '@/sections/vaults/v2';
import VaultsMobile from '@/sections/vaults/v2/mobile';
import useIsMobile from '@/hooks/use-isMobile';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import useClickTracking from '@/hooks/use-click-tracking';
import { useAccount } from 'wagmi';

const reportMapping: any = {
  '/vaults/137lab': '1021-002',
  '/vaults/137lab-2': '1021-003',
};

const getVaultDapps = (pathname: string) => {
  const defaultDapps = [dapps['infrared'], dapps['aquabera']];
  return defaultDapps
};

export default function Page() {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const { handleReport } = useClickTracking();
  const { address } = useAccount()
  
  useEffect(() => {
    if (!address) return 
    const reportCode = reportMapping[pathname] || reportMapping['/vaults'];
    handleReport(reportCode)

  }, [pathname, address]);

  const vaultDapps = getVaultDapps(pathname);
  
  return isMobile ? (
    <VaultsMobile dapp={vaultDapps} />
  ) : (
    <Vaults dapp={vaultDapps} />
  );
}