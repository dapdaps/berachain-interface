"use client";

import { useParams, useRouter, usePathname } from "next/navigation";
import BearBackground from "@/components/bear-background";
import SwitchTabs from "@/components/switch-tabs";
import PageBack from "@/components/back";
import useIsMobile from "@/hooks/use-isMobile";
import DappIcon from '@/components/dapp-icon';
import Tabs from '@/components/tabs';
import Content from '@/sections/ramen/content';
import React, { useState } from 'react';

const Laptop = ({ params, router, pathname, children }: any) => {
  const [currentTab, setCurrentTab] = useState<string>('current');

  return (
    <div className="pt-[30px] flex flex-col items-center">
      <PageBack
        className="absolute left-[36px] top-[31px]"
        showBackText={false}
      />
      <div className="mt-[40px]">
        <div className="relative w-[970px] md:w-full mx-auto">
          <DappIcon
            src="/images/dapps/red-ramen-logo.svg"
            alt=""
            name="Ramen"
            type="launchpad"
            className="z-10 top-[-70px] md:left-[50%] md:translate-x-[-50%] md:top-[-40px]"
          />
          <Tabs
            isCard
            currentTab={currentTab}
            tabs={[
              {
                key: 'current',
                label: 'Launches',
                children,
              },
            ]}
            onChange={(key) => setCurrentTab(key as string)}
            className="h-full md:pt-[20px]"
          />
        </div>
      </div>
    </div>
  );
};

const Mobile = ({ params, router, pathname, children }: any) => {
  return (
    <div className="relative pt-[50px] h-full">
      <PageBack
        className="absolute left-[12px] top-[22px]"
        showBackText={false}
      />
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
