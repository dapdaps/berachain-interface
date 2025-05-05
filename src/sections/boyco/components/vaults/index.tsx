import useIsMobile from "@/hooks/use-isMobile";
import List from "./list";
import AssetButton from "@/sections/boyco/components/vaults/asset-button";
import router from "@/sections/pools/kodiak/island/abi/router";
import { useRouter } from "next/navigation";
import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import clsx from "clsx";
import { Gasoek_One } from "next/font/google";

const gasoekOne = Gasoek_One({
  weight: "400",
  subsets: ["latin"]
});

export default React.forwardRef(function Vaults(
  {
    vaults,
    assets,
    loading
  }: {
    vaults: any;
    assets: any;
    loading: boolean;
  },
  ref: any
) {
  const [selected, setSelected] = useState<any>([]);
  const [vaultsList, setVaultsList] = useState<any>([]);
  const assetsRef = useRef<HTMLDivElement>(null);
  const [vaultsHeight, setVaultsHeight] = useState("0px");
  const router = useRouter()
  const isMobile = useIsMobile()
  const refs = {
    selectedAssets: selected,
    vaultsList
  };
  useImperativeHandle(ref, () => refs);

  useEffect(() => {
    setSelected(assets?.map((asset: any) => ({ ...asset })) ?? []);
    const assetsH = assetsRef.current?.clientHeight || 0;
    setVaultsHeight(`calc(100% - ${assetsH + 50}px)`);
  }, [assets]);

  useEffect(() => {
    setVaultsList(
      vaults?.filter((vault: any) =>
        selected.some((asset: any) =>
          asset.pool_address.includes(vault.pool_address)
        )
      )
    );
  }, [vaults, selected]);

  const handleGo = () => {
    const searchParams = new URLSearchParams(
      window.location.search
    ).toString();
    router.push(
      `/vaults?from=boyco${
        searchParams ? "&" + searchParams : ""
      }`
    );
  }

  return (
    <>
      <div className="flex lg:items-start w-full lg:justify-between lg:gap-2 md:flex-col">
        {
          !loading && vaultsList?.length > 0 && (
            <div onClick={handleGo} className={clsx(isMobile ? 'bg-[url(/images/boyco/mobile-top.png)] w-full h-[83px]': 'bg-[url(/images/boyco/top.png)] w-[214px] h-[196px]', 'bg-no-repeat bg-contain relative')}>
              <div className={clsx('text-[#392C1D] text-[32px] leading-[90%] capitalize -rotate-[10deg] absolute md:left-[92px] md:bottom-[20px] lg:left-[30px] lg:bottom-[46px]', gasoekOne.className)}>{process.env.NEXT_PUBLIC_BOYCO_EARNUP || 599.58}%</div>
            </div>
          )
        }
        <div className="flex-1">
          <div className="text-[#392C1D] text-[14px] font-normal leading-[100%] md:my-[10px]">
          <span className="font-bold">[Filter]</span> Based on your locked Boyco assets
          </div>
          <div className="flex gap-x-[10px] gap-y-[0px] flex-wrap max-h-[160px] overflow-y-auto" ref={assetsRef}>
            {assets?.map((item: any, index: number) => (
              <AssetButton
                key={index}
                item={item}
                selected={selected.some((asset: any) => asset.key === item.key)}
                onSelect={() => {
                  if (selected.some((asset: any) => asset.key === item.key)) {
                    setSelected(
                      selected.filter((asset: any) => asset.key !== item.key)
                    );
                  } else {
                    setSelected([...selected, { ...item }]);
                  }
                }}
              />
            ))}
          </div>
      </div>
      </div>

      <List vaults={vaultsList} loading={loading} height={vaultsHeight} />
    </>
  );
});
