"use client";

import { useParams, useRouter, usePathname } from "next/navigation";
import BearBackground from "@/components/bear-background";
import SwitchTabs from "@/components/switch-tabs";
import PageBack from "@/components/back";
import useIsMobile from "@/hooks/use-isMobile";

const Laptop = ({ params, router, pathname, children }: any) => {
  return (
    <div className="pt-[30px] flex flex-col items-center">
      <PageBack className="absolute left-[36px] top-[31px]" showBackText={false} />
        {/* <SwitchTabs
          tabs={[
            { label: "Swap", value: "swap" },
            { label: "Liquidity", value: "pools" }
          ]}
          onChange={(val) => {
            router.replace(`/dex/${params.dapp}/${val}`);
          }}
          current={pathname.includes("pools") ? "pools" : "swap"}
          className="w-[400px]"
        /> */}
      {children}
    </div>
  );
};

const Mobile = ({ params, router, pathname, children }: any) => {
  return (
    <div className="relative pt-[50px] h-full">
      <PageBack className="absolute left-[12px] top-[22px]"  showBackText={false}  />
      {/* <div className="absolute top-[20px] right-[10px] w-[200px]">
          <SwitchTabs
            tabs={[
              { label: "Swap", value: "swap" },
              { label: "Liquidity", value: "pools" }
            ]}
            onChange={(val) => {
              router.replace(`/dex/${params.dapp}/${val}`);
            }}
            current={pathname.includes("pools") ? "pools" : "swap"}
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
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();

  return (
    <BearBackground type="dapp">
      {isMobile ? (
        <Mobile {...{ params, router, pathname, children }} />
      ) : (
        <Laptop {...{ params, router, pathname, children }} />
      )}
    </BearBackground>
  );
}
