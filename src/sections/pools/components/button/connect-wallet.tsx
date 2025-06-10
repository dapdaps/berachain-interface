import Button from "./base-button";
import { useConnectModal } from '@rainbow-me/rainbowkit';

export default function ConnectWalletButton({ className }: any) {
  const { openConnectModal } = useConnectModal();
  return (
    <Button
      onClick={() => {
        openConnectModal?.();
      }}
      className={className}
    >
      Connect wallet
    </Button>
  );
}
