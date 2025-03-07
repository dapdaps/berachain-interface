import { bera } from '@/configs/tokens/bera';
import kodiak from '@/configs/swap/kodiak';

const basic = {
  name: 'Beraborrow',
  icon: '/images/dapps/beraborrow.png',
  path: '/lending/beraborrow',
};

const networks = {
  80094: {
    beraWrapper: '0x5f1619FfAEfdE17F7e54f850fe90AD5EE44dbf47',
    borrowerOperations: '0xDB32cA8f3bB099A76D4Ec713a2c2AACB3d8e84B9',
    collVaultRouter: '0x9158d1b0c9Cc4EC7640EAeF0522f710dADeE9a1B',
    wrappedToken: bera['wbera'],
    borrowToken: {
      ...bera['nect'],
      symbol: 'NECT',
      earnToken: bera['snect'],
    },
    // lt 160 = Risky, otherwise is Good
    riskyRatio: 160,
    liquidationReserve: 1,
    // 1-0.5%=0.995
    borrowingFee: 0.005,
    // Minimum Debt of 2 required
    minimumDebt: 69,
    multiCollateralHintHelpers: '0x4A91b96A615D133e4196655Bc1735430ec97A391',
    graphApi: 'https://api.goldsky.com/api/public/project_cm0v01jq86ry701rr6jta9tqm/subgraphs/bera-borrow-prod/1.0.0/gn',
    denManagersParams: (market: any[]) => ({
      "operationName": "GetDenManager",
      "variables": { "id": market?.denManager?.toLocaleLowerCase() },
      "query": "query GetDenManager($id: ID!) {\n  denManager(id: $id) {\n    interestRate\n    __typename\n  }\n}"
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
        ...bera['bera'],
        underlyingTokens: [bera['bera']],
        collToken: bera['bera'],
        vault: 'beraWrapper',
        collVault: "0x9158d1b0c9Cc4EC7640EAeF0522f710dADeE9a1B",
        denManager: '0xf1356Cb726C2988C65c5313350C9115D9Af0f954',
        MCR: 200,
        CCR: 150,
        TCR: 459,
        collIndex: 12
      },
    ],
  }
};

export default { basic, networks };
