import { useQuery } from "@tanstack/react-query";
import { getAccountBalanceQueryOptions } from "@/sdk/queries";
import { useTokenQuotes } from "@/sdk/hooks";
import { getSupportedToken, type SupportedToken } from "@/sdk/constants";
import { parseRawAmount, parseRawAmountToTokenAmount } from "@/sdk/utils";
import { useRpcApiKeys, type TypedRpcApiKeys } from "@/sdk/client";

export type AccountBalance = SupportedToken & {
  raw_amount: String;
  token_amount: number;
  token_amount_usd: number;
};

export const useAccountBalance = ({
  chain_id,
  account,
  tokens,
}: {
  chain_id: number;
  account: string;
  tokens: string[];
}) => {
  const RPC_API_KEYS: TypedRpcApiKeys | undefined = useRpcApiKeys();

  let data: AccountBalance[] | null = null;

  const token_ids = tokens.map((token) => `${chain_id}-${token.toLowerCase()}`);

  const propsAccountInfo = useQuery(
    getAccountBalanceQueryOptions(
      RPC_API_KEYS ?? {},
      chain_id,
      account,
      tokens,
    ),
  );

  const propsTokenQuotes = useTokenQuotes({ token_ids });

  const isLoading = propsAccountInfo.isLoading || propsTokenQuotes.isLoading;
  const isError = propsAccountInfo.isError || propsTokenQuotes.isError;
  const isRefetching =
    propsAccountInfo.isRefetching || propsTokenQuotes.isRefetching;

  if (
    !(propsAccountInfo.data instanceof Error) &&
    !(propsTokenQuotes.data instanceof Error) &&
    !!propsTokenQuotes.data &&
    propsTokenQuotes.data !== null &&
    !!propsAccountInfo.data
  ) {
    data = propsAccountInfo.data.map((res, index) => {
      let token_data = (propsTokenQuotes.data ?? []).find(
        (quote) => quote.token_id === token_ids[index],
      );

      if (!token_data) {
        token_data = {
          ...getSupportedToken(token_ids[index] ?? ""),
          token_id: token_ids[index] ?? "",
          price: 0,
          fdv: 0,
          total_supply: 0,
        };
      }

      const raw_amount = parseRawAmount(res.result);
      const token_amount = parseRawAmountToTokenAmount(
        raw_amount,
        token_data?.decimals ?? 0,
      );

      const token_amount_usd = token_amount * (token_data?.price ?? 0);

      return {
        ...token_data,
        raw_amount,
        token_amount,
        token_amount_usd,
      } as AccountBalance;
    });
  }

  return {
    data,
    isLoading,
    isRefetching,
    isError,
  };
};
