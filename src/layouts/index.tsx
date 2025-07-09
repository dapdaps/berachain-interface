import useIsMobile from "@/hooks/use-isMobile";
import MobileLayout from "./mobile";
import MainLayout from "./main";
import { usePathname } from "next/navigation";

const AppLayout = (props: any) => {
  const { children } = props;

  const isMobile = useIsMobile();
  const pathname = usePathname();

  return isMobile ? (
    <MobileLayout>{children}</MobileLayout>
  ) : (
    <MainLayout>{children}</MainLayout>
  );
};

export default AppLayout;
