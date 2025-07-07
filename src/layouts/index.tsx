import useIsMobile from "@/hooks/use-isMobile";
import MobileLayout from "./mobile";
import MainLayout from "./main";
import { usePathname } from "next/navigation";
import BelongLayout from "./belong";

const AppLayout = (props: any) => {
  const { children } = props;

  const isMobile = useIsMobile();
  const pathname = usePathname();

  if (["/belong"].includes(pathname)) {
    return <BelongLayout>{children}</BelongLayout>;
  }

  return isMobile ? (
    <MobileLayout>{children}</MobileLayout>
  ) : (
    <MainLayout>{children}</MainLayout>
  );
};

export default AppLayout;
