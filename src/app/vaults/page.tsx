'use client';

import dapps from '@/configs/staking';
import Vaults from '@/sections/vaults/v2';
import VaultsMobile from '@/sections/vaults/v2/mobile';
import useIsMobile from '@/hooks/use-isMobile';

export default function Page() {
  const isMobile = useIsMobile();

  return isMobile ? (
    <VaultsMobile dapp={[dapps['infrared'], dapps['aquabera']]} />
  ) : (
    <Vaults dapp={[dapps['infrared'], dapps['aquabera']]} />
  );
}
