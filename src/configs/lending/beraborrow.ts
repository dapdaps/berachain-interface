import { bera } from '@/configs/tokens/bera';
import kodiak from '@/configs/swap/kodiak';
import { DEFAULT_CHAIN_ID } from '@/configs';

const basic = {
  name: 'Beraborrow',
  icon: '/images/dapps/beraborrow.svg',
  path: '/lending/beraborrow',
  website: 'https://app.beraborrow.com/',
};

const assets = {
  ["KODI WBERA-iBGT"]: {
    chainId: DEFAULT_CHAIN_ID,
    address: "0x564f011d557aad1ca09bfc956eb8a17c35d490e0",
    symbol: "KODI WBERA-iBGT",
    name: "Kodiak Island WBERA-iBGT-0.3%",
    decimals: 18,
    icon: "",
  },
  ["KODI WBTC-WBERA"]: {
    chainId: DEFAULT_CHAIN_ID,
    address: "0xf06ea29fcf4765200742d29e685973a1870eac98",
    symbol: "KODI WBTC-WBERA",
    name: "Kodiak Island WBTC-WBERA-0.3%",
    decimals: 18,
    icon: "",
  },
  ["KODI WBERA-HONEY"]: {
    chainId: DEFAULT_CHAIN_ID,
    address: "0x4a254b11810b8ebb63c5468e438fc561cb1bb1da",
    symbol: "KODI WBERA-HONEY",
    name: "Kodiak Island WBERA-HONEY-0.3%",
    decimals: 18,
    icon: "",
  },
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
    riskyRatio: 220,
    liquidationReserve: 1,
    // 1-0.5%=0.995
    borrowingFee: 0.005,
    // Minimum Debt of 2 required
    minimumDebt: 69,
    multiCollateralHintHelpers: '0x4A91b96A615D133e4196655Bc1735430ec97A391',
    graphApi: 'https://api.goldsky.com/api/public/project_cm0v01jq86ry701rr6jta9tqm/subgraphs/bera-borrow-prod/1.0.9/gn',
    denManagersParams: (market: any) => ({
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
      {
        id: 2,
        ...bera['ibgt'],
        underlyingTokens: [bera['ibgt']],
        collToken: bera['ibgt'],
        vault: 'beraWrapper',
        collVault: "0xE59AB0C3788217e48399Dae3CD11929789e4d3b2",
        denManager: '0xD9Ae6F135e03F20596B9204403B741423C9597c5',
        MCR: 140,
        CCR: 150,
        TCR: 241,
        collIndex: 19
      },
      {
        id: 3,
        ...bera['wbtc'],
        underlyingTokens: [bera['wbtc']],
        collToken: bera['wbtc'],
        vault: 'beraWrapper',
        collVault: "0xAA2cBDe9f11f09ee9774D6d6C98dbB4792d9549a",
        denManager: '0x053EEbc21D5129CDB1abf7EAf09D59b19e75B8ce',
        MCR: 110,
        CCR: 150,
        TCR: 186,
        collIndex: 13
      },
      {
        id: 4,
        ...assets["KODI WBERA-iBGT"],
        underlyingTokens: [bera['wbera'], bera['ibgt']],
        collToken: assets["KODI WBERA-iBGT"],
        vault: 'beraWrapper',
        collVault: "0x933bD39CeDb5947523110c33E98bEa8480978adB",
        denManager: '0xbCdb96d989cFfa5d75dA93F0a4eAE8bf07F9dD6D',
        MCR: 140,
        CCR: 150,
        TCR: 340,
        collIndex: 18
      },
      {
        id: 5,
        ...assets["KODI WBTC-WBERA"],
        underlyingTokens: [bera['wbtc'], bera['wbera']],
        collToken: assets["KODI WBTC-WBERA"],
        vault: 'beraWrapper',
        collVault: "0xA8a3Dc9A75ec56C99287ad2Fd3b5E5f236d40DeE",
        denManager: '0x97BF0bf851e02F62664ded5cCBD582a16AAA36bC',
        MCR: 130,
        CCR: 150,
        TCR: 301,
        collIndex: 26
      },
      {
        id: 6,
        ...assets["KODI WBERA-HONEY"],
        underlyingTokens: [bera['wbera'], bera['honey']],
        collToken: assets["KODI WBERA-HONEY"],
        vault: 'beraWrapper',
        collVault: "0xfC3111435C6d4CD1431862346Ac9646d21752Bb0",
        denManager: '0xf872934CBD465952cb0Bc7735aF5EFE98e2ee4F2',
        MCR: 150,
        CCR: 150,
        TCR: 438,
        collIndex: 25
      },
    ],
  }
};

export default { basic, networks };
