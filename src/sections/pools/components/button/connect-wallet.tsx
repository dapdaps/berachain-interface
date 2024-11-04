import Button from './base-button';
import { useAppKit } from '@reown/appkit/react';

export default function ConnectWalletButton() {
  const { open } = useAppKit();
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
