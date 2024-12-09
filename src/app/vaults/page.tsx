'use client';
import dapps from '@/configs/staking';
import Vaults from '@/sections/vaults';

export default function Page() {
  return <Vaults dapp={[dapps['infrared'], dapps['aquabera']]} />;
}
