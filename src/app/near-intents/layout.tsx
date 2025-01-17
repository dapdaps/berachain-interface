"use client";

import { useParams, useRouter, usePathname, useSearchParams } from "next/navigation";
import BearBackground from "@/components/bear-background";
import SwitchTabs from "@/components/switch-tabs";
import PageBack from "@/components/back";
import useIsMobile from "@/hooks/use-isMobile";

const Laptop = ({ searchParams, router, pathname, children }: any) => {
  const handleTabChange = (val: string) => {
    router.push(`/near-intents?tab=${val}`);
  };

  return (
    // <div className="pt-[30px] flex flex-col items-center">
    <div className="pt-[30px]">
      <PageBack className="absolute left-[36px] top-[31px]" showBackText={false} />
      {/* <SwitchTabs
        tabs={[
          { label: "Swap", value: "swap" },
          { label: "Deposit", value: "deposit" },
          { label: "WithDraw", value: "withdraw" }
        ]}
        onChange={handleTabChange}
        current={searchParams.get("tab") || "swap"}
        className="w-[400px]"
      /> */}
      {children}
    </div>
  );
};

const Mobile = ({ searchParams, router, pathname, children }: any) => {
  const handleTabChange = (val: string) => {
    router.push(`/near-intents?tab=${val}`);
  };

  return (
    <div className="relative pt-[50px] h-full">
      <PageBack className="absolute left-[12px] top-[22px]" showBackText={false} />
      {/* <div className="absolute top-[20px] right-[10px] w-[200px]">
        <SwitchTabs
          tabs={[
            { label: "Swap", value: "swap" },
            { label: "Deposit", value: "deposit" },
            { label: "WithDraw", value: "withdraw" }
          ]}
          onChange={handleTabChange}
          current={searchParams.get("tab") || "swap"}
        />
      </div> */}
      {children}
    </div>
  );
};

export default function DexLayout({
  children
}: {
  children: React.ReactElement;
}) {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();

  return (
    <BearBackground type="dapps">
      {isMobile ? (
        <Mobile {...{ searchParams, router, pathname, children }} />
      ) : (
        <Laptop {...{ searchParams, router, pathname, children }} />
      )}
    </BearBackground>
  );
}
