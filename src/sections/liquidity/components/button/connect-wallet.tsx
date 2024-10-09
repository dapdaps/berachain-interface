import Button from './base-button';
import { useWeb3Modal } from '@web3modal/wagmi/react';

export default function ConnectWalletButton() {
  const { open } = useWeb3Modal();
  return (
    <Button
      onClick={() => {
        open();
      }}
    >
      Connect wallet
    </Button>
  );
}
