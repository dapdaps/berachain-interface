import Laptop from "./laptop";
import Mobile from "@/sections/vaults/mobile";
import useIsMobile from "@/hooks/use-isMobile";
import Bedrock from "./bedrock";

export default function Staking(props: any) {
  const isMobile = useIsMobile();

  if (props?.dapp?.name === "Bedrock") {
    return <Bedrock {...props} />
  }

  return isMobile ? <Mobile {...props} /> : <Laptop {...props} />;
}
