import { useKodiakTokensStore } from "@/stores/kodiak-tokens";
import { useOogaTokensStore } from "@/stores/ooga-tokens";
import { asyncFetch } from "@/utils/http";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_CHAIN_ID } from "@/configs";
import { bera } from "@/configs/tokens/bera";

export default function useDexTokens(dapp: any) {
  const kodiakTokensStore: any = useKodiakTokensStore();
  const oogaTokensStore: any = useOogaTokensStore();
  const [tokens, setTokens] = useState<any>([]);

  const getTokens = useCallback(() => {
    if (!["Kodiak", "Ooga Booga"].includes(dapp.name)) {
      setTokens(dapp.tokens[DEFAULT_CHAIN_ID]);
      return;
    }
    if (dapp.name === "Kodiak") {
      getKodiakTokens();
      return;
    }

    if (dapp.name === "Ooga Booga") {
      getOogaTokens();
      return;
    }
  }, [dapp]);

  const getOogaTokens = useCallback(async () => {
    let _tokens = Object.values(oogaTokensStore.tokens);
    if (_tokens.length) {
      setTokens(_tokens);
      return;
    }
    try {
      const response = await asyncFetch(
        "https://mainnet.internal.oogabooga.io/token-list/tokens?chainId=80094&client=SWAP"
      );

      const list = response
        .filter((token: any) => token.symbol !== "LOCKS")
        .map((token: any) => {
          if (token.address === "0x0000000000000000000000000000000000000000") {
            token.address = "native";
          }
          return {
            ...token,
            icon: token.tokenURI,
            chainId: 80094
          };
        });
      oogaTokensStore.set({
        tokens: list.reduce(
          (acc: any, curr: any) => ({
            ...acc,
            [curr.address.toLowerCase()]: curr
          }),
          {}
        )
      });

      setTokens(list);
    } catch (err) {
      console.log(err);
      setTokens(dapp.tokens[DEFAULT_CHAIN_ID]);
    }
  }, [dapp]);

  const getKodiakTokens = useCallback(async () => {
    let _tokens = Object.values(kodiakTokensStore.tokens);
    if (_tokens.length) {
      setTokens(_tokens);
      return;
    }
    try {
      let pandaResponse: any;
      let normalResponse: any;
      try {
        pandaResponse = await asyncFetch(
          "https://api.panda.kodiak.finance/80094/tokenList.json"
        );
      } catch(err) {
        pandaResponse = { tokens: [] };
      }
      try {
        normalResponse = await asyncFetch(
          "https://static.kodiak.finance/tokenLists/berachain_mainnet.json"
        );
      } catch(err) {
        normalResponse = { tokens: [] };
      }
      const list = [
        bera.bera,
        bera.henlo,
        ...pandaResponse.tokens,
        ...normalResponse.tokens,
      ].map((token: any) => {
        const priceKey =
          token.address.toLowerCase() ===
            "0x0d9ac083dd2760943f773e70ebffe621e950871c"
            ? "BTCLUB"
            : token.symbol;
        return {
          ...token,
          priceKey,
          icon: token.logoURI || token.icon
        };
      });

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
