import Button from "./base-button";
import { useSwitchChain } from "wagmi";
import { DEFAULT_CHAIN_ID } from "@/configs";

export default function SwitchNetworkButton({ className }: any) {
  const { isPending: switching, switchChain } = useSwitchChain();
  return (
    <Button
      onClick={() => {
        switchChain({
          chainId: DEFAULT_CHAIN_ID
        });
      }}
      loading={switching}
      className={className}
    >
      Switch Network
    </Button>
  );
}
