import Button from "./base-button";
import { useAppKit } from "@reown/appkit/react";

export default function ConnectWalletButton({ className }: any) {
  const { open } = useAppKit();
  return (
    <Button
      onClick={() => {
        open();
      }}
      className={className}
    >
      Connect wallet
    </Button>
  );
}
