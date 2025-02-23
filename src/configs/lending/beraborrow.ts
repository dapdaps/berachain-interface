import { beraB } from '@/configs/tokens/bera-bArtio';
import kodiak from '@/configs/swap/kodiak';

const basic = {
  name: 'Beraborrow',
  icon: '/images/dapps/beraborrow.png',
  path: '/lending/beraborrow',
};

const networks = {
  80084: {
    beraWrapper: '0x9F02e5740D06CaDbf8Dc26B3f082239dF75FDF3a',
    borrowerOperations: '0x7D1f193d97d514A22325e1E57AE82a2715d5ed67',
    collVaultRouter: '0xd257D6b56b2eE48A4B83e12F06b53195Dc4514D7',
    wrappedToken: beraB['wbera'],
    borrowToken: {
      ...beraB['nect'],
      symbol: 'NECT',
      earnToken: beraB['snect'],
    },
    // lt 160 = Risky, otherwise is Good
    riskyRatio: 160,
    liquidationReserve: 1,
    // 1-0.5%=0.995
    borrowingFee: 0.005,
    // Minimum Debt of 2 required
    minimumDebt: 2,
    multiCollateralHintHelpers: '0xa86Ba1FbC948834996c57d6F76D278395994CFD0',
    graphApi: 'https://api.goldsky.com/api/public/project_cm0v01jq86ry701rr6jta9tqm/subgraphs/bera-borrow-test/1.0.0/gn',
    denManagersParams: (markets: any[]) => ({
      operationName: 'MyQuery',
      variables: {},
      query: `
        query MyQuery {
          denManagers(where: {
            id_in: ${JSON.stringify(markets.map((m: any) => m.denManager.toLowerCase()))}}
          ) {
            id
            collateral {
              id
              price {
                id
                price
                timestamp
              }
              oracle
              symbol
              name
              decimals
            }
            totalCollateral
            totalDebt
            totalCollateralRatio
            totalBorrowingFeesPaid
            totalRedemptionFeesPaid
            rawTotalRedistributedCollateral
            rawTotalRedistributedDebt
            totalStakedAmount
            totalNumberOfDens
            liquidationCount
            redemptionCount
            cumulativeBorrowUSD
            cumulativeDepositUSD
            totalBorrowBalanceUSD
            totalDepositBalanceUSD
            totalValueLockedUSD
            interestRate
          }
        }
      `,
    }),
    priceParams: (markets: any[]) => {
      const tokens = JSON.stringify(markets.map((m: any) => m.isNative ? '0x0000000000000000000000000000000000000000' : m.address.toLowerCase()))
      return {
        operationName: 'MyQuery',
        variables: {},
        query: `
          query MyQuery {
            tokens(where: { id_in: ${tokens} }) {
              price {
                id
                price
              }
              id
              name
            }
          }
        `,
      };
    },
    borrowParams: (account: string) => {
      const id = JSON.stringify(account.toLowerCase());
      return {
        operationName: 'MyQuery',
        variables: {},
        query: `
          query MyQuery {
            user(id: ${id}) {
              id
              totalDepositVolumeInDen
              __typename
              dens {
                collateral
                debt
                status
                rawCollateral
                rawDebt
                id
                denManager {
                  collateral {
                    id
                    price {
                      id
                      price
                      timestamp
                    }
                    oracle
                    symbol
                    name
                    decimals
                  }
                }
              }
            }
          }
        `,
      };
    },
    markets: [
      {
        id: 1,
        ...beraB['honey'],
        underlyingTokens: [beraB['honey']],
        collToken: beraB['bhoney'],
        vault: 'collVaultRouter',
        collVault: beraB['bbhoney'].address,
        collVaultToken: beraB['bbhoney'],
        denManager: '0xa327715040e6d2051d7fdd4e42d4a8873cf9e2a7',
        approveSpender: '0xb35a972df0616924f85b99d7248880925eb82d52',
        collIndex: '3',
        // Ratio must be at least 120%
        MCR: 110,
        CCR: 150,
        TCR: 149,
      },
      {
        id: 2,
        ...beraB['bhoney'],
        // symbol: 'BBbHONEY',
        underlyingTokens: [beraB['bhoney']],
        collToken: beraB['bhoney'],
        vault: 'collVaultRouter',
        collVault: beraB['bbhoney'].address,
        collVaultToken: beraB['bbhoney'],
        denManager: '0xa327715040e6d2051d7fdd4e42d4a8873cf9e2a7',
        collIndex: '3',
        MCR: 110,
        CCR: 150,
        TCR: 149,
      },
      {
        id: 3,
        name: 'HONEY-USDC',
        symbol: 'HONEY-USDC',
        // symbol: "BBkHONEY-USDC",
        address: '0xb73dee52f38539ba854979eab6342a60dd4c8c03',
        decimals: 18,
        underlyingTokens: [beraB['honey'], beraB['usdc']],
        collToken: { symbol: 'HONEY-USDC', address: '0xb73dee52f38539ba854979eab6342a60dd4c8c03', decimals: 18 },
        vault: 'collVaultRouter',
        collVault: beraB['bbhoney-usdc'].address,
        collVaultToken: beraB['bbhoney-usdc'],
        denManager: '0x27db694ef869b0e531b6fe6be8a79fd7c22aa53d',
        collIndex: '4',
        linkDapp: kodiak,
        MCR: 110,
        CCR: 150,
        TCR: 235,
      },
      // +V
      {
        id: 4,
        ...beraB['ibgt'],
        // symbol: 'BBiBGT',
        underlyingTokens: [beraB['ibgt']],
        collToken: beraB['ibgt'],
        vault: 'collVaultRouter',
        collVault: beraB['bigbt'].address,
        collVaultToken: beraB['bigbt'],
        denManager: '0xcc2f6e3f342ed202d098302012a15ce6ad8eb511',
        collIndex: '2',
        MCR: 120,
        CCR: 150,
        TCR: 233,
      },
      {
        id: 5,
        ...beraB['ibgt'],
        underlyingTokens: [beraB['ibgt']],
        collToken: beraB['ibgt'],
        vault: 'borrowerOperations',
        collVault: beraB['ibgt'].address,
        collVaultToken: beraB['ibgt'],
        denManager: '0xa57f2370cde4efa3e9859668ca072f7672df2eeb',
        MCR: 120,
        CCR: 150,
        TCR: 276,
      },
      {
        id: 6,
        ...beraB['wbera'],
        underlyingTokens: [beraB['wbera']],
        collToken: beraB['wbera'],
        vault: 'borrowerOperations',
        collVault: beraB['wbera'].address,
        collVaultToken: beraB['wbera'],
        denManager: '0x3cda1f70731c6417f4675d3c6de9096b1ec6c399',
        MCR: 120,
        CCR: 150,
        TCR: 202,
      },
      {
        id: 7,
        ...beraB['bera'],
        underlyingTokens: [beraB['bera']],
        collToken: beraB['wbera'],
        vault: 'beraWrapper',
        collVault: beraB['wbera'].address,
        collVaultToken: beraB['wbera'],
        denManager: '0x3cda1f70731c6417f4675d3c6de9096b1ec6c399',
        MCR: 120,
        CCR: 150,
        TCR: 202,
      },
    ],
  }
};

export default { basic, networks };
