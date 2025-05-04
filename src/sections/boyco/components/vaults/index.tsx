import List from "./list";
import AssetButton from '@/sections/boyco/components/vaults/asset-button';
import React, { useEffect, useImperativeHandle, useState } from 'react';

export default React.forwardRef(function Vaults({
  vaults,
  assets,
  loading
}: {
  vaults: any;
  assets: any;
  loading: boolean;
}, ref: any) {
  const [selected, setSelected] = useState<any>([]);
  const [vaultsList, setVaultsList] = useState<any>([]);

  const refs = {
    selectedAssets: selected,
    vaultsList,
  };
  useImperativeHandle(ref, () => refs);

  useEffect(() => {
    setSelected(assets?.map((asset: any) => ({ ...asset })) ?? []);
  }, [assets]);

  useEffect(() => {
    setVaultsList(vaults?.filter((vault: any) => selected.some((asset: any) => asset.pool_address.includes(vault.pool_address))));
  }, [vaults, selected]);

  return (
    <>
      <div className="text-[#392C1D] text-[14px] font-normal leading-[100%] mt-[40px]">
        Est. Unlocked assets (Available in vaults)
      </div>
      <div className="flex gap-[10px] flex-wrap">
        {assets?.map((item: any, index: number) => (
          <AssetButton
            key={index}
            item={item}
            selected={selected.some((asset: any) => asset.key === item.key)}
            onSelect={() => {
              if (selected.some((asset: any) => asset.key === item.key)) {
                setSelected(selected.filter((asset: any) => asset.key !== item.key));
              } else {
                setSelected([...selected, { ...item }]);
              }
            }}
          />
        ))}
      </div>
      <List vaults={vaultsList} loading={loading} />
    </>
  );
});
