import { useKodiakTokensStore } from "@/stores/kodiak-tokens";
import { asyncFetch } from "@/utils/http";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_CHAIN_ID } from "@/configs";
import { bera } from "@/configs/tokens/bera";

export default function useDexTokens(dapp: any) {
  const kodiakTokensStore: any = useKodiakTokensStore();
  const [tokens, setTokens] = useState<any>([]);

  const getTokens = useCallback(async () => {
    if (dapp.name !== "Kodiak") {
      setTokens(dapp.tokens[DEFAULT_CHAIN_ID]);
      return;
    }
    let _tokens = Object.values(kodiakTokensStore.tokens);
    if (_tokens.length) {
      setTokens(_tokens);
      return;
    }
    try {
      const pandaResponse = await asyncFetch(
        "https://api.panda.kodiak.finance/80094/tokenList.json"
      );
      const normalResponse = await asyncFetch(
        "https://static.kodiak.finance/tokenLists/berachain_mainnet.json"
      );
      const list = [
        bera.bera,
        ...pandaResponse.tokens,
        ...normalResponse.tokens
      ].map((token: any) => ({
        ...token,
        icon: token.logoURI || token.icon
      }));
      kodiakTokensStore.set({
        tokens: list.reduce(
          (acc, curr) => ({ ...acc, [curr.address.toLowerCase()]: curr }),
          {}
        )
      });
      setTokens(list);
    } catch (err) {
      setTokens(dapp.tokens[DEFAULT_CHAIN_ID]);
    }
  }, [dapp]);

  useEffect(() => {
    getTokens();
  }, [dapp]);

  return tokens;
}
