import { useEnrichedPositionsBoyco } from "royco/hooks";
import useCustomAccount from "@/hooks/use-account";
import { getTokenLogo } from "@/sections/dashboard/utils";
import { useMemo } from "react";
import { useList } from "@/sections/vaults/v2/hooks/list";
import Big from "big.js";

export default function useBoycoData() {
  const { listDataGroupByPoolAll, listLoading } = useList();
  // const { account } = useCustomAccount();
  const account = "0x90c4903895e27a3cf5cc0b17c90cee927bb857e0";

  const propsPositionsBoyco = useEnrichedPositionsBoyco({
    account_address: account.toLowerCase() ?? "",
    page_index: 0,
    page_size: 10
  });

  const data = useMemo(() => {
    if (
      !listDataGroupByPoolAll?.length ||
      !propsPositionsBoyco.data?.data?.length
    )
      return {};

    const _groupByPool = listDataGroupByPoolAll.reduce(
      (acc: any, item: any) => {
        const tokensAddress = item.tokens.map((it: any) => it.address);
        acc[tokensAddress.join("-")] = item;
        return acc;
      },
      {}
    );

    let totalUsd = Big(0);
    const positions: any[] = [];
    const vaults: any[] = [];
    const cachedAssets: any = {};

    propsPositionsBoyco.data.data?.forEach((item: any) => {
      const dust_tokens = item.dust_token_ids.map(
        (id: string) => id.split("-")[1]
      );
      const key = dust_tokens.join("-");
      const vault = _groupByPool[key];
      if (!vault) return;
      const _amount = Big(item.token_0_amount || 0).div(
        10 ** item.token_0_decimals
      );
      const tokens = vault.tokens.map((it: any) => ({
        ...it,
        logo: getTokenLogo(it.symbol)
      }));
      const _usd = _amount.mul(item.token_0_price);
      totalUsd = totalUsd.add(_usd);
      positions.push({
        name: item.name,
        amount: _amount.toString(),
        amountUsd: _usd.toString(),
        tokens
      });
      if (!cachedAssets[key]) {
        cachedAssets[key] = {
          tokens,
          amount: _amount.toString(),
          amountUsd: _usd.toString()
        };
        vaults.push(vault);
      } else {
        cachedAssets[key].amount = Big(cachedAssets[key].amount)
          .add(_amount)
          .toString();
        cachedAssets[key].amountUsd = Big(cachedAssets[key].amountUsd)
          .add(_usd)
          .toString();
      }
    });

    return {
      totalUsd: totalUsd.toString(),
      positions,
      assets: Object.values(cachedAssets),
      vaults
    };
  }, [listDataGroupByPoolAll, propsPositionsBoyco]);

  return {
    ...data,
    loading: listLoading || propsPositionsBoyco.status === "pending"
  };
}
