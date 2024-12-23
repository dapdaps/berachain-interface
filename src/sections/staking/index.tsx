import Laptop from "./laptop";
import Mobile from "@/sections/vaults/mobile";
import useIsMobile from "@/hooks/use-isMobile";

export default function Staking(props: any) {
  const isMobile = useIsMobile();
  return isMobile ? <Mobile {...props} /> : <Laptop {...props} />;
}
