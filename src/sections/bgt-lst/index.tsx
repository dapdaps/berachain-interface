import useIsMobile from "@/hooks/use-isMobile";
import { memo } from "react";
import Laptop from "./laptop";
import Mobile from "./mobile";

export default memo(function BgtLstView(props) {
  const isMobile = useIsMobile();
  return isMobile ? <Mobile {...props} /> : <Laptop {...props} />;
})
