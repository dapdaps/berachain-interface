import Laptop from "./laptop";
import Mobile from "./mobile";
import DepositOnly from "./modals/deposit-only";
import WithStaking from "./modals/with-staking";
import useIsMobile from "@/hooks/use-isMobile";

export default function Detail(props: any) {
  const isMobile = useIsMobile();
  return (
    <>
      {isMobile ? <Mobile {...props} /> : <Laptop {...props} />}
      {/* <DepositOnly /> */}
      <WithStaking />
    </>
  );
}
