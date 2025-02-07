import { beraB } from "@/configs/tokens/bera-bArtio";

const CONTRACT_ABI = {
  wrappedTokenGatewayV3ABI:
    "https://raw.githubusercontent.com/corndao/aave-v3-bos-app/main/abi/WrappedTokenGatewayV3ABI.json",
  erc20Abi:
    "https://raw.githubusercontent.com/corndao/aave-v3-bos-app/main/abi/ERC20Permit.json",
  aavePoolV3ABI:
    "https://raw.githubusercontent.com/corndao/aave-v3-bos-app/main/abi/AAVEPoolV3.json",
  variableDebtTokenABI:
    "https://raw.githubusercontent.com/corndao/aave-v3-bos-app/main/abi/VariableDebtToken.json",
  walletBalanceProviderABI:
    "https://raw.githubusercontent.com/corndao/aave-v3-bos-app/main/abi/WalletBalanceProvider.json"
};

const basic = {
  name: "Bend",
  type: "aave-v3",
  loaderName: "AaveV3",
  icon: "/images/dapps/bend.svg",
  path: "/lending/bend"
};

export const rewardToken = [
  {
    address: "0x656b95E550C07a9ffe548bd4085c72418Ceb1dba",
    symbol: "BGT",
    name: "$BGT",
    icon: "",
    unclaimed: ""
  }
];

const networks: any = {
  // beraB
  80084: {
    config: {
      chainName: "bera-bArtio",
      nativeCurrency: beraB["bera"], // attention this native currency
      nativeWrapCurrency: beraB["weth"],
      rpcUrl: "https://bartio.drpc.org",
      aavePoolV3Address: "0x30A3039675E5b5cbEA49d9a5eacbc11f9199B86D",
      PoolDataProvider: "0x6F71E53C46336b4D3C26Ea973613262B4B3782B8",
      wrappedTokenGatewayV3Address:
        "0x4EF762451e74bD725d866B3708e73281718d4Dfd",
      incentivesProxy: "0x25479a8Eac9ef427EeC1B48d21260672E1597f40", //CLAIM
      rewardAddress: "0x2E8410239bB4b099EE2d5683e3EF9d6f04E321CC"
    },
    rawMarkets: [
      {
        id: "1",
        underlyingAsset: beraB["honey"].address,
        icon: beraB["honey"].icon,
        decimals: beraB["honey"].decimals,
        symbol: beraB["honey"].symbol,
        name: beraB["honey"].name,
        supplyAPY: "",
        usageAsCollateralEnabled: true,
        borrowingEnabled: false,
        aTokenAddress: "0xD08391c5977ebF1a09bB5915908EF5cd95Edb7E0",
        variableDebtTokenAddress: "0x0bF0Eb9aE016A624E2149D4C5F47fD9276285C82",
        isIsolated: false,
        availableLiquidity: 0,
        availableLiquidityUSD: "",
        variableBorrowAPY: "",
        supportPermit: false,
        LTV: 0,
        supportBorrow: true
      },
      {
        id: "2",
        underlyingAsset: beraB["wbtc"].address,
        icon: beraB["wbtc"].icon,
        decimals: beraB["wbtc"].decimals,
        symbol: beraB["wbtc"].symbol,
        name: beraB["wbtc"].name,
        supplyAPY: "",
        usageAsCollateralEnabled: true,
        borrowingEnabled: false,
        aTokenAddress: "0x0ddb38F7D473e8040985Fa3B4116FDeEF89778bc",
        isIsolated: false,
        availableLiquidity: 0,
        availableLiquidityUSD: "",
        supportPermit: false,
        LTV: 0
      },
      {
        id: "3",
        underlyingAsset: beraB["weth"].address,
        icon: beraB["weth"].icon,
        decimals: beraB["weth"].decimals,
        symbol: beraB["weth"].symbol,
        name: beraB["weth"].name,
        supplyAPY: "",
        usageAsCollateralEnabled: true,
        borrowingEnabled: false,
        aTokenAddress: "0x8Ce5C1c42CD58B7aE61512790e514a82d84375Ed",
        isIsolated: false,
        availableLiquidity: 0,
        availableLiquidityUSD: "",
        supportPermit: false,
        LTV: 0
      }
    ],
    CONTRACT_ABI,
    rewardToken
  }
};

export default { basic, networks };
