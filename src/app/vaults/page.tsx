'use client';

import dapps from '@/configs/staking';
import Vaults from '@/sections/vaults/v2';

export default function Page() {
  return <Vaults dapp={[dapps['infrared'], dapps['aquabera']]} />;
}
