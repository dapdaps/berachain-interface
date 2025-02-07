import { bera } from "@/configs/tokens/bera";

const basic = {
  name: "Dolomite",
  icon: "/images/dapps/dolomite.svg",
  path: "/lending/dolomite"
};

const graphConfig = {
  blockNumberApiQuery: () => ({
    operationName: "getLatestBlockNumber",
    variables: {},
    query:
      "query getLatestBlockNumber {\n  _meta {\n    block {\n      number\n      __typename\n    }\n    __typename\n  }\n}\n"
  }),
  marketInfoApiQuery: ({ blockNumber }: { blockNumber: number }) => ({
    operationName: "allMarketInfos",
    variables: {
      blockNumber
    },
    query:
      "query allMarketInfos($blockNumber: Int!) {\n  marketRiskInfos(block: {number_gte: $blockNumber}) {\n    id\n    token {\n      id\n      marketId\n      __typename\n    }\n    isBorrowingDisabled\n    marginPremium\n    liquidationRewardPremium\n    oracle\n    supplyMaxWei\n    __typename\n  }\n}\n"
  }),
  allTokensApiQuery: ({ blockNumber }: { blockNumber: number }) => ({
    operationName: "allTokens",
    variables: {
      blockNumber
    },
    query:
      "query allTokens($blockNumber: Int!) {\n  tokens(\n    first: 1000\n    orderBy: symbol\n    orderDirection: asc\n    block: {number_gte: $blockNumber}\n  ) {\n    id\n    chainId\n    marketId\n    symbol\n    name\n    decimals\n    __typename\n  }\n}\n"
  }),
  allTotalParsApiQuery: ({ blockNumber }: { blockNumber: number }) => ({
    operationName: "allTotalPars",
    variables: {
      blockNumber
    },
    query:
      "query allTotalPars($blockNumber: Int!) {\n  totalPars(block: {number_gte: $blockNumber}) {\n    id\n    borrowPar\n    supplyPar\n    __typename\n  }\n}\n"
  }),
  positionListApiQuery: ({
    walletAddress,
    blockNumber
  }: {
    walletAddress: string;
    blockNumber: number;
  }) => ({
    operationName: "borrowPositions",
    variables: { walletAddress: walletAddress, blockNumber: blockNumber },
    query:
      'query borrowPositions($blockNumber: Int!, $walletAddress: String!) {\n  borrowPositions(\n    block: {number_gte: $blockNumber}\n    where: {effectiveUser: $walletAddress, status_not: "CLOSED", marginAccount_: {accountNumber_not: 0}}\n    orderBy: openTimestamp\n    orderDirection: desc\n    first: 50\n  ) {\n    id\n    marginAccount {\n      id\n      user {\n        id\n        __typename\n      }\n      accountNumber\n      lastUpdatedTimestamp\n      lastUpdatedBlockNumber\n      __typename\n    }\n    openTransaction {\n      id\n      blockNumber\n      timestamp\n      __typename\n    }\n    closeTransaction {\n      id\n      blockNumber\n      timestamp\n      __typename\n    }\n    status\n    openTimestamp\n    closeTimestamp\n    effectiveSupplyTokens {\n      id\n      symbol\n      name\n      decimals\n      marketId\n      __typename\n    }\n    effectiveBorrowTokens {\n      id\n      symbol\n      name\n      decimals\n      marketId\n      __typename\n    }\n    effectiveUser {\n      id\n      __typename\n    }\n    amounts {\n      token {\n        id\n        symbol\n        name\n        decimals\n        marketId\n        __typename\n      }\n      expirationTimestamp\n      amountPar\n      amountWei\n      __typename\n    }\n    __typename\n  }\n}\n'
  })
};

const networks = {
  80094: {
    depositWithdrawalProxy: "0xd6a31B6AeA4d26A19bF479b5032D9DDc481187e6",
    borrowPositionProxyV1: "0x67567Fce98A44745820069C37C395426F1C30ba6",
    marginAddress: "0x003Ca23Fd5F0ca87D01F6eC6CD14A8AE60c2b97D",
    spenderAddress: "0x003Ca23Fd5F0ca87D01F6eC6CD14A8AE60c2b97D",
    // if your debt is $100, Liquidation Treshold = when collateral assets < $115 OR debt assets > $104.35
    // $120 / ($100 * liquidationRatio) = ~1.043 Health Factor
    liquidationRatio: "1.25",
    interestRatesApi: "/api.dolomite.io/tokens/80094/interest-rates",
    pricesApi: "/api.dolomite.io/tokens/80094/prices",
    graphApi:
      "https://api.goldsky.com/api/public/project_clyuw4gvq4d5801tegx0aafpu/subgraphs/dolomite-berachain-mainnet/v0.1.4/gn",
    ...graphConfig,
    approveMax: true,
    wrappedToken: bera["wbera"],
    markets: {
      [bera["wbera"].address]: {
        ...bera["wbera"],
        underlyingToken: bera["wbera"]
      },
      [bera["bera"].address]: {
        ...bera["bera"],
        underlyingToken: bera["bera"]
      },
      [bera["honey"].address]: {
        ...bera["honey"],
        underlyingToken: bera["honey"]
      },
      [bera["usdc.e"].address]: {
        ...bera["usdc.e"],
        underlyingToken: bera["usdc.e"]
      },
      [bera["unibtc"].address]: {
        ...bera["unibtc"],
        underlyingToken: bera["unibtc"]
      }
    }
  }
};

export default { basic, networks };
