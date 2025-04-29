import Laptop from "./laptop";
import Mobile from "@/sections/vaults/mobile";
import useIsMobile from "@/hooks/use-isMobile";
import Bedrock from "./bedrock";
import Berapaw from '@/sections/staking/dapps/berapaw';

export default function Staking(props: any) {
  const isMobile = useIsMobile();

  if (props?.dapp?.name === "Bedrock") {
    return <Bedrock {...props} />
  }

  if (props?.dapp?.name === "BeraPaw") {
    return <Berapaw {...props} />
  }

  return isMobile ? <Mobile {...props} /> : <Laptop {...props} />;
}
