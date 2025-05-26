"use client";

import { useParams, useRouter, usePathname } from "next/navigation";
import BearBackground from "@/components/bear-background";
import SwitchTabs from "@/components/switch-tabs";
import PageBack from "@/components/back";
import useIsMobile from "@/hooks/use-isMobile";
import DappIcon from "@/components/dapp-icon";
import dapps from "@/configs/swap";
import { DEFAULT_SWAP_DAPP } from "@/configs";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useMemo } from "react";

const Laptop = ({ params, router, dapp, children, isPool }: any) => {
  const dappList = useMemo(() => {
    return Object.values(dapps).filter((_dapp) => {
      if (isPool) {
        return _dapp.name !== "Ooga Booga" && _dapp.name !== dapp.name;
      }
      return _dapp.name !== dapp.name;
    });
  }, [dapp, isPool]);

  return (
    <div className="pt-[30px] flex flex-col items-center">
      <PageBack
        className="absolute left-[36px] top-[31px]"
        showBackText={false}
      />
      {params.dapp === "ooga-booga" ? (
        <div className="h-[56px]" />
      ) : (
        <SwitchTabs
          tabs={[
            { label: "Swap", value: "swap" },
            { label: "Liquidity", value: "pools" }
          ]}
          onChange={(val) => {
            router.replace(`/dex/${params.dapp}/${val}`);
          }}
          current={isPool ? "pools" : "swap"}
          className="w-[400px]"
        />
      )}
      <div
        className={clsx(
          "relative",
          !isPool && " w-[520px] md:w-[calc(100%-32px)] md:ml-[16px] pt-[30px]",
          isPool && " w-[990px] pt-[30px] md:w-full md:h-full md:pt-[10px]"
        )}
      >
        <div className="relative z-[5] w-full h-full">{children}</div>

        <DappIcon
          src={dapp.icon}
          alt={dapp.name}
          name={dapp.name}
          type="swap"
          className={clsx(
            "top-[-76px] md:top-[-30px] z-[10]",
            isPool ? "md:left-[56px]" : "md:left-[40px]"
          )}
        />
        <div
          className={clsx(
            "absolute left-[-62px] top-[80px] md:top-[-30px] md:left-[56px] z-[1]",
            isPool ? "md:left-[56px]" : "md:left-[40px]"
          )}
        >
          {dappList.map((_dapp) => (
            <motion.div
              className="p-[14px] cursor-pointer w-[178px] mt-[10px] flex gap-[10px] items-center rounded-[20px] border border-black bg-[#9ACA3B] shadow-[inset_0px_10px_0px_0px_#B2E946]"
              whileHover={{ x: -20 }}
              onClick={() => {
                router.replace(`${_dapp.path}/${isPool ? "pools" : "swap"}`);
              }}
            >
              <img
                width="42px"
                height="42px"
                src={_dapp.icon}
                className="rounded-[10px]"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Mobile = ({ params, router, children, isPool }: any) => {
  return (
    <div className="relative pt-[50px] h-full">
      <PageBack
        className="absolute left-[12px] top-[22px]"
        showBackText={false}
      />
      <div className="absolute top-[20px] right-[10px] w-[200px]">
        {params.dapp !== "ooga-booga" && (
          <SwitchTabs
            tabs={[
              { label: "Swap", value: "swap" },
              { label: "Liquidity", value: "pools" }
            ]}
            onChange={(val) => {
              router.replace(`/dex/${params.dapp}/${val}`);
            }}
            current={isPool ? "pools" : "swap"}
          />
        )}
      </div>
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
  const urlParams = useParams();
  const dapp = dapps[urlParams.dapp as string] || dapps[DEFAULT_SWAP_DAPP];
  const isPool = pathname.includes("pools");

  return (
    <BearBackground type="dapp">
      {isMobile ? (
        <Mobile {...{ params, router, children, dapp, isPool }} />
      ) : (
        <Laptop {...{ params, router, children, dapp, isPool }} />
      )}
    </BearBackground>
  );
}
