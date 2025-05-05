import { useEnrichedPositionsBoyco } from "royco/hooks";
import useCustomAccount from "@/hooks/use-account";
import { getTokenLogo } from "@/sections/dashboard/utils";
import { useMemo } from "react";
import { useList } from "@/sections/vaults/v2/hooks/list";
import Big from "big.js";
import config from "./config";
import { useSearchParams } from "next/navigation";

export default function useBoycoData(defaultVaults?: any) {
  const { listDataGroupByPoolAll, listLoading } = useList(!!defaultVaults);
  const searchParams = useSearchParams();
  const { account } = useCustomAccount();
  // const account = "0xf984B471EbB8ec3dc56153b0D4369b0556d87345"; //0x90c4903895e27a3cf5cc0b17c90cee927bb857e0

  const mergedAccount = searchParams.get("abc") || account;

  const propsPositionsBoyco = useEnrichedPositionsBoyco({
    account_address: mergedAccount.toLowerCase() ?? "",
    page_index: 0,
    page_size: 10
  });

  const data = useMemo(() => {
    const _listDataGroupByPoolAll = defaultVaults || listDataGroupByPoolAll;
    if (
      !_listDataGroupByPoolAll?.length ||
      !propsPositionsBoyco.data?.data?.length
    )
      return {};

    const _groupByPool = _listDataGroupByPoolAll.reduce(
      (acc: any, item: any) => {
        acc[item.pool_address] = item;
        return acc;
      },
      {}
    );

    let totalUsd = Big(0);
    const positions: any[] = [];
    const cachedVaults: any = {};
    const cachedAssets: any = {};

    propsPositionsBoyco.data.data?.forEach((item: any) => {
      const configItem = config[item.market_id];
      const key = configItem.pool_address.toLowerCase();
      const vault = _groupByPool[key];

      const _amount = Big(item.token_0_amount || 0).div(
        10 ** item.token_0_decimals
      );
      const tokens = vault
        ? vault.tokens.map((it: any) => ({
            ...it,
            icon: getTokenLogo(it.symbol)
          }))
        : configItem.tokens;

      const _usd = _amount.mul(item.token_0_price);
      totalUsd = totalUsd.add(_usd);
      positions.push({
        name: item.name,
        amount: _amount.toString(),
        amountUsd: _usd.toString(),
        tokens,
        rewards: configItem.rewards || []
      });
      if (!cachedAssets[key]) {
        cachedAssets[key] = {
          key,
          pool_address: [key],
          tokens,
          amount: _amount.toString(),
          amountUsd: _usd.toString()
        };
      } else {
        cachedAssets[key].amount = Big(cachedAssets[key].amount)
          .add(_amount)
          .toString();
        cachedAssets[key].amountUsd = Big(cachedAssets[key].amountUsd)
          .add(_usd)
          .toString();
        if (!cachedAssets[key].pool_address.includes(key)) {
          cachedAssets[key].pool_address.push(key);
        }
      }
      if (tokens.length === 1) {
        _listDataGroupByPoolAll.forEach((pool: any) => {
          const idx = pool.tokens.findIndex(
            (token: any) => tokens[0].address.toLowerCase() === token.address
          );
          if (idx === -1) {
            return;
          }
          if (cachedVaults[pool.pool_address]) return;
          cachedVaults[pool.pool_address] = pool;
          if (!cachedAssets[key].pool_address.includes(pool.pool_address)) {
            cachedAssets[key].pool_address.push(pool.pool_address);
          }
        });
      } else if (vault && !cachedVaults[vault.pool_address]) {
        cachedVaults[vault.pool_address] = vault;
      }
    });

    return {
      totalUsd: totalUsd.toString(),
      positions,
      assets: Object.values(cachedAssets),
      vaults: Object.values(cachedVaults)
    };
  }, [listDataGroupByPoolAll, defaultVaults, propsPositionsBoyco]);

  return {
    ...data,
    loading: !!defaultVaults
      ? propsPositionsBoyco.status === "pending"
      : listLoading || propsPositionsBoyco.status === "pending"
  };
}
