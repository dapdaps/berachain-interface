import { useCallback, useEffect, useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import { asyncFetch, post } from "@/utils/http";
import { TOKENS } from "../config";

export default function useUserInfo({ slug, ticketPrice }: any) {
  const [maxTicket, setMaxTicket] = useState(0);
  const [auctionInfo, setAuctionInfo] = useState<any>();
  const { account } = useCustomAccount();
  const queryGachaBalance = useCallback(async () => {
    const gachaRes = await asyncFetch(
      `/api.ramen/v1/rewards?address=${account}`
    );
    const gachaBalance = gachaRes.data.amount;
    setMaxTicket(Math.floor(gachaBalance / ticketPrice));
  }, [account, ticketPrice]);

  const queryActionLot = useCallback(async () => {
    try {
      const res = await post(
        "https://api.goldsky.com/api/public/project_clu16lu24lqh201x9f0qh135t/subgraphs/axis-origin-berachain-mainnet/1.0.4/gn",
        {
          operationName: "GetAuctionLot",
          query:
            '\n  query GetAuctionLot($id: ID!, $bidder: String!) {\n    batchAuctionLot(id: $id) {\n      capacity\n      purchased\n      lotId\n      baseToken {\n        decimals\n        totalSupply\n        symbol\n        name\n        id\n      }\n      sold\n      userBids: bids(\n        where: {\n          and: [\n            { bidder: $bidder }\n            { or: [{ status_not: "claimed" }, { submittedPrice_not: null }] }\n          ]\n        }\n        orderBy: bidId\n        orderDirection: asc\n      ) {\n        bidder\n        status\n        outcome\n        settledAmountIn\n        settledAmountInRefunded\n        settledAmountOut\n        submittedPrice\n        amountIn\n        amountOut\n        bidId\n      }\n      userSettledBids: bids(\n        where: {\n          or: [\n            {\n              and: [\n                { bidder: $bidder }\n                { outcome_not: null }\n                { status_not: "submitted" }\n                { submittedPrice_not: null }\n              ]\n            },\n            {\n              and: [\n                { bidder: $bidder }\n                { status: "decrypted" }\n                { submittedPrice: null }\n              ]\n            }\n          ]\n        }\n        orderBy: bidId\n        orderDirection: asc\n      ) {\n        bidder\n        status\n        outcome\n        settledAmountIn\n        settledAmountInRefunded\n        settledAmountOut\n        submittedPrice\n        amountIn\n        amountOut\n        bidId\n      }\n      encryptedMarginalPrice {\n        minPrice\n        minBidSize\n        minFilled\n        status\n        marginalPrice\n      }\n    }\n  }\n',
          variables: {
            bidder: account,
            id: `berachain-mainnet-0xba0000907c7812aec8f7e9e27aeff4ea7565a8ba-${TOKENS[slug].lotId}`
          }
        }
      );
      setAuctionInfo(res.data.batchAuctionLot);
    } catch (err) {
      setAuctionInfo(null);
    }
  }, [slug, account]);

  useEffect(() => {
    if (!account) return;
    if (!ticketPrice) queryGachaBalance();
  }, [account, ticketPrice]);

  useEffect(() => {
    if (!TOKENS[slug]) return;

    queryActionLot();
  }, [account, slug]);

  return {
    maxTicket,
    auctionInfo
  };
}
