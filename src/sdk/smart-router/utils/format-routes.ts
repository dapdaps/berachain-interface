import { providers } from "ethers";
import chains from "../config/chains";
import multicallAddresses from "../config/multicall";
import { multicall } from "./multicall";

export default async function formatRoutes({
  tokenAddresses,
  inputCurrency,
  outputCurrency
}: {
  tokenAddresses: string[];
  inputCurrency: any;
  outputCurrency: any;
}) {
  if (tokenAddresses.length === 2) {
    return {
      routes: [
        {
          token0: {
            symbol: inputCurrency.symbol
          },
          token1: {
            symbol: outputCurrency.symbol
          }
        }
      ]
    };
  }
  const rpcUrl = chains[inputCurrency.chainId].rpcUrls[0];
  const provider = new providers.JsonRpcProvider(rpcUrl);
  const multicallAddress = multicallAddresses[inputCurrency.chainId];
  const calls = tokenAddresses
    .filter((token, i) => i > 0 && i < tokenAddresses.length - 1)
    .map((token) => ({
      address: token,
      name: "symbol"
    }));

  const result = await multicall({
    abi: [
      {
        inputs: [],
        name: "symbol",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function"
      }
    ],
    calls,
    options: {},
    multicallAddress,
    provider
  });
  const routes: any = [];
  result.forEach((item: string[], i: number) => {
    if (i === 0) {
      routes.push({
        token0: {
          symbol: inputCurrency.symbol
        },
        token1: {
          symbol: result[i][0]
        }
      });
    } else {
      routes.push({
        token0: {
          symbol: result[i - 1][0]
        },
        token1: {
          symbol: result[i][0]
        }
      });
    }
    if (i === result.length - 1) {
      routes.push({
        token0: {
          symbol: result[i][0]
        },
        token1: {
          symbol: outputCurrency.symbol
        }
      });
    }
  });
  return {
    routes,
    symbols: result
  };
}
