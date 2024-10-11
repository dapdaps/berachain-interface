import { beraB } from '@/configs/tokens/bera-bArtio';

const basic = {
  name: 'Dolomite',
  icon: '/assets/dapps/dolomite.png',
};

const API_HOST = 'https://subgraphapi.dolomite.io/api/public';
const API_ID = '1301d2d1-7a9d-4be4-9e9a-061cb8611549';
const API_VERSION = 'v0.1.2';

const networks = {
  80084: {
    depositWithdrawalProxy: '0x36864DB0396B1aC36c5d6609deD5Cc7F8073d08c',
    borrowPositionProxyV1: '0xe99A7e4556CaF7925fbac52765128e524E9Dd793',
    marginAddress: '0x07d163861EB93e6A1f985d0caF0f505F66F11D13',
    spenderAddress: '0x07d163861EB93e6A1f985d0caF0f505F66F11D13',
    // if your debt is $100, Liquidation Treshold = when collateral assets < $115 OR debt assets > $104.35
    // $120 / ($100 * liquidationRatio) = ~1.043 Health Factor
    liquidationRatio: '1.20',
    interestRatesApi: '/api.dolomite.io/tokens/80084/interest-rates',
    blockNumberApi: `${API_HOST}/${API_ID}/subgraphs/dolomite-berachain/${API_VERSION}/gn`,
    blockNumberApiQuery: () => ({
      operationName:"getLatestBlockNumber",
      variables:{},
      query:"query getLatestBlockNumber {\n  _meta {\n    block {\n      number\n      __typename\n    }\n    __typename\n  }\n}\n"
    }),
    positionListApi: `${API_HOST}/${API_ID}/subgraphs/dolomite-berachain/${API_VERSION}/gn`,
    positionListApiQuery: ({ walletAddress, blockNumber }: { walletAddress: string; blockNumber: number }) => ({
      operationName: 'borrowPositions',
      variables: { walletAddress: walletAddress.toLowerCase(), blockNumber: blockNumber },
      query:
        "query borrowPositions($blockNumber: Int!, $walletAddress: String!) {\n  borrowPositions(\n    block: {number_gte: $blockNumber}\n    where: {effectiveUser: $walletAddress, status_not: \"CLOSED\", marginAccount_: {accountNumber_not: 0}}\n    orderBy: openTimestamp\n    orderDirection: desc\n    first: 50\n  ) {\n    id\n    marginAccount {\n      id\n      user {\n        id\n        __typename\n      }\n      accountNumber\n      lastUpdatedTimestamp\n      lastUpdatedBlockNumber\n      __typename\n    }\n    openTransaction {\n      id\n      blockNumber\n      timestamp\n      __typename\n    }\n    closeTransaction {\n      id\n      blockNumber\n      timestamp\n      __typename\n    }\n    status\n    openTimestamp\n    closeTimestamp\n    effectiveSupplyTokens {\n      id\n      symbol\n      name\n      decimals\n      marketId\n      __typename\n    }\n    effectiveBorrowTokens {\n      id\n      symbol\n      name\n      decimals\n      marketId\n      __typename\n    }\n    effectiveUser {\n      id\n      __typename\n    }\n    amounts {\n      token {\n        id\n        symbol\n        name\n        decimals\n        marketId\n        __typename\n      }\n      expirationTimestamp\n      amountPar\n      amountWei\n      __typename\n    }\n    __typename\n  }\n}\n"
    }),
    approveMax: true,
    wBERA: beraB['wbera'],
    markets: {
      [beraB['wbera'].address]: {
        ...beraB['wbera'],
        underlyingToken: beraB['wbera']
      },
      [beraB['bera'].address]: {
        ...beraB['bera'],
        underlyingToken: beraB['bera']
      },
      [beraB['honey'].address]: {
        ...beraB['honey'],
        underlyingToken: beraB['honey']
      },
      [beraB['usdc'].address]: {
        ...beraB['usdc'],
        underlyingToken: beraB['usdc']
      },
      [beraB['eth'].address]: {
        ...beraB['eth'],
        marketId: '0',
        underlyingToken: beraB['eth']
      }
    }
  }
};

export default { basic, networks };
