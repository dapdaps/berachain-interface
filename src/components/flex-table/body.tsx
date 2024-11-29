import useIsMobile from "@/hooks/use-isMobile";
import Mobile from "./mobile";
import Laptop from "./laptop";

export default function Body({ className, children, onScrollBottom }: any) {
  const isMobile = useIsMobile();

  return isMobile ? (
    <Mobile className={className} onScrollBottom={onScrollBottom}>
      {children}
    </Mobile>
  ) : (
    <Laptop className={className}>{children}</Laptop>
  );
}
