'use client';
import dapps from '@/configs/liquidity';
import Vaults from '@/sections/vaults';

export default function Page() {
  return <Vaults dapp={dapps['infrared']} />;
}
